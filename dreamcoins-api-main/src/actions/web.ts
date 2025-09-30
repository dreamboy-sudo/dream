import { AGENT_PLATFORM_TOKEN, AGENT_PLATFORM_URL, getWOWUrl, WEB_API_TOKEN } from "../constants"
import { z } from "zod"
import { WEB_API_URL } from "../constants"
import type { Dream } from "../lib/types"
import { log } from "../logger"

export const webappSchema = z.object({
  dreamId: z.number(),
  name: z.string(),
  ticker: z.string(),
  imageUrl: z.string().url(),
  prompt: z.string(),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
  address: z.string().optional(),
  error: z.string().optional(),
})

type WebappWebhook = z.infer<typeof webappSchema> & {
  webhookSecret: string
}

export function getWebappPayload(dream: Dream): z.infer<typeof webappSchema> {
  let status: "PENDING" | "COMPLETED" | "FAILED" = "PENDING"
  if (dream.status === "success") {
    status = "COMPLETED"
  } else if (dream.status === "failed") {
    status = "FAILED"
  }

  // Recover the ID and determine if it's numeric
  let dreamId = parseInt(dream.id)
  if (isNaN(dreamId) || dreamId.toString() !== dream.id) {
    dreamId = 0
  }

  return {
    dreamId,
    name: dream.name,
    ticker: dream.symbol,
    imageUrl: dream.imageUrl,
    prompt: dream.prompt ?? "",
    address: dream.tokenAddress,
    status,
  }
}

export async function notifyWebapp(dream: Dream) {
  const payload = getWebappPayload(dream)

  const response = await fetch(`${WEB_API_URL}/webhook/dream`, {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      webhookSecret: WEB_API_TOKEN,
    } satisfies WebappWebhook),
  })

  if (response.ok) {
    log.info({ ...dream }, "Notified webapp of dream")
  } else {
    const body = await response.text()
    log.error({ response: body }, "Failed to notify webapp of dream")
  }
}

export async function notifyAgentPlatform(agentId: string, dream: Dream) {
  if (!dream.tokenAddress) {
    log.warn({ agentId, dream }, "Dream doesn't have a token address, can't notify the agent platform")
    return
  }

  const payload = {
    agentId,
    dream: {
      name: dream.name,
      symbol: dream.symbol,
      description: dream.description,
      imageUrl: dream.imageUrl,
      tweetId: dream.creatorTweetId,
      farcasterId: dream.creatorFarcasterId,
      address: dream.tokenAddress,
      url: getWOWUrl(dream.tokenAddress),
    },
  }

  const response = await fetch(`${AGENT_PLATFORM_URL}/webhooks/dreamcoins`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${AGENT_PLATFORM_TOKEN}`,
      "Content-Type": "application/json",
    },
  })

  if (response.ok) {
    log.info({ dream }, "Notified agent platform of dream")
  } else {
    const body = await response.text()
    log.error({ dream, response: body }, "Failed to notify agent platform of dream")
  }
}
