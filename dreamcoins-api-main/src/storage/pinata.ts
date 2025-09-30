import sdk from "@pinata/sdk"
import { log } from "../logger"

if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
  throw new Error("PINATA_API_KEY or PINATA_SECRET_API_KEY missing from env")
}

const pinata = new sdk({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
})

export async function testConnection() {
  const res = await pinata.testAuthentication()

  log.info({ authenticated: res.authenticated }, "Pinata test response")
  return res.authenticated
}

export async function uploadMetadataToPinata(dreamId: string, name: string, metadata: Record<string, unknown>) {
  const res = await pinata.pinJSONToIPFS(metadata, {
    pinataMetadata: {
      name,
      dreamId,
    },
  })

  log.info({ ...res }, "Uploaded metadata to Pinata")
  return res.IpfsHash
}

export async function uploadImageToPinata(file: ReadableStream, filename: string) {
  const res = await pinata.pinFileToIPFS(file, {
    pinataMetadata: {
      name: filename,
    },
  })

  log.info({ ...res }, "Uploaded image to Pinata")
  return res.IpfsHash
}
