import { customAlphabet } from "nanoid"

const alphabet = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")

export function nanoid(length = 18) {
  return alphabet(length)
}
