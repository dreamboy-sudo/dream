import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { createOpenAI, openai } from "@ai-sdk/openai"
import type { LanguageModelV1 } from "ai"
import { log } from "../logger"
import { DREAMER_PROMPT } from "./prompts"

export const DEFAULT_TEMPERATURE = 0.95
export const DEFAULT_SYSTEM_PROMPT = DREAMER_PROMPT

export const AVAILABLE_MODELS = [
  "gpt-4o",
  "gpt-4o-mini",
  "claude-3-5-sonnet-20241022",
  "claude-3-5-haiku-20241022",
] as const

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
})

export async function getLLM(model: (typeof AVAILABLE_MODELS)[number]): Promise<LanguageModelV1> {
  log.debug({ model }, "Using LLM")

  if (model.startsWith("gpt-")) {
    return openai(model)
  }
  if (model.startsWith("claude-")) {
    return anthropic(model)
  }
  if (model.startsWith("models/gemini-")) {
    return google(model)
  }
  if (model.startsWith("llama-")) {
    return groq(model)
  }

  throw new Error(`Unsupported model: ${model}`)
}
