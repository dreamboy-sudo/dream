import Redis, { type RedisOptions } from "ioredis"

const url = process.env.REDIS_URL

export function getClient(options?: RedisOptions) {
  if (!url) {
    throw new Error("REDIS_URL is required in environment")
  }

  if (options) {
    return new Redis(url, options)
  } else {
    return new Redis(url)
  }
}

export const client = getClient()
