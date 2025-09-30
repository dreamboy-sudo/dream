import { z } from "zod"

export type DreamMode = "dream" | "dreamgirl" | "baldo" | "thanksgiving"

export const dreamSchema = z.object({
  id: z.string(),
  name: z.string(),
  symbol: z.string(), // Ticker symbol
  prompt: z.string().optional(), // Prompt sent by the dreamer
  imageUrl: z.string(), // URL of the image
  description: z.string(),
  imageIpfsHash: z.string(), // IPFS hash of the image
  metadataIpfsHash: z.string(), // IPFS hash of the metadata
  creatorWalletAddress: z.string(), // Wallet address of the creator
  creatorTweetId: z
    .string()
    .optional()
    .transform((id) => (id === "" ? undefined : id)), // Twitter ID of the tweet that triggered the dream
  creatorTelegramId: z
    .string()
    .optional()
    .transform((id) => (id === "" ? undefined : id)), // Telegram ID of the chat from which the dream originated
  creatorFarcasterId: z
    .string()
    .optional()
    .transform((id) => (id === "" ? undefined : id)), // Farcaster hash of the cast that triggered the dream
  farcasterConversationId: z
    .string()
    .optional()
    .transform((id) => (id === "" ? undefined : id)), // Farcaster conversation ID of the cast that triggered the dream
  status: z.enum(["pending", "undeployed", "success", "failed"]),
  transactionId: z.string(),
  transactionHash: z
    .string()
    .optional()
    .transform((hash) => (hash === "" ? undefined : hash)),
  tokenAddress: z
    .string()
    .optional()
    .transform((address) => (address === "" ? undefined : address)),
  agentId: z.string().optional(), // The ID of the agent that deployed the token
})

export type Dream = z.infer<typeof dreamSchema>
