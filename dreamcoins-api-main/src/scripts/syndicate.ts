const SYNDICATE_API_TOKEN = process.env.SYNDICATE_API_TOKEN as string
const SYNDICATE_PROJECT_ID = process.env.SYNDICATE_PROJECT_ID as string

const FAILED_IDS = [
  "5c9b33a9-80b8-4d49-9c2c-ce82498fcf5a",
  "3084bfdd-c44b-4c74-905a-75ad230bb795",
  "ff0a8c26-41b6-451b-9fa3-ccc1b05dab1a",
  "3d7b190f-0bc7-4c5f-8655-554607f53d27",
]

async function getStatus(transactionId: string) {
  const response = await fetch(
    `https://api.syndicate.io/wallet/project/${SYNDICATE_PROJECT_ID}/request/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${SYNDICATE_API_TOKEN}`,
      },
    }
  )

  return response.json()
}

const result = await getStatus(FAILED_IDS[0])
console.log(JSON.stringify(result, null, 2))
