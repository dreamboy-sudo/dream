import { dreamSchema, type Dream } from "../lib/types"
import type { SendTweetParams } from "../twitter/api"
import { client } from "./client"

export async function getDream(key: string): Promise<Dream | null> {
  const data = await client.hgetall(`dream:${key}`)

  if (!data) {
    return null
  }

  return dreamSchema.parse(data)
}

export async function setDream(key: string, dream: Dream) {
  await client.hset(`dream:${key}`, dream)
}

export async function isDreamer(key: string) {
  const data = await client.get(`dreamer:${key}`)
  return data === "1"
}

export async function setTemporaryDreamer(key: string) {
  await client.set(`dreamer:${key}`, "1", "EX", 60 * 1.5) // 90 seconds
}

export async function clearTemporaryDreamer(key: string) {
  await client.del(`dreamer:${key}`)
}

export async function addSeenMessage(key: string) {
  await client.sadd("farcaster:messages", key)
}

export async function hasSeenMessage(key: string) {
  const data = await client.sismember("farcaster:messages", key)
  return data === 1
}

export async function clearSeenMessage(key: string) {
  await client.srem("farcaster:messages", key)
}

export async function getLatestMention() {
  const data = await client.get("twitter:latestmention")
  return data
}

export async function setLatestMention(key: string) {
  await client.set("twitter:latestmention", key)
}

export async function addSeenMention(key: string) {
  await client.sadd("twitter:mentions", key)
}

export async function hasSeenMention(key: string) {
  const data = await client.sismember("twitter:mentions", key)
  return data === 1
}

export async function clearSeenMention(key: string) {
  await client.srem("twitter:mentions", key)
}

export async function addQueuedTweet(payload: SendTweetParams) {
  await client.rpush("twitter:queue", JSON.stringify(payload))
}

export async function getQueuedTweet() {
  const data = await client.lpop("twitter:queue")
  return data ? (JSON.parse(data) as SendTweetParams) : null
}

export async function getQueuedTweetCount() {
  return await client.llen("twitter:queue")
}
