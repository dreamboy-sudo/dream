import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { bearerAuth } from "hono/bearer-auth"
import { API_TOKEN, DREAMCOINS_ADDRESS, FARCASTER_ACCOUNT_FID, FARCASTER_ACCOUNT_USERNAME } from "./constants"
import { log } from "./logger"
import { addBotCallbacks } from "./telegram/bot"
import { dream, dreamToken } from "./actions/dream"
import { z } from "zod"
import { handleTransactionWebhook, syndicateWebhookSchema } from "./tokens/syndicate"
import type { FarcasterCastWebhook } from "./farcaster/types"
import { isValidNeynarWebhook } from "./farcaster/webhooks"
import type { Dream } from "./lib/types"
import { nanoid } from "nanoid"
import { uploadToBucket } from "./storage/google"
import { startWorkers, stopWorkers } from "./jobs"
import { queueFarcasterPostJob } from "./jobs/workers"
import { parseDreamPost } from "./actions/dreambot"
import { SYNDICATE_CHAIN_ID } from "./tokens/chain"

const app = new Hono()

app.use(cors())
app.use(logger())

/**
 * Health check
 */

app.get("/", (c) => {
  return c.text("gm")
})

/**
 * Dream API
 */

const dreamBodySchema = z.object({
  id: z.number(),
  prompt: z.string().optional(),
  mode: z.enum(["dream", "dreamgirl", "baldo", "thanksgiving"]).optional(),
  walletAddress: z.string().optional(),
  noDeploy: z.boolean().optional().default(false),
  token: z
    .object({
      name: z.string(),
      symbol: z.string(),
      imageUrl: z.string().url(),
      description: z.string().optional(),
    })
    .optional(),
})

app.post("/dream", bearerAuth({ token: API_TOKEN }), async (c) => {
  const body = await c.req.json()
  const parsed = dreamBodySchema.safeParse(body)

  if (!parsed.success) {
    log.warn({ body, errors: parsed.error.errors }, "Invalid dream request")
    return c.json({ errors: parsed.error.errors }, 400)
  }

  const { id, prompt, mode, walletAddress, noDeploy, token } = parsed.data

  let creation: Dream

  if (prompt) {
    // Standard dream from prompt
    creation = await dream({
      id: id.toString(),
      prompt,
      mode,
      walletAddress: walletAddress ?? DREAMCOINS_ADDRESS,
      noDeploy,
    })
  } else if (token) {
    // Fully specified token dream
    creation = await dreamToken({
      id: id.toString(),
      name: token.name,
      symbol: token.symbol,
      imageUrl: token.imageUrl,
      description: token.description,
      walletAddress: walletAddress ?? DREAMCOINS_ADDRESS,
    })
  } else {
    // Invalid dream request
    log.warn({ body }, "Invalid dream request, must specify either prompt or token")
    return c.json({ error: "Must specify either prompt or token" }, 400)
  }

  return c.json({ dream: creation })
})

/**
 * Agent platform
 */

const parserBodySchema = z.object({
  text: z.string(),
  imageUrl: z.string().optional(),
  agentId: z.string(),
  tweetId: z.string().optional(),
  farcasterId: z.string().optional(),
})

app.post("/parser", bearerAuth({ token: API_TOKEN }), async (c) => {
  const body = await c.req.json()
  const parsed = parserBodySchema.safeParse(body)

  if (!parsed.success) {
    log.warn({ body, errors: parsed.error.errors }, "Invalid dream parser request")
    return c.json({ errors: parsed.error.errors }, 400)
  }

  const { text, imageUrl, agentId, tweetId, farcasterId } = parsed.data
  if (!tweetId && !farcasterId) {
    log.warn({ body }, "Invalid dream parser request")
    return c.json({ error: "Must specify either tweetId or farcasterId" }, 400)
  }

  const { reply, dream } = await parseDreamPost({ text, imageUrl, agentId, tweetId, farcasterId })
  return c.json({ reply, dream })
})

/**
 * Utilities
 */

app.post("/upload", bearerAuth({ token: API_TOKEN }), async (c) => {
  const body = await c.req.parseBody()
  const file = body["file"]

  if (!file || typeof file === "string") {
    return c.json({ error: "File is required" }, 400)
  }

  const filename = `upload-${nanoid(16)}.jpg`
  const data = await file.arrayBuffer()
  const url = await uploadToBucket(Buffer.from(data), filename)

  return c.json({ url, filename })
})

/**
 * Farcaster webhooks
 */

app.post("/webhooks/farcaster/mentions", async (c) => {
  const body: FarcasterCastWebhook = await c.req.json()
  log.info({ body }, "Farcaster cast webhook received")

  // Verify the signature
  const signature = c.req.header("X-Neynar-Signature")
  if (!signature) {
    log.warn("No signature found in Farcaster webhook")
    return c.json({ error: "No signature found in Farcaster webhook" }, 401)
  }

  const payload = await c.req.text()
  const isValid = await isValidNeynarWebhook(payload, signature)

  if (!isValid) {
    log.warn("Farcaster webhook signature validation failed")
    return c.json({ error: "Signature validation failed" }, 401)
  }

  log.info({ body }, "Farcaster webhook signature is valid")

  // Only handle messages for the fid we care about
  const { data } = body
  if (data.author.fid === FARCASTER_ACCOUNT_FID) {
    log.info({ data }, "Webhook cast is from bot, ignoring")
    return c.text("ok")
  }
  if (!data.text || data.text.replace(`@${FARCASTER_ACCOUNT_USERNAME}`, "").trim() === "") {
    log.info({ data }, "Webhook cast has no text, ignoring")
    return c.text("ok")
  }

  if (
    data.mentioned_profiles.some((p) => p.fid === FARCASTER_ACCOUNT_FID) ||
    data.parent_author.fid === FARCASTER_ACCOUNT_FID
  ) {
    // We're mentioned
    log.info({ body }, "Processing Farcaster cast webhook")
    await queueFarcasterPostJob(body.data)

    return c.text("ok")
  }

  log.info({ data }, "Webhook cast is didn't mention or reply to target account fid, ignoring")
  return c.text("ok")
})

/**
 * Syndicate webhooks
 */

app.post("/webhooks/syndicate", async (c) => {
  const body = await c.req.json()
  const parsed = syndicateWebhookSchema.safeParse(body)

  log.info({ body }, "Syndicate webhook received")

  if (!parsed.success) {
    return c.json({ errors: parsed.error.errors }, 400)
  }

  if (parsed.data.eventType !== "TransactionStatusChange") {
    log.info("Ignoring non-transaction status change event")
    return c.text("ok")
  }

  // Currently we ignore transactions from the Syndicate chain (just logging is enough)
  if (parsed.data.data.chainId === SYNDICATE_CHAIN_ID) {
    log.info("Transaction is from Syndicate EXO testnet, no action needed")
    return c.text("ok")
  }

  try {
    await handleTransactionWebhook(parsed.data)
    return c.text("ok")
  } catch (error) {
    log.error({ error, body }, "Error handling Syndicate webhook")
    return c.json({ error: "Internal server error" }, 500)
  }
})

// Listen for Telegram messages
addBotCallbacks()

// Graceful shutdown
async function onShutdown() {
  log.info("Received shutdown signal")
  await stopWorkers()
  process.exit(0)
}

if (process.env.LOCAL !== "true") {
  await startWorkers()

  process.on("SIGINT", () => onShutdown())
  process.on("SIGTERM", () => onShutdown())
}

export default {
  fetch: app.fetch,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
}
