import type { EmbedUrl } from "@neynar/nodejs-sdk/build/neynar-api/v2"
import { generateDreamboyPost, parseDreambotToken } from "../ai"
import { DEFAULT_DREAM_MODE, FARCASTER_ACCOUNT_USERNAME, TWITTER_ACCOUNT_USERNAME } from "../constants"
import type { FarcasterCastWebhook } from "../farcaster/types"
import { log } from "../logger"
import { dreambotDream } from "./dream"
import { createCast } from "../farcaster/actions"
import { paint } from "../ai/painter"
import type { MediaObjectV2, TweetV2 } from "twitter-api-v2"
import { postTweet } from "../twitter/api"

export async function parseDreamPost({
  text,
  imageUrl,
  agentId,
  tweetId,
  farcasterId,
}: {
  text: string
  imageUrl?: string
  agentId: string
  tweetId?: string
  farcasterId?: string
}) {
  log.info({ text, imageUrl, agentId, tweetId, farcasterId }, "Parsing dream post request")

  // Check if the post text is a token request so that we can send a reply in character if not
  const tokenRequest = await parseDreambotToken({
    message: text,
    hasImage: !!imageUrl,
    context: "post",
  })

  if (!tokenRequest.isTokenRequest) {
    log.info({ text, imageUrl, agentId, tweetId, farcasterId }, "User does not appear to be requesting a token")
    return { reply: "not-token-request", dream: null }
  }

  if (!tokenRequest.dreamToken) {
    log.info({ text, imageUrl, agentId, tweetId, farcasterId }, "Dreamboy parser response is missing metadata")
    return { reply: "missing-metadata", dream: null }
  }

  let image: ArrayBuffer

  if (imageUrl) {
    const imageResponse = await fetch(imageUrl)
    image = await imageResponse.arrayBuffer()
  } else {
    // Generate one ourselves from a parsed prompt or the description
    // @ts-expect-error There's something wrong with the schema for the response
    const prompt = tokenRequest.dreamToken.imagePrompt ?? tokenRequest.dreamToken.description
    const generation = await paint(prompt, DEFAULT_DREAM_MODE)
    image = await generation.arrayBuffer()
  }

  // We grab fields that were provided by the user, and dream up the rest
  log.info({ token: tokenRequest.dreamToken, text }, "Interpreting post as a dreamcoin request")

  // Create the dream
  const dream = await dreambotDream({
    name: tokenRequest.dreamToken.name,
    symbol: tokenRequest.dreamToken.symbol,
    description: tokenRequest.dreamToken.description,
    image,
    tweetId,
    farcasterId,
    agentId,
  })

  log.info({ text, imageUrl, agentId, tweetId, farcasterId, dream }, "Dreambot twitter dream created")
  return { reply: null, dream }
}

async function parseDreamFromPost({ text, imageUrl }: { text: string; imageUrl?: string }) {
  // First we check if the post text is a token request so that we can send a reply in character if not
  const tokenRequest = await parseDreambotToken({
    message: text,
    hasImage: !!imageUrl,
    context: "post",
  })

  if (!tokenRequest.isTokenRequest) {
    log.info({ text }, "User does not appear to be requesting a token")

    const post = await generateDreamboyPost({
      type: "not-token-request",
      context: "post",
      text,
    })

    return { reply: post, dream: null }
  }

  if (!tokenRequest.dreamToken) {
    log.info({ text, imageUrl }, "Dreamboy parser response is missing metadata")

    const post = await generateDreamboyPost({
      type: "missing-metadata",
      context: "post",
      text,
    })

    return { reply: post, dream: null }
  }

  let image: ArrayBuffer

  if (imageUrl) {
    const imageResponse = await fetch(imageUrl)
    image = await imageResponse.arrayBuffer()
  } else {
    // Generate one ourselves from a parsed prompt or the description
    // @ts-expect-error There's something wrong with the schema for the response
    const prompt = tokenRequest.dreamToken.imagePrompt ?? tokenRequest.dreamToken.description
    const generation = await paint(prompt, "dream")
    image = await generation.arrayBuffer()
  }

  // We grab fields that were provided by the user, and dream up the rest
  log.info({ ...tokenRequest.dreamToken }, "Interpreting post as a dreamcoin request")

  // Return the dream params
  return {
    reply: null,
    dream: {
      name: tokenRequest.dreamToken.name,
      symbol: tokenRequest.dreamToken.symbol,
      description: tokenRequest.dreamToken.description,
      image,
    },
  }
}

export async function handleTweetMention(tweet: TweetV2, media: MediaObjectV2[]) {
  log.info({ tweet, media }, "Handling tweet mention")

  // Skip spam tweets or threads that get unwieldy
  if (tweet.entities?.mentions && tweet.entities.mentions.length >= 5) {
    log.info({ tweet }, "Skipping tweet because it mentions too many users")
    return
  }

  const { text } = tweet
  const imageUrl = media.find(({ type }) => type === "photo")?.url // Just grab the first image, no intelligence here

  const { reply, dream } = await parseDreamFromPost({
    text: text.replace(`@${TWITTER_ACCOUNT_USERNAME}`, ""),
    imageUrl,
  })

  if (reply) {
    const result = await postTweet({ text: reply, replyTo: tweet.id })
    log.info({ tweet, reply, result }, "Dreamboy twitter reply sent")
  }
  if (dream) {
    const result = await dreambotDream({
      name: dream.name,
      symbol: dream.symbol,
      description: dream.description,
      image: dream.image,
      tweetId: tweet.id,
    })

    // We don't need to reply here because we'll do that after the token is deployed
    log.info({ tweet, dream: result }, "Dreambot twitter dream created")
  }
}

