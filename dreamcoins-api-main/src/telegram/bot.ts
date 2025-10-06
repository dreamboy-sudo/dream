import TelegramBot from "node-telegram-bot-api"

import { log } from "../logger.ts"
import { dream } from "../actions/dream.ts"
import { nanoid } from "nanoid"
import { DEFAULT_DREAM_MODE, DREAMCOINS_ADDRESS, TELEGRAM_BOT_USERNAME } from "../constants.ts"
import { clearTemporaryDreamer, isDreamer, setTemporaryDreamer } from "../cache/index.ts"
import { generateDreamboyResponse } from "../ai/index.ts"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const DREAMBOY_APPROVED_IDS = process.env.DREAMBOY_APPROVED_IDS

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is required in environment")
}

const DREAMBOY_APPROVED = DREAMBOY_APPROVED_IDS 
  ? DREAMBOY_APPROVED_IDS.split(',').map(id => parseInt(id.trim()))
  : []

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true })

async function dreamFromMessage(chatId: number, senderId: number, prompt: string) {
  const isDreaming = await isDreamer(senderId.toString())
  if (isDreaming) {
    await bot.sendMessage(chatId, "you've dreamed too recently, give it some time")
    return
  }

  await setTemporaryDreamer(senderId.toString())
  await bot.sendMessage(chatId, "dreaming...")

  try {
    const id = nanoid(10)
    const creation = await dream({
      id,
      prompt,
      mode: DEFAULT_DREAM_MODE,
      walletAddress: DREAMCOINS_ADDRESS,
      telegramId: chatId.toString(),
    })

    const message = `$${creation.symbol}\n\n${creation.name}: ${creation.description}`
    await bot.sendPhoto(chatId, creation.imageUrl)
    await bot.sendMessage(chatId, message)
    await bot.sendMessage(chatId, `deploying $${creation.symbol}...`)
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log.error({ prompt, error: (error as any).message }, "Error creating dream")

    await clearTemporaryDreamer(senderId.toString())
    await bot.sendMessage(chatId, "your dream could not be realized")
  }
}

export function addBotCallbacks() {
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id
    const senderId = msg.from?.id
    const isGroup = msg.chat.type !== "private"

    log.debug({ chatId, senderId, isGroup, message: msg.text }, "Telegram bot received message")

    if (!senderId || !msg.text) {
      return
    }

    if (DREAMBOY_APPROVED.includes(chatId) && !isGroup) {
      // Test mode: generate a response from Dreamboy
      const response = await generateDreamboyResponse(msg.text)
      await bot.sendMessage(chatId, response)
      return
    }

    if (!isGroup) {
      log.info({ message: msg.text }, "Telegram bot received direct message")

      // Direct message behavior: `/dream <prompt>`
      if (msg.text.startsWith("/dream ")) {
        if (msg.text.length > 7) {
          await dreamFromMessage(chatId, senderId, msg.text.slice(7))
        } else {
          await bot.sendMessage(chatId, "you must include a prompt to dream")
        }
      } else {
        await bot.sendMessage(chatId, "use `/dream <prompt>` to dream")
      }
    } else {
      // Group message behavior: `@dreambot <prompt>`
      if (msg.text.startsWith(`@${TELEGRAM_BOT_USERNAME} `)) {
        log.info({ message: msg.text }, "Telegram bot tagged in group message")

        if (msg.text.length > TELEGRAM_BOT_USERNAME.length + 2) {
          await dreamFromMessage(chatId, senderId, msg.text.slice(TELEGRAM_BOT_USERNAME.length + 2))
        } else {
          await bot.sendMessage(chatId, "you must include a prompt to dream")
        }
      }
    }
  })
}

export async function sendTelegramMessage(chatId: number, message: string) {
  return await bot.sendMessage(chatId, message)
}
