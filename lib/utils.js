import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const formatAddress = (address) => {
  if (!address) return ""
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
