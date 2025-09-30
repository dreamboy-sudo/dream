import type { PostCastReqBodyEmbeds } from "@neynar/nodejs-sdk/build/neynar-api/v2"
import { log } from "../logger"
import { SIGNER_UUID } from "./client"

import { client } from "./client"

const FARCASTER_API_KEY = process.env.FARCASTER_API_KEY as string

if (!FARCASTER_API_KEY) {
  throw new Error("FARCASTER_API_KEY is required in environment")
}

const SEND_CASTS = process.env.SEND_CASTS === "true"

export type WarpcastMessage = {
  messageId: string
  senderFid: number
  message: string
  creationTimestamp: number
  isDeleted: boolean
  isProgrammatic: boolean
}

export type WarpcastConversation = {
  conversationId: string
  participantFids: number[]
  settings: {
    messageTTLDays: number
  }
  creationTimestamp: number
  lastModifiedTimestamp: number
  lastMessage?: WarpcastMessage
}

export async function getUser(username: string) {
  const result = await client.lookupUserByUsernameV2(username)
  return result.user
}

export async function getCast(hash: string) {
  const result = await client.lookUpCastByHashOrWarpcastUrl(hash, "hash")
  return result.cast
}

export async function createCast(
  text: string,
  options?: {
    inReplyTo?: string // The hash or URL of the cast to reply to
    channel?: string // The ID of the channel to post to
    embeds?: PostCastReqBodyEmbeds[] // A list of embeds (casts or links)
  }
) {
  if (!SEND_CASTS) {
    log.warn({ text }, "Not sending cast, feature flag disabled")
    return
  }

  const result = await client.publishCast(SIGNER_UUID, text, {
    replyTo: options?.inReplyTo,
    channelId: options?.channel,
    embeds: options?.embeds,
  })

  const { hash } = result
  log.info({ hash }, "Cast posted successfully")

  return hash
}

export async function getInbox() {
  const { result } = await makeWarpcastAPIRequest<{
    result: {
      conversations: WarpcastConversation[]
    }
    next: {
      cursor: string
    }
  }>({
    path: "/conversation-list",
  })

  return result.conversations
}

export async function getConversationMessages(conversationId: string) {
  const { result } = await makeWarpcastAPIRequest<{
    result: {
      messages: WarpcastMessage[]
    }
    next: {
      cursor: string
    }
  }>({
    path: `/message-list?conversationId=${conversationId}`,
  })

  return result.messages
}

export async function sendMessage(conversationId: string, text: string, inReplyTo?: string) {
  const { result } = await makeWarpcastAPIRequest<{
    result: {
      messageId: string
    }
  }>({
    path: `/message`,
    method: "PUT",
    body: {
      conversationId,
      message: text,
      ...(inReplyTo ? { inReplyToMessageId: inReplyTo } : {}),
    },
  })

  return result.messageId
}

export async function makeWarpcastAPIRequest<T>({
  path,
  method = "GET",
  body,
}: {
  path: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: Record<string, unknown>
}): Promise<T> {
  const result = await fetch(`https://api.warpcast.com/fc${path}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Authorization: `Bearer ${FARCASTER_API_KEY}`,
      "Content-Type": "application/json",
    },
  })

  if (!result.ok) {
    const reason = await result.text()
    throw new Error(`Warpcast API request failed: ${reason}`)
  }

  return (await result.json()) as T
}
