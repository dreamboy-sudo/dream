import { getDream } from "../cache"

const DREAM_TRANSACTION_ID = "0xFAKE-rSyfFkEb"

const dream = await getDream(DREAM_TRANSACTION_ID)
console.log("dream:", dream)

process.exit(0)
