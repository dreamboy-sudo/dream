import { mentionsQueue, postsQueue } from "../jobs/queues"

const counts = await postsQueue.getJobCounts("completed", "failed", "active", "delayed", "paused", "waiting")
console.log(JSON.stringify(counts, null, 2))

// const active = await postsQueue.getJobs(["active"])
// console.log("active:", JSON.stringify(active, null, 2))

// const waiting = await postsQueue.getJobs(["waiting"])
// console.log("waiting:", JSON.stringify(waiting, null, 2))

// const failed = await postsQueue.getJobs(["failed"])
// console.log("failed:", failed.map((job) => job.jobId))

const periodic = await mentionsQueue.getRepeatableJobs()
console.log("periodic:", JSON.stringify(periodic, null, 2))

// const key = periodic[0].key
// const result = await mentionsQueue.removeRepeatableByKey(key)
// console.log("result:", result)

// // Retry failed jobs
// for (const job of failed) {
//   await job.retry()
// }

process.exit(0)
