import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { DreamStatus, Environment } from "@prisma/client";
import { getAddress } from "viem";

export const maxDuration = 120; // 2 minutes


// Validation schema for the webhook payload
const dreamWebhookSchema = z.object({
  dreamId: z.number(),
  imageUrl: z.string().url(),
  status: z.enum([DreamStatus.COMPLETED, DreamStatus.FAILED]),
  error: z.string().optional(),
  address: z.string(),
  name: z.string(),
  prompt: z.string(),
  ticker: z.string(),
  // Add a secret key validation to ensure the webhook is coming from your service
  webhookSecret: z.string(),
});

export async function POST(req: Request) {
  console.log("Received webhook request");
  try {
    const body = await req.json();

    console.log("Parsed body:", body);
    const { dreamId, imageUrl, status, error, webhookSecret, address, name, prompt, ticker } =
      dreamWebhookSchema.parse(body);


    // Validate webhook secret
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
      console.error("Invalid webhook secret");

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Valid webhook secret");

    let targetDreamId = dreamId;

    if (dreamId === 0){
      // Create a new dream
      const newDream =await prisma.dream.create({
        data: {
          status,
          imageUrl,
          address: getAddress(address),
          environment: Environment.PRODUCTION,
          name,
          prompt,
          ticker,
        },
      });
      targetDreamId = newDream.id;
    }

    // Update the dream in the database
    const updatedDream = await prisma.dream.update({
      where: {
        id: targetDreamId,
      },
      data: {
        status,
        imageUrl,
        address: getAddress(address),
        ...(error && { metadata: { error } }),
      },
    });

    console.log("Dream updated via webhook:", updatedDream);

    return NextResponse.json(updatedDream, { status: 200 });
  } catch (error) {
    console.error("Error processing dream webhook:", error);
    
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 400 }
    );
  }
} 