import { createPublicClient, http, parseEventLogs } from "viem"
import { USE_TESTNET } from "../constants"
import { baseSepolia, base } from "viem/chains"
import { WOW_TOKEN_ABI } from "./abi"

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY

if (!ALCHEMY_API_KEY) {
  throw new Error("ALCHEMY_API_KEY is required in environment")
}

export const client = createPublicClient({
  chain: USE_TESTNET ? baseSepolia : base,
  transport: USE_TESTNET
    ? http(`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`)
    : http(`https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`),
})

export async function parseTokenAddress(tx: `0x${string}`) {
  const receipt = await client.getTransactionReceipt({ hash: tx })
  const logs = parseEventLogs({
    abi: WOW_TOKEN_ABI,
    logs: receipt.logs,
  })

  const createLog = logs.find((log: Record<string, unknown>) => log.eventName === "WowTokenCreated") as
    | {
        args: {
          factoryAddress: `0x${string}`
          tokenCreator: `0x${string}`
          platformReferrer: `0x${string}`
          protocolFeeRecipient: `0x${string}`
          bondingCurve: `0x${string}`
          tokenURI: string
          name: string
          symbol: string
          tokenAddress: `0x${string}`
          poolAddress: `0x${string}`
        }
      }
    | undefined

  if (createLog) {
    return createLog.args.tokenAddress
  }

  return undefined
}
