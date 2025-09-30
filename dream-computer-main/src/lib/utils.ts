import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hash(str: string) {
  return str.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0);
}

export function useHasHover() {
  try {
    return matchMedia("(hover: hover)").matches;
  } catch {
    // Assume that if the browser is too old to support matchMedia it's likely not a touch device
    return true;
  }
}
