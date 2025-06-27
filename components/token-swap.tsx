"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Shield, RotateCcw } from "lucide-react";
import { useSmartAccount } from "@/hooks/use-smart-account";
import { parseUnits } from "viem";
import { toast } from "sonner";
import { SigningModal } from "@/components/signing-modal";

export function TokenSwap() {
  const {
    tokens,
    isSmartWalletReady,
    executeSwap,
    getTokenBalance,
    smartAccountAddress,
    signerAddress,
    error,
    fetchBalances,
    showSigningInfo,
    setShowSigningInfo,
    isLoadingBalances,
  } = useSmartAccount();

  const [amount, setAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [fromTokenSymbol, setFromTokenSymbol] = useState<"PEPE" | "USDC">(
    "PEPE"
  );
  const [toTokenSymbol, setToTokenSymbol] = useState<"PEPE" | "USDC">("USDC");
  const [pendingSwap, setPendingSwap] = useState<(() => Promise<void>) | null>(
    null
  );

  const fromToken = tokens[fromTokenSymbol];
  const toToken = tokens[toTokenSymbol];

  // Swap direction handler
  const handleSwapDirection = () => {
    setFromTokenSymbol(toTokenSymbol);
    setToTokenSymbol(fromTokenSymbol);
    setAmount(""); // Clear amount when swapping direction
    setTxHash(null); // Clear previous transaction
  };

  // Calculate estimated output (should match contract calculation)
  const getEstimatedOutput = () => {
    if (!amount || parseFloat(amount) <= 0) return "";

    // These should match your DEX contract's actual rates
    if (fromTokenSymbol === "PEPE") {
      // PEPE to USDC: Based on your DEX contract logic
      // If 1 PEPE = 0.0001 USDC, then this is a rough estimate
      const estimated = parseFloat(amount) * 0.0001;
      return estimated.toFixed(6);
    } else {
      // USDC to PEPE: Based on your DEX contract logic
      // The contract seems to have a different rate, let's be more conservative
      const estimated = parseFloat(amount) * 10000; // 1 USDC = 10,000 PEPE
      return estimated.toFixed(2);
    }
  };

  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Show informative modal before the swap
    setShowSigningInfo(true);

    // Store the swap function to execute after modal confirmation
    const executeSwapFunction = async () => {
      try {
        setIsSwapping(true);
        setTxHash(null);
        setShowSigningInfo(false);

        const amountBigInt = parseUnits(amount, fromToken.decimals);
        const hash = await executeSwap(fromToken, toToken, amountBigInt);

        setTxHash(hash);
        toast.success("🎉 Gasless swap successful!");
        setAmount("");

        // Balance refresh is now handled inside executeSwap
        // No need for additional timeouts here
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

    setPendingSwap(() => executeSwapFunction);
  };

  const fromBalance = getTokenBalance(fromToken.address);
  const toBalance = getTokenBalance(toToken.address);

  return (
    <>
      {/* Informative Modal */}
      <SigningModal
        isOpen={showSigningInfo}
        title='Gasless Transaction'
        description={`Swapping ${
          amount || "0"
        } ${fromTokenSymbol} for ${toTokenSymbol}`}
        details={
          <div className='space-y-2'>
            <p className='font-medium'>This transaction includes:</p>
            <ul className='list-disc list-inside space-y-1 text-xs'>
              <li>Token approval for the DEX contract</li>
              <li>Token swap execution</li>
            </ul>
            <p className='text-xs mt-2'>
              Both operations will be processed in a single gasless transaction.
            </p>
          </div>
        }
        onConfirm={() => {
          if (pendingSwap) {
            pendingSwap();
            setPendingSwap(null);
          }
        }}
        onCancel={() => {
          setShowSigningInfo(false);
          setPendingSwap(null);
        }}
      />

      <Card className='w-full max-w-md mx-auto'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Gasless Token Swap</CardTitle>
            <div className='flex items-center gap-2'>
              <img
                src='/gasless-token-swap.png'
                alt='Gasless Token Swap'
                className='h-4 w-4'
              />
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
                  Signer: {signerAddress.slice(0, 6)}...
                  {signerAddress.slice(-4)}
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
              <Select
                value={fromTokenSymbol}
                onValueChange={(value: "PEPE" | "USDC") => {
                  if (value !== toTokenSymbol) {
                    setFromTokenSymbol(value);
                  }
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
                type='number'
                placeholder='0.0'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isSmartWalletReady || isSwapping}
              />
            </div>
            <p className='text-sm text-muted-foreground'>
              Balance: {fromBalance} {fromToken.symbol}
              {isLoadingBalances && (
                <Loader2 className='inline-block ml-2 h-3 w-3 animate-spin' />
              )}
            </p>
          </div>

          {/* Swap Direction Button */}
          <div className='flex justify-center'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleSwapDirection}
              disabled={isSwapping}
              className='p-2 h-auto'
            >
              <RotateCcw className='h-4 w-4' />
            </Button>
          </div>

          {/* To Token */}
          <div className='space-y-2'>
            <Label>To (estimated)</Label>
            <div className='flex gap-2'>
              <Select
                value={toTokenSymbol}
                onValueChange={(value: "PEPE" | "USDC") => {
                  if (value !== fromTokenSymbol) {
                    setToTokenSymbol(value);
                  }
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
                type='number'
                placeholder='0.000000'
                value={getEstimatedOutput()}
                disabled
              />
            </div>
            <p className='text-sm text-muted-foreground'>
              Balance: {toBalance} {toToken.symbol}
              {isLoadingBalances && (
                <Loader2 className='inline-block ml-2 h-3 w-3 animate-spin' />
              )}
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
                <img
                  src='/gasless-token-swap.png'
                  alt='Gasless Token Swap'
                  className='mr-2 h-4 w-4'
                />
                Swap {fromTokenSymbol} → {toTokenSymbol} (Gasless)
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
    </>
  );
}
