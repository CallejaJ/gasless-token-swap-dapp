"use client"

// Create a simple context type for the hook
interface BiconomyContextType {
  connect: () => Promise<void>
  disconnect: () => void
  address: string | null
  smartAccount: any | null
  isConnecting: boolean
  isConnected: boolean
  chainId: number
  executeTransaction: (params: any) => Promise<string>
}

// Import the context from the provider
import { useBiconomy as useBiconomyFromProvider } from "@/components/biconomy-provider"

export const useBiconomy = useBiconomyFromProvider
