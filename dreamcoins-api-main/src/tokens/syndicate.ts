import type { Dream } from "../lib/types"
import { CHAIN_ID, DREAMCOINS_ADDRESS, getDreamcoinsUrl, WOW_CONTRACT_ADDRESS } from "../constants"
import { log } from "../logger"
import { getDream, setDream } from "../cache"
import { z } from "zod"
import { sendTelegramMessage } from "../telegram/bot"
import { notifyAgentPlatform, notifyWebapp } from "../actions/web"
import { parseTokenAddress } from "./web3"
import { postTweet } from "../twitter/api"
import { generateDreamboyPost } from "../ai"
import { createCast, sendMessage } from "../farcaster/actions"

const SYNDICATE_API_TOKEN = process.env.SYNDICATE_API_TOKEN as string
const SYNDICATE_PROJECT_ID = process.env.SYNDICATE_PROJECT_ID as string

if (!SYNDICATE_API_TOKEN || !SYNDICATE_PROJECT_ID) {
  throw new Error("SYNDICATE_API_TOKEN and SYNDICATE_PROJECT_ID are required in environment")
}

export const syndicateWebhookSchema = z.object({
  eventType: z.string(),
  data: z.object({
    chainId: z.number(),
    transactionId: z.string(),
    transactionHash: z.string(),
    status: z.enum(["PENDING", "PROCESSED", "SUBMITTED", "CONFIRMED", "PAUSED", "ABANDONED"]),
    reverted: z.boolean().optional(),
  }),
})

export async function deployDreamcoin({
  name,
  symbol,
  metadataIpfsHash,
  creatorWalletAddress,
}: Pick<Dream, "name" | "symbol" | "metadataIpfsHash" | "creatorWalletAddress">) {
  const response = await fetch("https://api.syndicate.io/transact/sendTransaction", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SYNDICATE_API_TOKEN}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      projectId: SYNDICATE_PROJECT_ID,
      contractAddress: WOW_CONTRACT_ADDRESS,
      chainId: CHAIN_ID,
      // prettier-ignore
      functionSignature: "deploy(address _tokenCreator, address _platformReferrer, string _tokenURI, string _name, string _symbol)",
      // From Zora contract
      // @notice Deploys a Wow ERC20 token
      // @param _tokenCreator The address of the token creator
      // @param _platformReferrer The address of the platform referrer
      // @param _tokenURI The ERC20z token URI
      // @param _name The ERC20 token name
      // @param _symbol The ERC20 token symbol
      args: {
        _tokenCreator: creatorWalletAddress,
        _platformReferrer: DREAMCOINS_ADDRESS,
        _tokenURI: `ipfs://${metadataIpfsHash}`,
        _name: name,
        _symbol: symbol,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to send dreamcoin deploy transaction: ${response.statusText}`)
  }

  const data = await response.json()
  log.info({ ...(data as Record<string, unknown>) }, "Dreamcoin deployed")

  const transactionId = (data as Record<string, unknown>).transactionId as string
  return { transactionId }
}

export async function handleTransactionWebhook({ data }: z.infer<typeof syndicateWebhookSchema>) {
  log.info({ data }, "Handling Syndicate webhook")

  const dream = await getDream(data.transactionId)

  if (!dream) {
    log.error({ transactionId: data.transactionId }, "Dream not found")
    throw new Error("Dream not found")
  }

  // See Syndicate docs for status meanings: https://docs.syndicate.io/guides/transactions#register-a-webhook-for-transaction-status
  if (data.status !== "SUBMITTED") {
    log.info(
      { transactionId: data.transactionId, status: data.status },
      "Transaction not yet confirmed, not taking action"
    )
    return
  }

  const failed = data.reverted ?? false
  if (failed) {
    dream.status = "failed"
    log.info({ ...dream }, "Dream failed to deploy")
  } else {
    dream.status = "success"
    dream.transactionHash = data.transactionHash
    log.info({ ...dream }, "Dream launched onchain")
  }

  // Try to parse the token address from the transaction logs
  const tokenAddress = await parseTokenAddress(data.transactionHash as `0x${string}`)
  if (tokenAddress) {
    dream.tokenAddress = tokenAddress
  }

  await setDream(dream.transactionId, dream)

  if (dream.tokenAddress) {
    // Notify the webapp which persists the dream in our database
    await notifyWebapp(dream)

    // Notify the creator if the dream came from Telegram, Farcaster, or Twitter
    if (dream.creatorTelegramId) {
      const recipient = parseInt(dream.creatorTelegramId)
      await sendTelegramMessage(recipient, `$${dream.symbol} is now onchain, buy it here:`)
      await sendTelegramMessage(recipient, `${getDreamcoinsUrl(dream.tokenAddress)}`)
      await sendTelegramMessage(recipient, "(It may take up to 60 seconds for the token to appear on WOW)")
    }
    if (dream.farcasterConversationId) {
      const post = await generateDreamboyPost({
        type: "token-deployed",
        context: "dm",
        dream,
      })

      await sendMessage(dream.farcasterConversationId, getDreamcoinsUrl(dream.tokenAddress))
      await sendMessage(dream.farcasterConversationId, post)
      log.info({ dream }, "Dreamboy direct message reply sent")
    }
    if (dream.agentId) {
      // Notify the agent platform that the dream is ready so that the appropriate agent can take action
      await notifyAgentPlatform(dream.agentId, dream)
    } else {
      // Post on socials if we didn't notify an agent
      if (dream.creatorFarcasterId) {
        const post = await generateDreamboyPost({
          type: "token-deployed",
          context: "post",
          dream,
        })

        const hash = await createCast(post, {
          inReplyTo: dream.creatorFarcasterId,
          embeds: [{ url: getDreamcoinsUrl(dream.tokenAddress) }],
        })

        log.info({ hash }, "Dreamboy reply sent")
      }
      if (dream.creatorTweetId) {
        const post = await generateDreamboyPost({
          type: "token-deployed",
          context: "post",
          dream,
        })

        const result = await postTweet({
          text: `${post} ${getDreamcoinsUrl(dream.tokenAddress)}`,
          replyTo: dream.creatorTweetId,
        })

        log.info({ reply: post, dream, result }, "Dreamboy twitter reply sent")
      }
    }
  } else {
    log.info({ dream }, "Dream has no token address")
  }

  return dream
}
