"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

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

const BiconomyContext = createContext<BiconomyContextType>({
  connect: async () => {},
  disconnect: () => {},
  address: null,
  smartAccount: null,
  isConnecting: false,
  isConnected: false,
  chainId: 84532, // Base Sepolia
  executeTransaction: async () => "",
})

export function BiconomyProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [smartAccount, setSmartAccount] = useState<any | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const chainId = 84532 // Base Sepolia

  const connect = async () => {
    try {
      setIsConnecting(true)

      // Mock implementation for demo purposes
      // In a real app, you would integrate with actual Biconomy SDK
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a mock smart account address
      const mockAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

      setAddress(mockAddress)
      setSmartAccount({ address: mockAddress })
      setIsConnected(true)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setSmartAccount(null)
    setIsConnected(false)
  }

  const executeTransaction = async (params: any): Promise<string> => {
    if (!smartAccount) throw new Error("Smart account not initialized")

    // Mock implementation - simulate transaction execution
    console.log("Executing transaction:", params)

    // Simulate a delay for the mock transaction
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Return a mock transaction hash
    return `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
  }

  return (
    <BiconomyContext.Provider
      value={{
        connect,
        disconnect,
        address,
        smartAccount,
        isConnecting,
        isConnected,
        chainId,
        executeTransaction,
      }}
    >
      {children}
    </BiconomyContext.Provider>
  )
}

export const useBiconomy = () => useContext(BiconomyContext)
