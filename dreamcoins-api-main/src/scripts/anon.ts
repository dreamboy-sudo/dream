import { addSeenMessage, hasSeenMessage } from "../cache"
import { FARCASTER_ACCOUNT_FID } from "../constants"
import { getConversationMessages, getInbox } from "../farcaster/actions"
import { log } from "../logger"

// Test the direct message token launcher

async function processInbox() {
  log.info("Running inbox check")
  const conversations = await getInbox()

  for (const conversation of conversations) {
    // Check for a message not sent from us that hasn't been seen yet
    const message = conversation.lastMessage
    if (!message || message.senderFid === FARCASTER_ACCOUNT_FID) {
      log.info(
        { conversationId: conversation.conversationId, message },
        "Latest message in conversation is not found or from us"
      )
      continue
    }

    const seenMessage = await hasSeenMessage(message.messageId)
    if (seenMessage) {
      log.info(
        { conversationId: conversation.conversationId, message },
        "Latest message in conversation has already been seen"
      )
      continue
    }

    // Unprocessed message
    await addSeenMessage(message.messageId)

    // Fetch recent messages in conversation
    const history = await getConversationMessages(conversation.conversationId)
    log.info({ conversationId: conversation.conversationId, messages: history }, "Fetched conversation messages")

    // TODO: Re-enable
    // await handleDirectCast({ conversationId: conversation.conversationId, message, history })
  }

  log.info("All conversations in inbox checked")
}

await processInbox()
process.exit(0)
