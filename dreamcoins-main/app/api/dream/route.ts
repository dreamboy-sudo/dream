import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { DreamStatus, Environment, Dream, User } from "@prisma/client";
import { DreamMode } from "@/lib/types";
import { getAddress } from "viem";
import {AuthTokenClaims, PrivyClient} from "@privy-io/server-auth";

export const maxDuration = 120; // 2 minutes

export const fetchCache = 'force-no-store';

const privy = new PrivyClient(process.env.NEXT_PUBLIC_PRIVY_APP_ID!, process.env.PRIVY_APP_SECRET!);

const createTokenSchema = z.object({
  name: z.string().describe("The name of the token to create"),
  symbol: z.string().describe("The symbol of the token to create"),
  imageUrl: z.string().describe("The image url of the token to create"),
  description: z.string().describe("The description of the token to create").optional(),
});

const DREAM_MODES = ["dream", "baldo", "thanksgiving", "dreamgirl"] as const;

// Validation schema for creating a dream
const createDreamSchema = z.object({
  mode: z.enum(DREAM_MODES).optional(),
  token: createTokenSchema,
  creatorAddress: z.string().optional(),
  privyAccessToken: z.string().optional(),
});

const appEnv =
  process.env.APP_ENV === "production" ? Environment.PRODUCTION : Environment.LOCAL;

  const SUBMIT_DREAM_URL = process.env.API_BASE_URL ? `${process.env.API_BASE_URL}/dream` : "http://localhost:3001/dream";


// Interface for paginated responses
interface PaginatedResponse<T> {
  data: T[];
  nextCursor: number | null;
  hasMore: boolean;
}

const DEFAULT_LIMIT = 50;

const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get all dreams with cursor-based pagination
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const cursorInt = cursor ? parseInt(cursor) : undefined;
    const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
    const address = searchParams.get("address");

    const addressFilter = address ? {
      user: {
        walletAddress: getAddress(address),
      }
    } : {};

    const dreams = await prisma.dream.findMany({
      where: {
        ...addressFilter,
        environment: appEnv,
        status: {
          in: [DreamStatus.COMPLETED],
        },
        address: {
          not: null
        },
      },
      orderBy: {
        id: "desc",
      },
      cursor: cursorInt ? { id: cursorInt } : undefined,
      skip: cursorInt ? 1 : 0,
      take: limit + 1,
      distinct: ['address']
    });

    const hasMore = dreams.length > limit;
    const data = hasMore ? dreams.slice(0, -1) : dreams;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    const response: PaginatedResponse<Dream> = {
      data: data.map((dream) => ({
        ...dream,
      })),
      nextCursor,
      hasMore,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching dreams:", error);
    return NextResponse.json({ error: "Failed to fetch dreams" }, { status: 500 });
  }
}

// Create a dream
export async function POST(req: Request) {
  const apiToken = process.env.API_TOKEN;

  if (!apiToken) {
    return NextResponse.json({ error: "Unauthorized - no api token passed" }, { status: 401 });
  }

  try {
    const bodyRaw = await req.json();
    const body = createDreamSchema.parse(bodyRaw);
    const { token, mode, creatorAddress, privyAccessToken } = body;

    console.log("Creating dream", body);

    if (!token?.name) {
      return NextResponse.json({ error: "No token name provided" }, { status: 400 });
    }

    let user: User | null = null;

    if (creatorAddress) {
       if (!privyAccessToken){
        console.error("No privy access token provided", privyAccessToken)
        return new Response("No privy access token provided", {
            status: 400
        })
    }

     let verifiedClaims: AuthTokenClaims | null = null;

    try {
        verifiedClaims = await privy.verifyAuthToken(privyAccessToken);
    } catch (error) {
        console.log(`Token verification failed with error ${error}.`);
        return new Response(`Api error - missing privy access token`, {
            status: 400,
        })
    }


    const privyUser = await privy.getUser(verifiedClaims.userId);

      const did = privyUser?.id;

      if (!privyUser.wallet?.address){
        return NextResponse.json({ error: "No wallet address found" }, { status: 400 });
      }

      const doesAddressMatch = getAddress(privyUser.wallet?.address) === getAddress(creatorAddress);

      if (!doesAddressMatch){
        return NextResponse.json({ error: "Wallet address does not match" }, { status: 400 });
      }

      user = await prisma.user.upsert({
        where: { did },
        update: {},
        create: {
          did,
          walletAddress: getAddress(creatorAddress)
        }
      });
    }

    if (creatorAddress && !user){
      return NextResponse.json({ error: "No user found" }, { status: 400 });
    }

    let dream = await prisma.$transaction(async (tx) => {
    
      return await tx.dream.create({
        data: {
          prompt: token?.name,
          status: DreamStatus.PENDING,
          environment: appEnv,
          ...(user?.id ? {
            user: {
              connect: {
                id: user.id,
              },
            },
          } : {}),
        },
      });
    });

    console.log("Dream created", dream);

     try {
      const response = await sendDreamToQueue({
        dreamId: dream.id,
        token,
        mode,
        apiToken,
        creatorAddress,
      });

      const result = await response.json()

      console.log("Dream sent to queue", result);

      if (result.dream){
        if (result.dream.name && result.dream.symbol && result.dream.imageUrl){
          dream = await prisma.dream.update({
            where: { id: dream.id },
            data: {
              name: result.dream.name,
              ticker: result.dream.symbol,
              imageUrl: result.dream.imageUrl,
            },
          });
        }
      }
    } catch (error: unknown) {
      console.error("Error sending dream to queue:", error);
    }


    const result = {
      ...dream,
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating dream:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

async function sendDreamToQueue({
  dreamId,
  mode,
  apiToken,
  token,
  creatorAddress,
}: {
  dreamId: Dream["id"],
  token: z.infer<typeof createTokenSchema>,
  mode?: DreamMode,
  apiToken: string,
  creatorAddress?: string,
}) {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const zodSchema = z.object({
        id: z.number(),
        token: createTokenSchema,
        mode: z.enum(DREAM_MODES).optional(),
        walletAddress: z.string().optional(),
      });

      const body = zodSchema.parse({
        id: dreamId,
        token,
        mode,
        description: token.description ? token.description : undefined,
        noDeploy: false,
        walletAddress: creatorAddress ? getAddress(creatorAddress) : undefined,
      });

      const response = await fetch(SUBMIT_DREAM_URL, {
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
