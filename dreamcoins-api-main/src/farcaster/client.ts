import { NeynarAPIClient } from "@neynar/nodejs-sdk"

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY as string
if (!NEYNAR_API_KEY) {
  throw new Error("NEYNAR_API_KEY is required in environment")
}

export const SIGNER_UUID = process.env.NEYNAR_SIGNER_UUID as string
if (!SIGNER_UUID) {
  throw new Error("NEYNAR_SIGNER_UUID is required in environment")
}

export const client = new NeynarAPIClient(NEYNAR_API_KEY)
