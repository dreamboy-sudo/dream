import { base } from "viem/chains";
import type { SubmitDreamResult } from "./types";

export const IS_LOCAL = typeof window !== 'undefined' && window.location.href.includes("localhost");

const IS_MAINNET = process.env.NEXT_PUBLIC_CHAIN_ID === base.id.toString();

export const WOW_URL = process.env.NEXT_PUBLIC_WOW_URL || (IS_MAINNET ? "https://wow.xyz" : "https://wowdotxyz.xyz");
const DREAM_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DREAM_TOKEN_ADDRESS || "0x98d59767cd1335071a4e9b9d3482685c915131e8";
export const DREAM_TOKEN_URL = process.env.NEXT_PUBLIC_DREAM_TOKEN_URL || `${WOW_URL}/${DREAM_TOKEN_ADDRESS}`
export const DREAM_UNISWAP_URL = process.env.NEXT_PUBLIC_DREAM_UNISWAP_URL || `https://app.uniswap.org/swap?chain=base&inputCurrency=NATIVE&outputCurrency=${DREAM_TOKEN_ADDRESS}&value=0.1&field=input`

export const DREAMCOINS_ADDRESS = process.env.NEXT_PUBLIC_DREAMCOINS_CONTRACT_ADDRESS || "0x282E626f1635669c075183867347B5d91C9E7ed1"

export function getWowUrl(address: string) {
  return `${WOW_URL}/${IS_MAINNET ? "" : "bsep:"}${address}?referrer=${DREAMCOINS_ADDRESS}`;
}

export const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER_URL || "";

export const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_URL || "";

export const TERMS_OF_SERVICE_URL = process.env.NEXT_PUBLIC_TERMS_OF_SERVICE_URL || "";
export const PRIVACY_POLICY_URL = process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL || "";

export const SAMPLE_DREAM: SubmitDreamResult = {
  id: 49,
  name: "Fog of Mars",
  ticker: "FMARS",
  prompt: "Fog of Mars captures a rare and dreamlike phenomenon on the Martian surface, where the usual dry, barren landscape is enveloped in a thick fog. This ethereal scene offers a glimpse into a Mars that feels both familiar and alien, where the dance of the fog transforms the planet into a canvas of mystery and wonder.",
  imageUrl: process.env.NEXT_PUBLIC_SAMPLE_DREAM_IMAGE_URL || "https://storage.googleapis.com/dreamcoins/FMARS-rRJ087pl.png",
  address: process.env.NEXT_PUBLIC_SAMPLE_DREAM_ADDRESS || "0xF0A72469853Db74bEc02301333F29780285b863d",
  environment: "PRODUCTION",
  status: "COMPLETED",
  createdAt: new Date().toISOString(),
  chainId: null,
  metadata: null,
  updatedAt: new Date().toISOString(),
  userId: 1
};
