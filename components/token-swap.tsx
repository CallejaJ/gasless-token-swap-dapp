"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownUp, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSmartAccount } from "@/hooks/use-smart-account";
import { parseUnits } from "viem";

export function TokenSwap() {
  const { toast } = useToast();
  const {
    tokens,
    getTokenBalance,
    executeSwap,
    isSmartWalletReady,
    smartAccountAddress,
    isLoadingBalances,
  } = useSmartAccount();

  const [fromToken, setFromToken] = useState(tokens.PEPE);
  const [toToken, setToToken] = useState(tokens.USDC);
  const [amount, setAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const balance = getTokenBalance(fromToken.address);

  // Exchange rate calculation (simplified for demo)
  const exchangeRate = fromToken.symbol === "PEPE" ? 0.000005 : 200000;
  const estimatedOutput = amount ? Number(amount) * exchangeRate : 0;

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setAmount("");
    setTxHash(null);
  };

  const handleSwap = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      });
      return;
    }

    if (!isSmartWalletReady) {
      toast({
        title: "Wallet not ready",
        description: "Please wait for your smart wallet to initialize",
        variant: "destructive",
      });
      return;
    }

    setIsSwapping(true);
    setTxHash(null);

    try {
      // Parse amount to token units
      const amountInUnits = parseUnits(amount, fromToken.decimals);

      // Execute swap using smart wallet
      const txHash = await executeSwap(fromToken, toToken, amountInUnits);

      setTxHash(txHash);
      toast({
        title: "Swap initiated!",
        description: `Swapping ${amount} ${
          fromToken.symbol
        } for ${estimatedOutput.toFixed(6)} ${toToken.symbol}`,
      });

      // Clear amount after successful swap
      setAmount("");
    } catch (error: any) {
      console.error("Swap error:", error);
      toast({
        title: "Swap failed",
        description: error?.message || "Transaction failed",
        variant: "destructive",
      });
    } finally {
      setIsSwapping(false);
    }
  };

  const handleMaxClick = () => {
    if (balance && Number(balance) > 0) {
      setAmount(balance);
    }
  };

  const isSwapDisabled =
    isSwapping ||
    !amount ||
    Number(amount) <= 0 ||
    !isSmartWalletReady ||
    !smartAccountAddress ||
    isLoadingBalances;

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
        <CardDescription>Swap tokens without paying gas fees</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <Label>From</Label>
              <span className='text-sm text-muted-foreground'>
                Balance: {isLoadingBalances ? "Loading..." : balance}
              </span>
            </div>
            <div className='flex gap-2'>
              <Select
                value={fromToken.symbol}
                onValueChange={(value) => {
                  if (value === "PEPE") setFromToken(tokens.PEPE);
                  if (value === "USDC") setFromToken(tokens.USDC);
                }}
              >
                <SelectTrigger className='w-[120px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='PEPE'>PEPE</SelectItem>
                  <SelectItem value='USDC'>USDC</SelectItem>
                </SelectContent>
              </Select>
              <div className='relative flex-1'>
                <Input
                  type='number'
                  placeholder='0.0'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={!isSmartWalletReady || isLoadingBalances}
                />
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleMaxClick}
                  className='absolute right-2 top-1/2 -translate-y-1/2 text-xs h-6 px-2'
                  disabled={
                    !balance || Number(balance) <= 0 || isLoadingBalances
                  }
                >
                  Max
                </Button>
              </div>
            </div>
          </div>

          <div className='flex justify-center'>
            <Button
              variant='outline'
              size='icon'
              onClick={handleSwapTokens}
              className='rounded-full'
              disabled={isSwapping}
            >
              <ArrowDownUp className='h-4 w-4' />
            </Button>
          </div>

          <div className='space-y-2'>
            <Label>To (estimated)</Label>
            <div className='flex gap-2'>
              <Select
                value={toToken.symbol}
                onValueChange={(value) => {
                  if (value === "PEPE") setToToken(tokens.PEPE);
                  if (value === "USDC") setToToken(tokens.USDC);
                }}
              >
                <SelectTrigger className='w-[120px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='PEPE'>PEPE</SelectItem>
                  <SelectItem value='USDC'>USDC</SelectItem>
                </SelectContent>
              </Select>
              <Input
                readOnly
                value={estimatedOutput.toFixed(6)}
                className='bg-muted'
              />
            </div>
          </div>

          {amount && (
            <div className='text-sm text-muted-foreground'>
              1 {fromToken.symbol} ≈ {exchangeRate} {toToken.symbol}
            </div>
          )}

          {!isSmartWalletReady && (
            <div className='flex items-center text-sm text-yellow-600'>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Initializing smart wallet...
            </div>
          )}

          {smartAccountAddress && (
            <div className='text-sm text-muted-foreground'>
              Smart Wallet: {smartAccountAddress.slice(0, 6)}...
              {smartAccountAddress.slice(-4)}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className='flex flex-col gap-4'>
        <Button
          onClick={handleSwap}
          disabled={isSwapDisabled}
          className='w-full'
        >
          {isSwapping ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Swapping...
            </>
          ) : (
            "Swap"
          )}
        </Button>

        <div className='text-center text-sm text-muted-foreground'>
          Gas fees sponsored by Smart Wallets
        </div>

        {txHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center justify-center gap-1 text-sm hover:text-primary'
          >
            View transaction <ExternalLink className='h-3 w-3' />
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
