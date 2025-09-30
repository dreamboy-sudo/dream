import type { WebhookCastCreated } from "@neynar/nodejs-sdk"

/**
 * Neynar has some incorrect/incomplete types
 */

export type FarcasterCastWebhook = WebhookCastCreated & {
  data: WebhookCastCreated["data"] & {
    mentioned_profiles: WebhookCastCreated["data"]["author"][]
  }
}
