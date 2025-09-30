import { toHex } from "viem"
import { log } from "../logger"

const API_TOKEN = process.env.SYNDICATE_API_TOKEN as string
const PROJECT_ID = process.env.SYNDICATE_PROJECT_ID as string
const ADMIN_ACCOUNT = process.env.SYNDICATE_ADMIN_ACCOUNT as string

if (!API_TOKEN || !PROJECT_ID || !ADMIN_ACCOUNT) {
  throw new Error("SYNDICATE_API_TOKEN, SYNDICATE_PROJECT_ID, and SYNDICATE_ADMIN_ACCOUNT are required in environment")
}

export const SYNDICATE_CHAIN_ID = 5113

const APPLICATION_CONTRACT_ADDRESS = process.env.APPLICATION_CONTRACT_ADDRESS || "0x628e40B36A80526A6d264B7ff393112e34bFF969"

export async function recordAgentApplication({ address, name }: { address: string; name: string; role?: string }) {
  const response = await fetch("https://api.syndicate.io/transact/sendTransaction", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      projectId: PROJECT_ID,
      contractAddress: APPLICATION_CONTRACT_ADDRESS,
      chainId: SYNDICATE_CHAIN_ID,
      functionSignature: "addApplicant(address agentAddress, bytes additionalData)",
      args: {
        agentAddress: address,
        additionalData: toHex(name),
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to record agent application: ${response.statusText}`)
  }

  const data = await response.json()
  log.info({ ...(data as Record<string, unknown>) }, "Agent application recorded")

  const transactionId = (data as Record<string, unknown>).transactionId as string
  return { transactionId }
}

export async function approveAgentApplication({ address }: { address: string }) {
  const response = await fetch("https://api.syndicate.io/transact/sendTransaction", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      projectId: PROJECT_ID,
      contractAddress: APPLICATION_CONTRACT_ADDRESS,
      chainId: SYNDICATE_CHAIN_ID,
      functionSignature: "approveApplicant(address agentAddress)",
      args: {
        agentAddress: address,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to record agent application: ${response.statusText}`)
  }

  const data = await response.json()
  log.info({ ...(data as Record<string, unknown>) }, "Agent application approved")

  const transactionId = (data as Record<string, unknown>).transactionId as string
  return { transactionId }
}

export async function denyAgentApplication({ address }: { address: string }) {
  const response = await fetch("https://api.syndicate.io/transact/sendTransaction", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      projectId: PROJECT_ID,
      contractAddress: APPLICATION_CONTRACT_ADDRESS,
      chainId: SYNDICATE_CHAIN_ID,
      functionSignature: "denyApplicant(address agentAddress)",
      args: {
        agentAddress: address,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to deny agent application: ${response.statusText}`)
  }

  const data = await response.json()
  log.info({ ...(data as Record<string, unknown>) }, "Agent application denied")

  const transactionId = (data as Record<string, unknown>).transactionId as string
  return { transactionId }
}

// Syndicate needs us to do this idk man
export async function grantRole() {
  const response = await fetch("https://api.syndicate.io/transact/sendTransaction", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      projectId: PROJECT_ID,
      contractAddress: APPLICATION_CONTRACT_ADDRESS,
      chainId: SYNDICATE_CHAIN_ID,
      functionSignature: "grantRole(bytes32 role, address account)",
      args: {
        role: process.env.ADMIN_ROLE || "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775",
        account: ADMIN_ACCOUNT,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to grant role: ${response.statusText}`)
  }

  const data = await response.json()
  log.info({ ...(data as Record<string, unknown>) }, "Role granted")

  const transactionId = (data as Record<string, unknown>).transactionId as string
  return { transactionId }
}
