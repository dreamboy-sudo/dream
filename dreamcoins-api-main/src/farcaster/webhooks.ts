import { createHmac } from "crypto"

const NEYNAR_WEBHOOK_SECRET = process.env.NEYNAR_WEBHOOK_SECRET as string

if (!NEYNAR_WEBHOOK_SECRET) {
  throw new Error("NEYNAR_WEBHOOK_SECRET is required in environment")
}

export async function isValidNeynarWebhook(body: string, signature: string) {
  const hmac = createHmac("sha512", NEYNAR_WEBHOOK_SECRET)
  hmac.update(body)

  const generated = hmac.digest("hex")
  return generated === signature
}
