import { Readable } from "stream"
import { generateDream } from "../ai"
import { paint } from "../ai/painter"
import { nanoid } from "../lib/utils"
import { log } from "../logger"
import { uploadToBucket } from "../storage/google"
import { uploadImageToPinata, uploadMetadataToPinata } from "../storage/pinata"
import { type Dream, type DreamMode } from "../lib/types"
import { deployDreamcoin } from "../tokens/syndicate"
import { setDream } from "../cache"
import { DEFAULT_DREAM_MODE, DREAMCOINS_ADDRESS, SUBMIT_DREAMS_ONCHAIN } from "../constants"
import { fileTypeFromBuffer } from "file-type"

const DREAM_DESCRIPTION_METADATA_PREFIX = `\
 is a dreamcoin created on dreamcoins.fun. All creator fees from this dreamcoin will be used to buy & burn $DREAM.\n\n\
`

async function deployDream({
  id,
  name,
  symbol,
  image,
  description,
  walletAddress,
  tweetId,
  telegramId,
  farcasterId,
  farcasterConversationId,
  agentId,
  noDeploy = false,
}: {
  id: string
  name: string
  symbol: string
  image: ArrayBuffer
  description: string
  walletAddress: string
  tweetId?: string
  telegramId?: string
  farcasterId?: string
  farcasterConversationId?: string
  agentId?: string
  noDeploy?: boolean
}) {
  // Get the image's file type and ensure it's supported
  const fileType = await fileTypeFromBuffer(image)
  if (!fileType || (!fileType.mime.startsWith("image/") && !fileType.mime.startsWith("video/"))) {
    throw new Error(`Unsupported image file type: ${fileType?.mime}`)
  }

  // Upload the image to storage
  const filename = `${symbol}-${nanoid(16)}.${fileType.ext}`
  const imageBuffer = Buffer.from(image)

  const imageUrl = await uploadToBucket(imageBuffer, filename)

  if (noDeploy) {
    // Don't upload anything else or deploy, just return this potential dream
    return {
      id,
      name,
      symbol,
      description,
      imageUrl,
      creatorWalletAddress: walletAddress,
      status: "undeployed",
      imageIpfsHash: "",
      metadataIpfsHash: "",
      transactionId: "",
    } satisfies Dream
  }

  // Upload the token metadata to IPFS (used by WOW)
  const stream = Readable.from(imageBuffer)
  const imageIpfsHash = await uploadImageToPinata(stream as unknown as ReadableStream, filename)

  const metadata = {
    name,
    symbol,
    description: `$${symbol}${DREAM_DESCRIPTION_METADATA_PREFIX}${description}`,
    websiteLink: "",
    twitter: "",
    discord: "",
    telegram: "",
    nsfw: false,
    image: `ipfs://${imageIpfsHash}`,
  }

  const metadataIpfsHash = await uploadMetadataToPinata(id, name, metadata)

  let transactionId = ""

  if (SUBMIT_DREAMS_ONCHAIN) {
    // Trigger the deployment of the dreamcoin onchain
    const response = await deployDreamcoin({
      name,
      symbol,
      creatorWalletAddress: walletAddress,
      metadataIpfsHash,
    })

    transactionId = response.transactionId
  } else {
    // Don't send a transaction request
    transactionId = `0xFAKE-${nanoid(12)}`
  }

  const dream = {
    id,
    name,
    symbol,
    description,
    imageUrl,
    imageIpfsHash,
    metadataIpfsHash,
    creatorWalletAddress: walletAddress,
    creatorTweetId: tweetId,
    creatorTelegramId: telegramId,
    creatorFarcasterId: farcasterId,
    farcasterConversationId,
    status: "pending",
    transactionId,
    agentId,
  } satisfies Dream

  // Persist the dream so we're ready for status updates
  await setDream(transactionId, dream)

  log.info({ ...dream }, "Dream created")
  return dream
}

export async function dream({
  id,
  prompt,
  mode = DEFAULT_DREAM_MODE,
  walletAddress,
  telegramId,
  farcasterId,
  noDeploy = false,
}: {
  id: string
  prompt: string
  mode?: DreamMode
  walletAddress: string
  telegramId?: string
  farcasterId?: string
  noDeploy?: boolean
}): Promise<Dream> {
  log.info({ id, prompt, mode, walletAddress }, "Starting to dream")

  // Create the dream structure and painting
  const [generation, image] = await Promise.all([generateDream(prompt), paint(prompt, mode)])

  const buffer = await image.arrayBuffer()

  const dream = await deployDream({
    id,
    ...generation,
    image: buffer,
    walletAddress,
    telegramId,
    farcasterId,
    noDeploy,
  })

  return dream
}

export async function dreamToken({
  id,
  name,
  symbol,
  imageUrl,
  description,
  walletAddress,
}: {
  id: string
  name: string
  symbol: string
  imageUrl: string
  description?: string
  walletAddress: string
}) {
  log.info({ id, name, symbol, imageUrl }, "Dreaming exact token")

  // Download the image
  const response = await fetch(imageUrl)
  const image = await response.arrayBuffer()

  const dream = await deployDream({
    id,
    name,
    symbol,
    image,
    description: description ?? "",
    walletAddress,
  })

  return dream
}

export async function dreambotDream({
  name,
  symbol,
  description,
  image,
  tweetId,
  farcasterId,
  farcasterConversationId,
  agentId,
}: {
  name: string
  symbol: string
  description: string
  image: ArrayBuffer
  tweetId?: string
  farcasterId?: string
  farcasterConversationId?: string
  agentId?: string
}): Promise<Dream> {
  log.info({ name, symbol, description, farcasterId, farcasterConversationId }, "Dreaming from dreambot")

  // Some sort of reference ID is required here
  if (!farcasterId && !farcasterConversationId && !tweetId) {
    throw new Error("Either farcaster ID, tweet ID, or conversation ID is required")
  }

  const dream = await deployDream({
    id: nanoid(10),
    name,
    symbol,
    image,
    description,
    walletAddress: DREAMCOINS_ADDRESS,
    farcasterId,
    farcasterConversationId,
    tweetId,
    agentId,
  })

  return dream
}
