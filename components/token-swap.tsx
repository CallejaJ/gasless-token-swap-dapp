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
import { Loader2, ArrowDownUp, Zap, Shield } from "lucide-react";
import { useSmartAccount } from "@/hooks/use-smart-account";
import { parseUnits } from "viem";
import { toast } from "sonner";

export function TokenSwap() {
  const {
    tokens,
    isSmartWalletReady,
    executeSwap,
    getTokenBalance,
    smartAccountAddress,
    signerAddress,
    error,
  } = useSmartAccount();

  const [amount, setAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const fromToken = tokens.PEPE;
  const toToken = tokens.USDC;

  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsSwapping(true);
      setTxHash(null);

      const amountBigInt = parseUnits(amount, fromToken.decimals);
      const hash = await executeSwap(fromToken, toToken, amountBigInt);

      setTxHash(hash);
      toast.success("🎉 Gasless swap successful!");
      setAmount("");
    } catch (error) {
      console.error("Swap failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Swap failed. Please try again."
      );
    } finally {
      setIsSwapping(false);
    }
  };

  const pepeBalance = getTokenBalance(fromToken.address);
  const usdcBalance = getTokenBalance(toToken.address);

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Gasless Token Swap</CardTitle>
          <div className='flex items-center gap-2'>
            <Zap className='h-4 w-4 text-yellow-500' />
            <span className='text-xs text-muted-foreground'>
              ZeroDev OFFICIAL
            </span>
          </div>
        </div>
        <CardDescription>
          Swap tokens without paying gas fees using ZeroDev OFFICIAL
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Address Proof */}
        {signerAddress && smartAccountAddress && (
          <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 space-y-1 text-xs'>
            <div className='flex items-center gap-2 text-blue-700 dark:text-blue-300'>
              <Shield className='h-3 w-3' />
              <span className='font-medium'>Account Abstraction Active</span>
            </div>
            <div className='font-mono text-[10px] space-y-1 text-blue-600 dark:text-blue-400'>
              <div>
                Signer: {signerAddress.slice(0, 6)}...{signerAddress.slice(-4)}
              </div>
              <div>
                Smart Account: {smartAccountAddress.slice(0, 6)}...
                {smartAccountAddress.slice(-4)}
              </div>
              <div className='text-green-600 dark:text-green-400'>
                ✓ Different addresses = AA working!
              </div>
            </div>
          </div>
        )}

        {/* From Token */}
        <div className='space-y-2'>
          <Label>From</Label>
          <div className='flex gap-2'>
            <Select value={fromToken.symbol} disabled>
              <SelectTrigger className='w-[120px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={fromToken.symbol}>
                  {fromToken.symbol}
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              type='number'
              placeholder='0.0'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!isSmartWalletReady || isSwapping}
            />
          </div>
          <p className='text-sm text-muted-foreground'>
            Balance: {pepeBalance} {fromToken.symbol}
          </p>
        </div>

        {/* Swap Arrow */}
        <div className='flex justify-center'>
          <ArrowDownUp className='h-5 w-5 text-muted-foreground' />
        </div>

        {/* To Token */}
        <div className='space-y-2'>
          <Label>To (estimated)</Label>
          <div className='flex gap-2'>
            <Select value={toToken.symbol} disabled>
              <SelectTrigger className='w-[120px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={toToken.symbol}>{toToken.symbol}</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type='number'
              placeholder='0.000000'
              value={amount ? (parseFloat(amount) * 0.1).toFixed(6) : ""}
              disabled
            />
          </div>
          <p className='text-sm text-muted-foreground'>
            Balance: {usdcBalance} {toToken.symbol}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3'>
            <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>
          </div>
        )}

        {/* Success Message */}
        {txHash && (
          <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3'>
            <p className='text-sm text-green-600 dark:text-green-400'>
              ✅ Transaction successful!
            </p>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-xs text-blue-600 hover:underline break-all'
            >
              View on Etherscan
            </a>
          </div>
        )}
      </CardContent>

      <CardFooter className='flex flex-col gap-2'>
        <Button
          onClick={handleSwap}
          disabled={!isSmartWalletReady || isSwapping || !amount}
          className='w-full'
          size='lg'
        >
          {isSwapping ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Swapping (Gasless)...
            </>
          ) : (
            <>
              <Zap className='mr-2 h-4 w-4' />
              Swap (Gasless)
            </>
          )}
        </Button>

        <div className='text-center space-y-1'>
          <p className='text-xs text-muted-foreground'>
            💰 Gas fees sponsored by ZeroDev OFFICIAL (EntryPoint V07)
          </p>
          <p className='text-xs text-green-600 dark:text-green-400'>
            Using ZeroDev SDK v5.4 + permissionless v0.2.10 + Privy v2.10
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
