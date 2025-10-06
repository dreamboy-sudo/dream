import type { Address } from "viem"
import { baseSepolia } from "viem/op-stack"
import { base } from "viem/chains"
import type { DreamMode } from "./lib/types"

export const API_TOKEN = process.env.API_TOKEN as string

if (!API_TOKEN) {
  throw new Error("API_TOKEN is required in environment")
}

export const IS_LOCAL = process.env.LOCAL === "true"

export const USE_TESTNET = process.env.USE_MAINNET !== "true"

export const TELEGRAM_BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME as string

if (!TELEGRAM_BOT_USERNAME) {
  throw new Error("TELEGRAM_BOT_USERNAME is required in environment")
}

export const FARCASTER_ACCOUNT_FID = parseInt(process.env.FARCASTER_ACCOUNT_FID as string)

if (!FARCASTER_ACCOUNT_FID) {
  throw new Error("FARCASTER_ACCOUNT_FID is required in environment")
}

export const FARCASTER_ACCOUNT_USERNAME = process.env.FARCASTER_ACCOUNT_USERNAME as string

if (!FARCASTER_ACCOUNT_USERNAME) {
  throw new Error("FARCASTER_ACCOUNT_USERNAME is required in environment")
}

export const TWITTER_ACCOUNT_ID = process.env.TWITTER_ACCOUNT_ID as string

if (!TWITTER_ACCOUNT_ID) {
  throw new Error("TWITTER_ACCOUNT_ID is required in environment")
}

export const TWITTER_ACCOUNT_USERNAME = process.env.TWITTER_ACCOUNT_USERNAME as string

if (!TWITTER_ACCOUNT_USERNAME) {
  throw new Error("TWITTER_ACCOUNT_USERNAME is required in environment")
}

export const DEFAULT_DREAM_MODE: DreamMode = "dream"

export const WOW_CONTRACT_ADDRESS: Address = USE_TESTNET
  ? (process.env.WOW_CONTRACT_ADDRESS_TESTNET as Address || "0x61Cb091f8EC70029E393D31BA8F6D533c1308408")
  : (process.env.WOW_CONTRACT_ADDRESS_MAINNET as Address || "0x997020E5F59cCB79C74D527Be492Cc610CB9fA2B")
export const DREAMCOINS_ADDRESS: Address = USE_TESTNET
  ? (process.env.DREAMCOINS_ADDRESS_TESTNET as Address || "0xb1b84998c3220B796debDa94460B364223c6Bcd6")
  : (process.env.DREAMCOINS_ADDRESS_MAINNET as Address || "0x282E626f1635669c075183867347B5d91C9E7ed1")

export const SUBMIT_DREAMS_ONCHAIN = process.env.DREAM_ONCHAIN === "true"

export const CHAIN_ID = USE_TESTNET ? baseSepolia.id : base.id
export const EXPLORER_URL = process.env.EXPLORER_URL || (USE_TESTNET ? "https://sepolia.basescan.org" : "https://basescan.org")
export const WOW_URL = process.env.WOW_URL || (USE_TESTNET ? "https://wowdotxyz.xyz" : "https://wow.xyz")

export const WEB_API_URL = process.env.WEB_API_URL || "http://localhost:3000/api"
export const WEB_API_TOKEN = process.env.WEB_API_TOKEN as string

if (!WEB_API_TOKEN) {
  throw new Error("WEB_API_TOKEN is required in environment")
}

export const AGENT_PLATFORM_URL = process.env.AGENT_PLATFORM_URL || "http://localhost:3002"
export const AGENT_PLATFORM_TOKEN = process.env.AGENT_PLATFORM_TOKEN as string

if (!AGENT_PLATFORM_TOKEN) {
  throw new Error("AGENT_PLATFORM_TOKEN is required in environment")
}

export const TWEET_DREAMS = process.env.TWEET_DREAMS === "true"

export function getWOWUrl(address: string) {
  return `${WOW_URL}/${USE_TESTNET ? "bsep:" : ""}${address}?referrer=${DREAMCOINS_ADDRESS}`
}

export function getDreamcoinsUrl(address: string) {
  const baseUrl = process.env.DREAMCOINS_BASE_URL || "http://localhost:3000"
  return `${baseUrl}/token/${address}`
}
