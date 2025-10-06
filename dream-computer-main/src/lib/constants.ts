const DREAM_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_DREAM_TOKEN_ADDRESS || "0x98d59767cd1335071a4e9b9d3482685c915131e8";

export const DREAM_TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER_URL || "";
export const DREAM_TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_URL || "";
export const DREAM_DEXSCREENER_URL = process.env.NEXT_PUBLIC_DEXSCREENER_URL || `https://dexscreener.com/base/${DREAM_TOKEN_ADDRESS}`;
export const DREAM_UNISWAP_URL = process.env.NEXT_PUBLIC_UNISWAP_URL || `https://app.uniswap.org/swap?chain=base&inputCurrency=NATIVE&outputCurrency=${DREAM_TOKEN_ADDRESS}&value=0.1&field=input`;
export const DREAMCOINS_URL = process.env.NEXT_PUBLIC_DREAMCOINS_URL || "";
export const LAUNCHPAD_WAITLIST_URL = process.env.NEXT_PUBLIC_LAUNCHPAD_WAITLIST_URL || "";
