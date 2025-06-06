"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatAddress } from "@/lib/utils"
import { ExternalLink, Wallet } from "lucide-react"

export function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [balances, setBalances] = useState<{ [key: string]: string }>({})

  const handleConnect = async () => {
    setIsConnecting(true)

    try {
      // Simulamos la conexión
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generamos una dirección aleatoria
      const mockAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

      setAddress(mockAddress)
      setBalances({
        PEPE: "1000.00",
        USDC: "500.00",
      })
      setIsConnected(true)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAddress("")
    setBalances({})
  }

  // Show connect button if not connected
  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </CardTitle>
          <CardDescription>Connect your wallet to start swapping tokens without gas fees</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleConnect} className="w-full" disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connected Wallet
          </span>
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </CardTitle>
        <CardDescription>Your wallet is connected on Base Sepolia</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Wallet Info */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Smart Account</span>
              <a
                href={`https://sepolia.basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm font-mono hover:text-primary"
              >
                {formatAddress(address)}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Account Type</span>
              <span className="text-sm">Smart Account (ERC-4337)</span>
            </div>
          </div>

          {/* Token Balances */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Token Balances</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(balances).map(([token, amount]) => (
                <div key={token} className="flex justify-between items-center p-2 border rounded-md">
                  <span className="font-medium">{token}</span>
                  <span>{amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
