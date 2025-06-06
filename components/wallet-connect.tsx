"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useBiconomy } from "@/hooks/use-biconomy"
import { formatAddress } from "@/lib/utils"
import { Loader2, ExternalLink } from "lucide-react"

export function WalletConnect() {
  const { connect, disconnect, address, smartAccount, isConnecting, isConnected, chainId } = useBiconomy()
  const [balances, setBalances] = useState<{ [key: string]: string }>({})
  const [isLoadingBalances, setIsLoadingBalances] = useState(false)

  useEffect(() => {
    const fetchBalances = async () => {
      if (!smartAccount) return

      setIsLoadingBalances(true)
      try {
        // In a real app, you would fetch actual token balances here
        // This is a mock implementation
        setBalances({
          PEPE: "1000.00",
          USDC: "500.00",
        })
      } catch (error) {
        console.error("Error fetching balances:", error)
      } finally {
        setIsLoadingBalances(false)
      }
    }

    if (isConnected && smartAccount) {
      fetchBalances()
    }
  }, [isConnected, smartAccount])

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Connect Wallet</CardTitle>
          <CardDescription>Connect your wallet to start swapping tokens without gas fees</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={connect} disabled={isConnecting} className="w-full">
            {isConnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Smart Account</span>
          <Button variant="outline" size="sm" onClick={disconnect}>
            Disconnect
          </Button>
        </CardTitle>
        <CardDescription>Your gasless smart account on Base Sepolia</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Address</span>
            <a
              href={`https://sepolia.basescan.org/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-mono hover:text-primary"
            >
              {formatAddress(address || "")}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Balances</div>
            {isLoadingBalances ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(balances).map(([token, amount]) => (
                  <div key={token} className="flex justify-between items-center p-2 border rounded-md">
                    <span className="font-medium">{token}</span>
                    <span>{amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
