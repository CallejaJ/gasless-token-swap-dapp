"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ExternalLink,
  Loader2,
  Zap,
  Shield,
  ArrowUpRight,
} from "lucide-react";

interface TransactionStatusProps {
  txHash?: string | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function TransactionStatus({
  txHash,
  isLoading,
  error,
  onRetry,
}: TransactionStatusProps) {
  if (error) {
    return (
      <Card className='border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'>
        <CardContent className='p-4'>
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <div className='h-5 w-5 rounded-full bg-red-500 flex items-center justify-center'>
                <span className='text-white text-xs'>✕</span>
              </div>
              <span className='font-medium text-red-800 dark:text-red-200'>
                Transaction Failed
              </span>
            </div>

            <p className='text-sm text-red-600 dark:text-red-400'>{error}</p>

            {onRetry && (
              <Button
                variant='outline'
                size='sm'
                onClick={onRetry}
                className='text-red-600 border-red-300 hover:bg-red-50'
              >
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className='border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'>
        <CardContent className='p-4'>
          <div className='space-y-3'>
            {/* Header */}
            <div className='flex items-center gap-2'>
              <Loader2 className='h-5 w-5 animate-spin text-blue-600' />
              <span className='font-medium text-blue-800 dark:text-blue-200'>
                Processing Gasless Transaction
              </span>
            </div>

            {/* Status indicators */}
            <div className='space-y-2'>
              <div className='flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300'>
                <Zap className='h-4 w-4' />
                <span>Gas fees sponsored by Paymaster</span>
                <Badge
                  variant='secondary'
                  className='bg-green-100 text-green-800 text-xs'
                >
                  FREE
                </Badge>
              </div>

              <div className='flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300'>
                <Shield className='h-4 w-4' />
                <span>Secured by Smart Account (ERC-4337)</span>
              </div>
            </div>

            <div className='text-xs text-blue-600 dark:text-blue-400'>
              Your transaction is being processed on-chain without requiring
              ETH...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (txHash) {
    return (
      <Card className='border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'>
        <CardContent className='p-4'>
          <div className='space-y-3'>
            {/* Success header */}
            <div className='flex items-center gap-2'>
              <CheckCircle className='h-5 w-5 text-green-600' />
              <span className='font-medium text-green-800 dark:text-green-200'>
                Gasless Transaction Successful!
              </span>
            </div>

            {/* Transaction details */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-green-700 dark:text-green-300'>
                  Transaction Hash:
                </span>
                <code className='text-xs bg-green-100 dark:bg-green-800 px-2 py-1 rounded'>
                  {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </code>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-sm text-green-700 dark:text-green-300'>
                  Gas Cost:
                </span>
                <div className='flex items-center gap-1'>
                  <Badge
                    variant='secondary'
                    className='bg-green-100 text-green-800 text-xs'
                  >
                    <Zap className='h-3 w-3 mr-1' />
                    FREE (Sponsored)
                  </Badge>
                </div>
              </div>
            </div>

            {/* View on explorer button */}
            <Button
              variant='outline'
              size='sm'
              asChild
              className='w-full text-green-700 border-green-300 hover:bg-green-100'
            >
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center gap-2'
              >
                <span>View on Etherscan</span>
                <ArrowUpRight className='h-4 w-4' />
              </a>
            </Button>

            {/* Gasless info */}
            <div className='text-xs text-green-600 dark:text-green-400 pt-2 border-t border-green-200 dark:border-green-700'>
              🎉 You paid $0 in gas fees thanks to Account Abstraction!
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
