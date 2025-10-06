import { getQueuedTweet, getQueuedTweetCount } from "../cache"
import { getUser, postTweet } from "../twitter/api"

const user = await getUser("dreamboydotfun")
console.log(user)

// const mentions = await getMentions("1861581033977610270")
// console.log(JSON.stringify(mentions.tweets, null, 2))

// const { tweet } = mentions.tweets[0]
// console.log(tweet.entities)

// const result = await postTweet({ text: "don't forget to touch tokens today" })
// console.log(result)

async function processTweetQueue() {
  let remaining = await getQueuedTweetCount()
  console.log(`Processing ${remaining} tweets`)

  while (remaining > 0) {
    const tweet = await getQueuedTweet()
    if (!tweet) {
      console.error("No tweet found")
      break
    }

    const result = await postTweet(tweet)
    console.log("tweeted", result?.data)
    remaining = await getQueuedTweetCount()
    console.log(`${remaining} remaining`)

    await Bun.sleep(15_000)
  }
}

await processTweetQueue()
process.exit(0)
