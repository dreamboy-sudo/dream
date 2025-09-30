import { Queue, QueueEvents } from "bullmq"
import { getClient } from "../cache/client"
import { log } from "../logger"

function getConnection() {
  return getClient({ maxRetriesPerRequest: null })
}

export const sharedConnection = getConnection()

export enum QUEUES {
  Inbox = "inbox", // Inbox polling
  Mentions = "mentions", // Polling for mentions
  Messages = "messages", // Handling new direct messages
  Posts = "posts", // Handling new posts
}

export const inboxQueue = new Queue(QUEUES.Inbox, {
  connection: sharedConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
})

inboxQueue.on("error", (error) => {
  log.error({ error: error.message }, "Inbox queue error")
})

const inboxEvents = new QueueEvents(QUEUES.Inbox, { connection: getConnection() })

inboxEvents.on("completed", ({ jobId }) => {
  log.debug({ jobId }, "Inbox job completed")
})

inboxEvents.on("error", (error) => {
  log.error({ error }, "Inbox job error")
})

inboxEvents.on("failed", ({ jobId, failedReason }) => {
  log.error({ jobId, reason: failedReason }, "Inbox job failed")
})

export const mentionsQueue = new Queue(QUEUES.Mentions, {
  connection: sharedConnection,
  defaultJobOptions: {
    attempts: 0, // We don't want to retry since it's periodic
    removeOnComplete: 10,
    removeOnFail: 100,
  },
})

mentionsQueue.on("error", (error) => {
  log.error({ error }, "Mentions queue error")
})

const mentionsEvents = new QueueEvents(QUEUES.Mentions, { connection: getConnection() })

mentionsEvents.on("completed", ({ jobId }) => {
  log.debug({ jobId }, "Mentions job completed")
})

mentionsEvents.on("error", (error) => {
  log.error({ error }, "Mentions job error")
})

mentionsEvents.on("failed", ({ jobId, failedReason }) => {
  log.error({ jobId, reason: failedReason }, "Mentions job failed")
})

export const messagesQueue = new Queue(QUEUES.Messages, {
  connection: sharedConnection,
  defaultJobOptions: {
    attempts: 8,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
})

messagesQueue.on("error", (error) => {
  log.error({ error }, "Messages queue error")
})

const messagesEvents = new QueueEvents(QUEUES.Messages, { connection: getConnection() })

messagesEvents.on("completed", ({ jobId }) => {
  log.debug({ jobId }, "Messages job completed")
})

messagesEvents.on("error", (error) => {
  log.error({ error }, "Messages job error")
})

messagesEvents.on("failed", ({ jobId, failedReason }) => {
  log.error({ jobId, reason: failedReason }, "Messages job failed")
})

export const postsQueue = new Queue(QUEUES.Posts, {
  connection: sharedConnection,
  defaultJobOptions: {
    attempts: 8,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 100,
  },
})

postsQueue.on("error", (error) => {
  log.error({ error }, "Posts queue error")
})

const postsEvents = new QueueEvents(QUEUES.Posts, { connection: getConnection() })

postsEvents.on("completed", ({ jobId }) => {
  log.debug({ jobId }, "Posts job completed")
})

postsEvents.on("error", (error) => {
  log.error({ error }, "Posts job error")
})

postsEvents.on("failed", ({ jobId, failedReason }) => {
  log.error({ jobId, reason: failedReason }, "Posts job failed")
})
