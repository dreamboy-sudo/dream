import { DreamMode } from "@/lib/types";
import { NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 300; // 5 minutes

export const fetchCache = 'force-no-store';

const DREAM_MODES = ["dream", "baldo", "thanksgiving","dreamgirl"] as const;

// Validation schema for creating a dream
const createPreviewDreamSchema = z.object({
  prompt: z.string().describe("The dream prompt to generate an image from"),
  mode: z.enum(DREAM_MODES).optional(),
});


  const SUBMIT_DREAM_PREVIEW_URL = process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/dream` : "http://localhost:3001/dream";


async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Create a dream
export async function POST(req: Request) {
  const apiToken = process.env.API_TOKEN;

  if (!apiToken) {
    return NextResponse.json({ error: "Unauthorized - no api token passed" }, { status: 401 });
  }

  try {
    const bodyRaw = await req.json();
    const body = createPreviewDreamSchema.parse(bodyRaw);
    const { prompt, mode } = body;

     const response = await sendDreamToQueue({
        dreamId: 0,
        prompt,
        mode: mode || "dream",
        apiToken,
      });

      const result = await response.json()

      let name = null;
      let symbol = null;
      let imageUrl = null;

       if (result.dream){
        name = result.dream.name;
        symbol = result.dream.symbol;
        imageUrl = result.dream.imageUrl;
      }

      console.log("Dream preview from API:",result);

      return NextResponse.json({
        name,
        symbol,
        imageUrl,
      });

  } catch (error: unknown) {
    console.error("Error sending dream preview to queue:", error);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}


const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

async function sendDreamToQueue({
  dreamId,
  prompt,
  mode,
  apiToken
}: {
  dreamId: number,
  prompt: string,
  mode?: DreamMode,
  apiToken: string,
}) {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const zodSchema = z.object({
        id: z.number(),
        prompt: z.string(),
        mode: z.enum(DREAM_MODES).optional(),
        noDeploy: z.boolean().optional(),
      });

      const body = zodSchema.parse({
        id: dreamId,
        prompt,
        mode,
        noDeploy: true, // Always no deploy for preview
      });

      const response = await fetch(SUBMIT_DREAM_PREVIEW_URL, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      console.error(`Attempt ${attempt + 1} failed:`, lastError);
      
      if (attempt < MAX_RETRIES - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = BASE_DELAY * Math.pow(2, attempt);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  // If we get here, all retries failed
  throw lastError || new Error('Failed to send dream to queue after all retries');
}
