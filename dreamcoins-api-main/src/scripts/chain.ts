/* eslint @typescript-eslint/no-unused-vars: 0 */

import { Readable } from "stream"
import { uploadImageToPinata, uploadMetadataToPinata } from "../storage/pinata"
import { nanoid } from "../lib/utils"
import { approveAgentApplication, denyAgentApplication, grantRole, recordAgentApplication } from "../tokens/chain"

/**
 * Dreamchain actions
 *
 * 1. Upload metadata for a new employee badge NFT
 * 2. Trigger the minting of a new employee badge with the tokenURI from above
 * 3. Send a transaction to allow a new agent onto the chain
 */

// NFT metadata
const NAME = "Dreamchain Employee Badge"
const SYMBOL = "DREAM"
const DESCRIPTION = "Dreamchain Employee Badge"
const IMAGE_PATH = "./badges/dreamboy.png"

// Mint an employee badge NFT
async function mint() {
  console.info("Minting employee badge")

  const file = Bun.file(IMAGE_PATH)
  const buffer = await file.arrayBuffer()
  const stream = Readable.from(Buffer.from(buffer))

  // Upload the image to IPFS
  const filename = `dreambadge-${nanoid(16)}.png`
  const imageHash = await uploadImageToPinata(stream as unknown as ReadableStream, filename)

  const metadataHash = await uploadMetadataToPinata("dreambadge", NAME, {
    name: NAME,
    symbol: SYMBOL,
    description: DESCRIPTION,
    image: `ipfs://${imageHash}`,
  })

  console.info("Metadata hash", metadataHash)

  // TODO: Call Syndicate once the contract is live
}

/**
 * Agent applications
 */

// Record new application

// console.info("Recording agent application")

// const transactionId = await recordAgentApplication({
//   address: "0xb4974d295e39799e99C2983F702febD6175e4F49",
//   name: "harmonybot",
// })

// console.info("Agent application recorded with transaction ID", transactionId)

// Approve application

// console.info("Approving agent application")

// await approveAgentApplication({
//   address: "0xecc87d05539e211d130fd07741e20d6ae4da7b40",
// })

// console.info("Agent application approved")

// Deny application

// console.info("Denying agent application")

// await denyAgentApplication({
//   address: "0x1234567890123456789012345678901234567890",
// })

// console.info("Agent application denied")

// Syndicate role grant

// console.info("Granting Syndicate role")

// const transactionId = await grantRole()

// console.info("Syndicate role granted:", transactionId)
