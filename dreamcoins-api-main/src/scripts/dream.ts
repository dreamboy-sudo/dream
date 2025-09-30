import { dream } from "../actions/dream"
import { DREAMCOINS_ADDRESS } from "../constants"
import { nanoid } from "../lib/utils"

async function dreamIt(prompt: string) {
  const response = await dream({ id: nanoid(), prompt, mode: "dream", walletAddress: DREAMCOINS_ADDRESS })
  console.log("dreamed a dream:", response)
}

await dreamIt("A castle that is an igloo")
process.exit(0)
