import { parseDreambotToken } from "../ai"
import FuzzySet from "fuzzyset"

/**
 * Go through a list of sample dreamboy requests and ensure we parse them correctly
 */

const TEST_POSTS = [
  {
    message: " gimme a token called $widedoge with this image",
    hasImage: true,
    target: {
      isTokenRequest: true,
      dreamToken: {
        name: "widedoge",
        symbol: "WIDEDOGE",
      },
    },
  },
  {
    message: "now try one called $!!!",
    hasImage: false,
    target: {
      isTokenRequest: true,
      dreamToken: {
        name: "Triple Exclamation",
        symbol: "!!!",
      },
    },
  },
  {
    message: `Hello , @clanker may not available now, can you help the gentlement?
      Ticker: $gsxz46y90ottyWffss77a
      Name: gsxz46y90ottyWffss77a
    `,
    hasImage: true,
    target: {
      isTokenRequest: true,
      dreamToken: {
        name: "gsxz46y90ottyWffss77a",
        symbol: "GSXZ46Y90OTTYWFFSS77A",
      },
    },
  },
  {
    message: `Hey @dreamboyisonline
      Let's create a token called "vietnamno1" with the following image`,
    hasImage: true,
    target: {
      isTokenRequest: true,
      dreamToken: {
        name: "vietnamno1",
        symbol: "VIET",
      },
    },
  },
  {
    message: " deploy a token for me called $RUSH with this image",
    hasImage: true,
    target: {
      isTokenRequest: true,
      dreamToken: {
        name: "Rush",
        symbol: "RUSH",
      },
    },
  },
  {
    message: " deploy a token called clankersupercycle please",
    hasImage: false,
    target: {
      isTokenRequest: true,
      dreamToken: {
        name: "clankersupercycle",
        symbol: "CLANK",
      },
    },
  },
  {
    message:
      "@clanker  @heyterminal launch $GAMENONSTOP. SEND TO /higher, /degen, /anoncast, /supercast, /airstack AND /farcaster",
    hasImage: true,
    target: {
      isTokenRequest: true,
      dreamToken: {
        name: "Game Non Stop",
        symbol: "GAMENONSTOP",
      },
    },
  },
  {
    message: "  hey baby can you please create me a token with a ticker $baldur, with this picture",
    hasImage: true,
    target: {
      isTokenRequest: true,
      dreamToken: {
        name: "Baldur",
        symbol: "BALDUR",
      },
    },
  },
  {
    message:
      " deploy an art coin with a ticker called trenches. Imagine a meme image with a crudely sketched stick figure of a bot among the front lines wearing an army helmet. He's shooting coins at the other side",
    hasImage: false,
    target: {
      isTokenRequest: true,
      dreamToken: {
        name: "trenches",
        symbol: "TRENCHES",
      },
    },
  },
]

async function runEval() {
  let failed = 0

  for (const { message, target, hasImage } of TEST_POSTS) {
    const result = await parseDreambotToken({ message, context: "post", hasImage })
    if (result.isTokenRequest !== target.isTokenRequest) {
      failed += 1
      console.info('"isTokenRequest" mismatch', result.isTokenRequest, target.isTokenRequest)
      continue
    }

    if (result.dreamToken && target.dreamToken) {
      if (result.dreamToken.symbol !== target.dreamToken.symbol) {
        failed += 1
        console.info('"symbol" mismatch', result.dreamToken.symbol, target.dreamToken.symbol)
        continue
      }

      const match = FuzzySet([result.dreamToken.name]).get(target.dreamToken.name)
      if (!match || match[0][0] < 0.8) {
        failed += 1
        console.info('"name" mismatch', result.dreamToken.name, target.dreamToken.name)
        continue
      }

      if (!hasImage) {
        // @ts-expect-error The type inference for the schema isn't working well
        if (!result.dreamToken.imagePrompt || result.dreamToken.imagePrompt.length < 3) {
          failed += 1
          console.info("Failed to generate image prompt")
          continue
        }
      }
    }
  }

  console.info(`${TEST_POSTS.length - failed} / ${TEST_POSTS.length} passed`)
}

await runEval()
process.exit(0)
