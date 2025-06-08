"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSmartAccount } from "@/hooks/use-smart-account";
import { encodeFunctionData, type Address } from "viem";

interface FaucetButtonProps {
  tokenSymbol: "PEPE" | "USDC";
  tokenAddress: Address;
  onSuccess?: () => void;
}

export function FaucetButton({
  tokenSymbol,
  tokenAddress,
  onSuccess,
}: FaucetButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const { executeTransaction, fetchBalances } = useSmartAccount();

  const handleFaucet = async () => {
    try {
      setIsLoading(true);
      setLastError(null);

      // Encode the faucet() function call
      const faucetData = encodeFunctionData({
        abi: [
          {
            name: "faucet",
            type: "function",
            inputs: [],
            outputs: [],
          },
        ],
        functionName: "faucet",
        args: [],
      });

      // Execute the faucet transaction
      const txHash = await executeTransaction(tokenAddress, faucetData);

      console.log(`✅ ${tokenSymbol} faucet successful:`, txHash);

      // Update balances after successful faucet
      setTimeout(() => {
        fetchBalances();
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error(`❌ ${tokenSymbol} faucet failed:`, error);
      setLastError(error instanceof Error ? error.message : "Faucet failed");
    } finally {
      setIsLoading(false);
    }
  };

  const getFaucetAmount = () => {
    return tokenSymbol === "PEPE" ? "10,000 PEPE" : "1,000 USDC";
  };

  return (
    <div className='flex flex-col gap-2'>
      <Button
        onClick={handleFaucet}
        disabled={isLoading}
        variant='outline'
        size='sm'
        className='h-8 text-xs'
      >
        {isLoading ? "🔄" : "🚰"} Get {getFaucetAmount()}
      </Button>

      {lastError && (
        <p className='text-xs text-red-400 text-center'>{lastError}</p>
      )}

      <p className='text-xs text-gray-400 text-center'>Free tokens every 24h</p>
    </div>
  );
}
