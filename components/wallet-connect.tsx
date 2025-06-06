"use client"

import { useState, useEffect } from "react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatAddress } from "@/lib/utils"
import { ExternalLink, Wallet } from "lucide-react"

export function WalletConnect() {
  const { ready, authenticated, user, login, logout } = usePrivy()
  const { wallets } = useWallets()
  const [balances, setBalances] = useState<{ [key: string]: string }>({})
  const [isLoadingBalances, setIsLoadingBalances] = useState(false)

  const wallet = wallets[0] // Get the first connected wallet

  useEffect(() => {
    const fetchBalances = async () => {
      if (!authenticated || !wallet) return

      setIsLoadingBalances(true)
      try {
        // Mock balances - in a real app, you would fetch actual token balances
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

    if (authenticated && wallet) {
      fetchBalances()
    }
  }, [authenticated, wallet])

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  // Show connect button if not authenticated
  if (!authenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </CardTitle>
          <CardDescription>Connect your wallet to start swapping tokens without gas fees using Privy</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={login} className="w-full">
            Connect with Privy
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
          <Button variant="outline" size="sm" onClick={logout}>
            Disconnect
          </Button>
        </CardTitle>
        <CardDescription>Your wallet connected via Privy on Base Sepolia</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* User Info */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">User ID</span>
              <span className="text-sm font-mono">{formatAddress(user?.id || "")}</span>
            </div>

            {wallet && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Wallet Address</span>
                <a
                  href={`https://sepolia.basescan.org/address/${wallet.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm font-mono hover:text-primary"
                >
                  {formatAddress(wallet.address)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Wallet Type</span>
              <span className="text-sm capitalize">{wallet?.walletClientType || "Unknown"}</span>
            </div>
          </div>

          {/* Token Balances */}
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Token Balances</div>
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
