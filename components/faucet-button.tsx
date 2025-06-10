"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSmartAccount } from "@/hooks/use-smart-account";
import { encodeFunctionData, type Address } from "viem";
import { Loader2, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { executeTransaction, smartAccountAddress, isSmartWalletReady } =
    useSmartAccount();
  const { toast } = useToast();

  const handleFaucet = async () => {
    if (!isSmartWalletReady || !smartAccountAddress) {
      toast({
        title: "Wallet not ready",
        description: "Please wait for your smart wallet to initialize",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Para el faucet, necesitamos llamar directamente desde el Smart Account
      // El faucet manda tokens a msg.sender (que será el Smart Account)
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

      // Execute the gasless faucet transaction
      console.log(`🚰 Requesting ${tokenSymbol} from faucet...`);
      console.log(
        `📍 Tokens will be sent to Smart Account: ${smartAccountAddress}`
      );

      const txHash = await executeTransaction(tokenAddress, faucetData);

      toast({
        title: "🎉 Faucet successful!",
        description: `Received ${getFaucetAmount()} - Gas fees were sponsored!`,
      });

      console.log(`✅ ${tokenSymbol} faucet successful:`, txHash);

      // Update balances after successful faucet
      setTimeout(() => {
        onSuccess?.();
      }, 3000);
    } catch (error: any) {
      console.error(`❌ ${tokenSymbol} faucet failed:`, error);

      // Handle specific error cases
      if (error.message?.includes("cooldown")) {
        toast({
          title: "Faucet on cooldown",
          description: "You can only use the faucet once every 24 hours",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Faucet failed",
          description: error.message || "Failed to get tokens from faucet",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFaucetAmount = () => {
    return tokenSymbol === "PEPE" ? "10,000 PEPE" : "1,000 USDC";
  };

  return (
    <Button
      onClick={handleFaucet}
      disabled={isLoading || !isSmartWalletReady}
      variant='outline'
      size='sm'
      className='h-8'
    >
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-3 w-3 animate-spin' />
          Getting tokens...
        </>
      ) : (
        <>
          <Droplets className='mr-2 h-3 w-3' />
          Get {getFaucetAmount()}
        </>
      )}
    </Button>
  );
}
