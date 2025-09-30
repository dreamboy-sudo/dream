import { UnrecoverableError, Worker, type JobsOptions } from "bullmq"
import { log } from "../logger"
import { QUEUES, inboxQueue, mentionsQueue, messagesQueue, postsQueue, sharedConnection } from "./queues"
import { getConversationMessages, getInbox, type WarpcastMessage } from "../farcaster/actions"
import { FARCASTER_ACCOUNT_FID } from "../constants"
import {
  addSeenMention,
  addSeenMessage,
  clearSeenMessage,
  getLatestMention,
  hasSeenMention,
  hasSeenMessage,
  setLatestMention,
} from "../cache"
import type { FarcasterCastWebhook } from "../farcaster/types"
import { handleCastMention, handleTweetMention } from "../actions/dreambot"
import type { MediaObjectV2, TweetV2 } from "twitter-api-v2"
import { getMentions } from "../twitter/api"

export async function queueInboxJob(options?: JobsOptions) {
  const job = await inboxQueue.add(QUEUES.Inbox, {}, options)
  log.info({ jobId: job.id }, "Queued inbox job")
}

export async function queueMentionsJob(options?: JobsOptions) {
  const job = await mentionsQueue.add(QUEUES.Mentions, {}, options)
  log.info({ jobId: job.id }, "Queued mentions job")
}

export async function queueMessageJob(message: WarpcastMessage, conversationId: string, delay = 0) {
  const job = await messagesQueue.add(QUEUES.Messages, { type: "farcaster", message, conversationId }, { delay })
  log.info({ jobId: job.id, conversationId }, "Queued message job")
}

export async function queueFarcasterPostJob(post: FarcasterCastWebhook["data"], delay = 0) {
  const job = await postsQueue.add(QUEUES.Posts, { type: "farcaster", post }, { delay })
  log.info({ jobId: job.id, postId: post.hash }, "Queued post job")
}

export async function queueTwitterPostJob(tweet: TweetV2, media: MediaObjectV2[], delay = 0) {
  const job = await postsQueue.add(QUEUES.Posts, { type: "twitter", tweet, media }, { delay })
  log.info({ jobId: job.id, tweetId: tweet.id }, "Queued post job")
}

export const inboxWorker = new Worker(
  QUEUES.Inbox,
  async () => {
    log.debug("Running inbox check")

    try {
      const conversations = await getInbox()
      for (const conversation of conversations) {
        // Check for a message not sent from us that hasn't been seen yet
        const message = conversation.lastMessage
        if (!message || message.senderFid === FARCASTER_ACCOUNT_FID) {
          log.debug(
            { conversationId: conversation.conversationId, message },
            "Latest message in conversation is not found or from us"
          )
          continue
        }

        const seenMessage = await hasSeenMessage(message.messageId)
        if (seenMessage) {
          log.debug(
            { conversationId: conversation.conversationId, message },
            "Latest message in conversation has already been seen"
          )
          continue
        }

        // Unprocessed message, dispatch a job to handle it
        await queueMessageJob(message, conversation.conversationId)
      }
    } catch (error: unknown) {
      log.error({ error }, "Error checking inbox")
      throw new UnrecoverableError("Error checking inbox") // No need to retry, we'll run again soon
    }
  },
  {
    connection: sharedConnection,
    concurrency: 1,
    autorun: false,
  }
)

inboxWorker.on("error", (error) => {
  log.error({ error: error.message }, "Inbox worker error")
})

export const mentionsWorker = new Worker(
  QUEUES.Mentions,
  async () => {
    log.debug("Running mentions check")

    const latestMentionId = await getLatestMention()
    const { tweets: mentions } = await getMentions(latestMentionId ?? undefined)

    if (mentions.length === 0) {
      log.debug("No new mentions found")
      return
    }

    log.info({ count: mentions.length }, "Found new mentions")

    // Spread these out a bit
    let delay = 0

    for (const mention of mentions) {
      const seen = await hasSeenMention(mention.tweet.id)
      if (seen) {
        log.warn({ mentionId: mention.tweet.id }, "Mention has already been seen")
        continue
      }

      await queueTwitterPostJob(mention.tweet, mention.media, delay)
      await addSeenMention(mention.tweet.id)
      delay += 5000
    }

    log.info({ count: mentions.length }, "Queued mention handling jobs")

    // Update the latest mention ID
    await setLatestMention(mentions[0].tweet.id)
    log.info({ mentionId: mentions[0].tweet.id }, "Updated latest mention ID")
  },
  {
    connection: sharedConnection,
    concurrency: 1,
    autorun: false,
  }
)

mentionsWorker.on("error", (error) => {
  log.error({ error }, "Mentions worker error")
})

export const messagesWorker = new Worker<{ type: "farcaster"; conversationId: string; message: WarpcastMessage }>(
  QUEUES.Messages,
  async ({ data }) => {
    log.info({ ...data }, "Handling new message in conversation")

    const { conversationId, message } = data

    try {
      // Mark message as seen since we're processing it
      await addSeenMessage(message.messageId)

      // Fetch recent messages in conversation
      const conversation = await getConversationMessages(conversationId)
      log.info({ conversationId, messages: conversation }, "Fetched conversation messages")

      // TODO: re-enable this
      // await handleDirectCast({ conversationId, message, history: conversation })
    } catch (error) {
      // Mark the message as unhandled so we retry
      log.error({ error }, "Error handling message in conversation")
      await clearSeenMessage(message.messageId)
    }
  },
  {
    connection: sharedConnection,
    concurrency: 10,
    autorun: false,
  }
)

messagesWorker.on("error", (error) => {
  log.error({ error }, "Messages worker error")
})

export type PostsWorkerJobData =
  | {
      type: "farcaster"
      post: FarcasterCastWebhook["data"]
    }
  | {
      type: "twitter"
      tweet: TweetV2
      media: MediaObjectV2[]
    }

export const postsWorker = new Worker<PostsWorkerJobData>(
  QUEUES.Posts,
  async ({ data }) => {
    log.info({ ...data }, "Handling new post")

    switch (data.type) {
      case "farcaster":
        await handleCastMention(data.post)
        break
      case "twitter":
        await handleTweetMention(data.tweet, data.media)
        break
    }
  },
  {
    connection: sharedConnection,
    concurrency: 10,
    autorun: false,
  }
)

postsWorker.on("error", (error) => {
  log.error({ error }, "Posts worker error")
})
