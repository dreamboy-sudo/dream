import { z } from "zod"
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE, getLLM } from "./config"
import { generateObject, generateText, type CoreMessage } from "ai"
import { log } from "../logger"
import { getDreambotAgent, getDreamboyAgent } from "./agents"
import type { Dream } from "../lib/types"

const dreamSchema = z.object({
  name: z.string().min(1).describe("The name of the dream"),
  symbol: z
    .string()
    .min(1)
    .describe(
      "The token symbol of the dream, it should look like a stock ticker symbol and have no special characters"
    ),
  description: z.string().max(1000).describe("The brief description of the dream"),
})

export async function generateDream(prompt: string) {
  const llm = await getLLM("gpt-4o")
  const system = DEFAULT_SYSTEM_PROMPT
  const temperature = DEFAULT_TEMPERATURE

  const { object } = await generateObject({
    model: llm,
    temperature,
    system,
    prompt,
    schema: dreamSchema,
  })

  log.info({ ...object }, "Generated a dream")
  return object
}

export async function parseDreambotToken({
  message,
  history,
  context,
  hasImage,
}: {
  message: string
  history?: CoreMessage[]
  context: "post" | "dm"
  hasImage?: boolean
}) {
  const { model, system, temperature, schema } = await getDreambotAgent({ context, needsImage: !hasImage })

  const prompt = `\
    Here is a message from a user on a social media platform. Analyze the message and determine if the user is asking for a token to be deployed, parsing and generating the metadata if so.
    Message: ${message}
  `

  // Either handle a one-off message or a conversation
  const messages = history
    ? ([
        ...history,
        {
          role: "user",
          content: `Here is a conversation with a user on a social media platform. Analyze the most recent message as well as the conversation history in order to determine if the user is asking for a token to be deployed, parsing the metadata if so. Here is the user's latest message:\n\n${message}`,
        },
      ] satisfies CoreMessage[])
    : undefined

  const { object } = await generateObject({
    model,
    temperature,
    system,
    messages,
    prompt: messages ? undefined : prompt,
    schema,
  })

  log.info({ ...object }, "Parsed dreambot message")
  return object
}

export async function generateDreamboyResponse(message: string) {
  const { model, system, temperature } = await getDreamboyAgent()
  const { text } = await generateText({
    model,
    system,
    temperature,
    prompt: message,
  })

  log.info({ text, prompt: message }, "Generated a Dreamboy response")
  return text
}

type DreamboyPost =
  | {
      type: "missing-image"
      text: string
      context: "post" | "dm"
    }
  | {
      type: "missing-metadata"
      text: string
      context: "post" | "dm"
    }
  | {
      type: "not-token-request"
      text: string
      context: "post" | "dm"
    }
  | {
      type: "token-deployed"
      dream: Dream
      context: "post" | "dm"
    }

export async function generateDreamboyPost(type: DreamboyPost) {
  let prompt = ""

  switch (type.type) {
    case "missing-image":
      prompt =
        type.context === "post"
          ? `The user is asking for a dream token, but the request has no image. Generate a response encouraging the user to add an image to their request. Limit the response to 140 characters. Here is the original text of their request: ${type.text}`
          : `The user is asking for a dream token, has yet to specify an image. Generate a response letting the user know that they will need to specify an image in order to deploy their token. This is in the context of a direct message conversation, so your response should be a sentence or two at most. Here is the original text of their request: ${type.text}`
      break
    case "missing-metadata":
      prompt =
        type.context === "post"
          ? `The user is asking for a dream token, but the request does not have the required fields of name and symbol. Generate a response encouraging the user to add the name and symbol to their request. Limit the response to 140 characters. Here is the original text of their request: ${type.text}`
          : `The user is asking for a dream token, but has yet to specify the required fields of name and symbol. Generate a response letting the user know that they will need to specify both in order to deploy their token. This is in the context of a direct message conversation, so your response should be a sentence or two at most. Here is the original text of their request: ${type.text}`
      break
    case "not-token-request":
      prompt =
        type.context === "post"
          ? `Generate a response to the following message that is 140 characters or less. The user is NOT asking for a token, so do not mention one or say that their dream has manifested.\n\nHere is the user's message:\n${type.text}`
          : `Generate a brief response to the following message. The user is NOT asking for a token, so do not mention one or say that their dream has manifested. If the user is asking about your purpose, let them know that you deploy dreamcoin tokens anonymously - without any connection between the user and the token deployer address. This is in the context of a direct message conversation, so your response should be a sentence or two at most. Here is the user's message:\n${type.text}`
      break
    case "token-deployed":
      prompt =
        type.context === "post"
          ? `The user's token was deployed. Generate a response that is 140 characters or less congratulating the user on the deployment of the token: $${type.dream.symbol}. The token's name is ${type.dream.name} and a description of the dream is ${type.dream.description}.`
          : `The user's token was deployed. Generate a brief response (one sentence) congratulating the user on the deployment of the token: $${type.dream.symbol}. The token's name is ${type.dream.name} and a description of the dream is ${type.dream.description}. Also let the user know that the token was deployed anonymously - there is no connection between the user and the token deployer.`
      break
  }

  log.info({ prompt, type }, "Generating a Dreamboy post")

  const text = await generateDreamboyResponse(prompt)
  return text
}
