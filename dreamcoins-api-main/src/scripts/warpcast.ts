import { getConversationMessages, getInbox, sendMessage } from "../farcaster/actions"

const CONVERSATION_ID = "636f6e7669643a3734382d383737323835"

const inbox = await getInbox()
console.log("inbox", inbox)

const messages = await getConversationMessages(CONVERSATION_ID)
console.log("messages", messages)

const messageId = await sendMessage(CONVERSATION_ID, "gm wugmi")
console.log("reply id", messageId)
