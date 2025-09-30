import { z } from "zod"
import { getLLM } from "./config"
import { getDreambotPrompt, DREAMBOY_PROMPT } from "./prompts"

export async function getDreambotAgent({
  context,
  needsImage = false,
}: {
  context: "post" | "dm"
  needsImage?: boolean
}) {
  const llm = await getLLM("claude-3-5-sonnet-20241022")
  return {
    model: llm,
    system: getDreambotPrompt({ context, needsImage }),
    schema: getDreambotSchema(needsImage),
    temperature: context === "post" ? 0.3 : 0.1,
  }
}

function getDreambotSchema(needsImage: boolean) {
  const dreamTokenSchema = z.object({
    name: z.string().max(50).describe("The name of the token"),
    symbol: z.string().min(1).describe("The token symbol, without the dollar sign"),
    description: z.string().max(1000).describe("A brief description of the dream"),
  })

  return z.object({
    isTokenRequest: z.boolean().describe("Whether the user is asking for a dreamcoin token to be deployed"),
    dreamToken: needsImage
      ? dreamTokenSchema.merge(z.object({ imagePrompt: z.string().describe("The image prompt for the token") }))
      : dreamTokenSchema,
  })
}

export async function getDreamboyAgent() {
  const llm = await getLLM("claude-3-5-sonnet-20241022")
  return { model: llm, system: DREAMBOY_PROMPT, temperature: 0.7 }
}
