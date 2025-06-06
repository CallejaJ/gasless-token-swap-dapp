import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const formatAddress = (address: string): string => {
  if (!address) return ""
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
