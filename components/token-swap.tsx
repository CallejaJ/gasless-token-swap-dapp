"use client"

import { useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownUp, Loader2, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const TOKENS = [
  { symbol: "PEPE", name: "Pepe Token", decimals: 18 },
  { symbol: "USDC", name: "USD Coin", decimals: 6 },
]

export function TokenSwap() {
  const { authenticated } = usePrivy()
  const { toast } = useToast()

  const [fromToken, setFromToken] = useState(TOKENS[0].symbol)
  const [toToken, setToToken] = useState(TOKENS[1].symbol)
  const [amount, setAmount] = useState("")
  const [isSwapping, setIsSwapping] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  // Mock exchange rate
  const exchangeRate = fromToken === "PEPE" ? 0.000005 : 200000
  const estimatedOutput = amount ? Number.parseFloat(amount) * exchangeRate : 0

  const handleSwapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
  }

  const handleSwap = async () => {
    if (!authenticated || !amount || Number.parseFloat(amount) <= 0) return

    setIsSwapping(true)
    setTxHash(null)

    try {
      // Mock transaction execution
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate mock transaction hash
      const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
      setTxHash(mockTxHash)

      toast({
        title: "Swap successful!",
        description: `Swapped ${amount} ${fromToken} for ${estimatedOutput.toFixed(6)} ${toToken}`,
      })
    } catch (error) {
      console.error("Swap error:", error)
      toast({
        title: "Swap failed",
        description: "There was an error processing your swap",
        variant: "destructive",
      })
    } finally {
      setIsSwapping(false)
    }
  }

  if (!authenticated) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
        <CardDescription>Swap tokens without paying gas fees using Privy + Smart Accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="from-token">From</Label>
            <div className="flex space-x-2">
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  {TOKENS.filter((t) => t.symbol !== toToken).map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="from-amount"
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" size="icon" onClick={handleSwapTokens} className="rounded-full">
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to-token">To (estimated)</Label>
            <div className="flex space-x-2">
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  {TOKENS.filter((t) => t.symbol !== fromToken).map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input id="to-amount" readOnly value={estimatedOutput.toFixed(6)} className="bg-muted" />
            </div>
          </div>

          {amount && (
            <div className="text-sm text-muted-foreground">
              1 {fromToken} = {exchangeRate} {toToken}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          onClick={handleSwap}
          disabled={isSwapping || !amount || Number.parseFloat(amount) <= 0}
          className="w-full"
        >
          {isSwapping ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Swapping...
            </>
          ) : (
            "Swap"
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">Gas fees sponsored by Privy + Smart Accounts</div>

        {txHash && (
          <a
            href={`https://sepolia.basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 text-sm hover:text-primary"
          >
            View transaction
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </CardFooter>
    </Card>
  )
}