export async function handleCastMention(cast: FarcasterCastWebhook["data"]) {
  log.info({ cast }, "Handling cast mention")

  const { text, embeds } = cast

  // Image embeds have different formats
  const imageUrl = embeds.find((embed) => {
    if ("url" in embed) {
      return (
        embed.metadata?.content_type?.startsWith("image/") ||
        embed.url.startsWith("https://imagedelivery.net") ||
        embed.url.endsWith(".jpg") ||
        embed.url.endsWith(".png")
      )
    }

    return false
  }) as EmbedUrl | undefined

  const { reply, dream } = await parseDreamFromPost({
    text: text.replace(`@${FARCASTER_ACCOUNT_USERNAME}`, ""),
    imageUrl: imageUrl?.url,
  })

  if (reply) {
    const hash = await createCast(reply, { inReplyTo: cast.hash })
    log.info({ cast, reply, hash }, "Dreamboy farcaster reply sent")
  }
  if (dream) {
    const result = await dreambotDream({
      name: dream.name,
      symbol: dream.symbol,
      description: dream.description,
      image: dream.image,
      farcasterId: cast.hash,
    })

    // We don't need to reply here because we'll do that after the token is deployed
    log.info({ cast, dream: result }, "Dreambot farcaster dream created")
  }
}

// export async function handleDirectCast({
//   message,
//   history,
//   conversationId,
// }: {
//   message: WarpcastMessage
//   history: WarpcastMessage[]
//   conversationId: string
// }) {
//   log.info({ message, history, conversationId }, "Handling direct cast")

//   // Restrict conversation history to messages since the latest wow.xyz link
//   const lastTokenIdx = history.findIndex(({ message }) => message.includes("https://wow.xyz/0x"))
//   const recentHistory = lastTokenIdx > -1 ? history.slice(0, lastTokenIdx) : history

//   // Image search and parsing (done first in case the most recent message includes an image)
//   const mostRecentImageMessageIdx = recentHistory.findIndex(
//     ({ message }) => !!message.match(/https:\/\/imagedelivery\.net\/[\w-/]+/)
//   )

//   const mostRecentImage =
//     mostRecentImageMessageIdx > -1
//       ? recentHistory[mostRecentImageMessageIdx].message?.match(/https:\/\/imagedelivery\.net\/[\w-/]+/)?.[0]
//       : undefined

//   const messages = (message.messageId === history[0].messageId ? history.slice(1) : history).map((message) => {
//     const isBot = message.senderFid === FARCASTER_ACCOUNT_FID
//     return { role: isBot ? "assistant" : "user", content: message.message }
//   }) satisfies CoreMessage[]

//   log.info(
//     { image: mostRecentImage, idx: mostRecentImageMessageIdx, recents: recentMessages },
//     "Attempted to find recent image"
//   )

//   // If the most recent message is an image, and the only content is the image URL, we don't want to include it in the message history
//   if (mostRecentImageMessageIdx > -1) {
//     recentMessages[mostRecentImageMessageIdx].content = recentMessages[mostRecentImageMessageIdx].content.replace(
//       mostRecentImage ?? "",
//       "[IMAGE]"
//     )

//     if (mostRecentImageMessageIdx === 0) {
//       message.message = message.message.replace(mostRecentImage ?? "", "[IMAGE]")
//     }
//   }

//   const tokenRequest = await parseDreambotToken(message.message, recentMessages)
//   log.info({ tokenRequest }, "Parsed dreambot token request")

//   // if (!tokenRequest.isTokenRequest) {
//   //   log.info({ message, history, conversationId }, "User does not appear to be requesting a token")

//   //   const reply = await generateDreamboyPost({
//   //     type: "not-token-request",
//   //     context: "dm",
//   //     text: message.message,
//   //   })

//   //   const messageId = await sendMessage(conversationId, reply)
//   //   log.info({ message, reply, replyId: messageId, history }, "Dreamboy reply sent")

//   //   return
//   // }

//   // log.info({ ...tokenRequest.dreamToken }, "Interpreting direct cast as a dreamcoin request")

//   // if (!tokenRequest.dreamToken) {
//   //   log.info({ message, history, conversationId }, "Dreamboy parser response is missing metadata")

//   //   const reply = await generateDreamboyPost({
//   //     type: "missing-metadata",
//   //     context: "dm",
//   //     text: message.message,
//   //   })

//   //   const messageId = await sendMessage(conversationId, reply)
//   //   log.info({ message, reply, replyId: messageId, history }, "Dreamboy reply sent")

//   //   return
//   // }

//   // if (!mostRecentImage) {
//   //   log.info({ message, history, conversationId }, "No image found in recent messages")

//   //   const reply = await generateDreamboyPost({
//   //     type: "missing-image",
//   //     context: "dm",
//   //     text: message.message,
//   //   })

//   //   const messageId = await sendMessage(conversationId, reply)
//   //   log.info({ message, reply, replyId: messageId, history }, "Dreamboy reply sent")

//   //   return
//   // }

//   // log.info("All token metadata found, creating dream")

//   // const messageId = await sendMessage(conversationId, "Creating your dream token...")
//   // log.info({ messageId, conversationId }, "Dream token creation message sent")

//   // const imageResponse = await fetch(mostRecentImage)
//   // const image = Buffer.from(await imageResponse.arrayBuffer())

//   // const dream = await dreambotDream({
//   //   ...tokenRequest.dreamToken,
//   //   farcasterConversationId: conversationId,
//   //   image,
//   // })

//   // log.info({ ...dream }, "Dreambot private dream created")
//   // return dream
// }
