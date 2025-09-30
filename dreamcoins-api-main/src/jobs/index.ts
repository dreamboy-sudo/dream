import { log } from "../logger"
import { inboxWorker, mentionsWorker, messagesWorker, postsWorker } from "./workers"

export async function startWorkers() {
  log.info("Starting workers")

  inboxWorker.run()
  mentionsWorker.run()
  messagesWorker.run()
  postsWorker.run()

  log.info("Workers started")
}

export async function stopWorkers() {
  log.info("Stopping workers")

  await inboxWorker.close()
  await mentionsWorker.close()
  await messagesWorker.close()
  await postsWorker.close()

  log.info("Workers stopped")
}
