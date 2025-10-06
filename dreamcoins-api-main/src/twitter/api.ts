import {
  EUploadMimeType,
  TwitterApi,
  type SendTweetV2Params,
  TwitterV2IncludesHelper,
  ApiResponseError,
} from "twitter-api-v2"
import type { Dream } from "../lib/types"
import { log } from "../logger"
import { TWITTER_ACCOUNT_ID } from "../constants"
import { addQueuedTweet, getQueuedTweetCount } from "../cache"

const CONSUMER_KEY = process.env.TWITTER_API_KEY as string
const CONSUMER_SECRET = process.env.TWITTER_API_SECRET as string

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN as string
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN as string
const TWITTER_ACCESS_SECRET = process.env.TWITTER_ACCESS_SECRET as string

if (!CONSUMER_KEY || !CONSUMER_SECRET) {
  throw new Error("Twitter API key missing from environment variables")
}

// We need either a bearer token or user credentials
if (!TWITTER_BEARER_TOKEN && (!TWITTER_ACCESS_TOKEN || !TWITTER_ACCESS_SECRET)) {
  throw new Error("Twitter bearer token or user credentials missing from environment variables")
}

let client: TwitterApi

if (TWITTER_ACCESS_TOKEN && TWITTER_ACCESS_SECRET) {
  client = new TwitterApi({
    appKey: CONSUMER_KEY,
    appSecret: CONSUMER_SECRET,
    accessToken: TWITTER_ACCESS_TOKEN,
    accessSecret: TWITTER_ACCESS_SECRET,
  })
} else {
  client = new TwitterApi(TWITTER_BEARER_TOKEN)
}

export async function getUser(username: string) {
  return client.v2.userByUsername(username)
}

export async function getMentions(stopAt?: string) {
  // TODO: Pagination
  const result = await client.v2.userMentionTimeline(TWITTER_ACCOUNT_ID, {
    since_id: stopAt,
    max_results: 100,
    "media.fields": ["type", "url"],
    expansions: ["attachments.media_keys", "entities.mentions.username"],
  })

  const includes = new TwitterV2IncludesHelper(result)

  const tweets = result.tweets.map((tweet) => ({
    tweet,
    media: includes.media,
  }))

  return { tweets }
}

async function uploadImage(image: Buffer) {
  return client.v1.uploadMedia(image, { mimeType: EUploadMimeType.Png })
}

export type SendTweetParams = { text: string; mediaId?: string; replyTo?: string }

export async function postTweet({ text, mediaId, replyTo }: SendTweetParams) {
  const params: SendTweetV2Params = { text }
  if (mediaId) {
    params.media = { media_ids: [mediaId] }
  }
  if (replyTo) {
    params.reply = { in_reply_to_tweet_id: replyTo }
  }

  try {
    const result = await client.v2.tweet(params)
    return result
  } catch (error) {
    if (error instanceof ApiResponseError && error.rateLimitError && error.rateLimit) {
      log.error({ error, rateLimit: error.rateLimit }, "Twitter rate limit hit")
      // Queue the tweet so we can post it later
      await addQueuedTweet({ text, mediaId, replyTo })
      const count = await getQueuedTweetCount()
      log.info({ text, mediaId, replyTo, queued: count }, "Tweet queued for later")
    } else {
      log.error({ error }, "Error posting tweet")
    }

    return null
  }
}

export async function tweetDreamcoin(dream: Dream) {
  // Ensure we're authenticated
  const user = await client.currentUser()
  if (!user) {
    throw new Error("Not authenticated")
  }

  // Fetch the image
  const image = await fetch(dream.imageUrl)
  const blob = await image.blob()
  const buffer = Buffer.from(await blob.arrayBuffer())

  // Upload the image and send the tweet
  const mediaId = await uploadImage(buffer)
  const result = await postTweet({
    text: `$${dream.symbol} has entered the world of dreams`,
    mediaId,
  })

  if (!result) {
    throw new Error("Failed to tweet dreamcoin")
  }

  const url = `https://x.com/${user.screen_name}/status/${result.data.id}`
  log.info({ ...result.data, url }, "Dreamcoin was tweeted")

  return {
    ...result.data,
    url,
  }
}
