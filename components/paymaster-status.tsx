"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Zap, Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useSmartAccount } from "@/hooks/use-smart-account";

export function PaymasterStatus() {
  const { isSmartWalletReady, smartAccountAddress, error, signerAddress } =
    useSmartAccount();

  if (error) {
    return (
      <Card className='mb-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-3'>
            <AlertCircle className='h-5 w-5 text-red-600 dark:text-red-400' />
            <div>
              <p className='text-sm font-medium text-red-800 dark:text-red-200'>
                Smart Wallet Error
              </p>
              <p className='text-xs text-red-600 dark:text-red-400'>{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isSmartWalletReady) {
    return (
      <Card className='mb-4 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-3'>
            <Loader2 className='h-5 w-5 animate-spin text-yellow-600' />
            <div>
              <p className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                Initializing ZeroDev Kernel Account
              </p>
              <p className='text-xs text-yellow-600 dark:text-yellow-400'>
                Setting up gasless transactions...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='mb-4 border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20'>
      <CardContent className='p-4'>
        <div className='space-y-3'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <CheckCircle className='h-5 w-5 text-green-600 dark:text-green-400' />
              <span className='font-semibold text-green-800 dark:text-green-200'>
                ZeroDev OFFICIAL Kernel Account Ready
              </span>
            </div>
            <span className='bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 px-2 py-1 rounded text-xs font-medium'>
              ZeroDev V5.4 + V07
            </span>
          </div>

          {/* Features */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3 text-xs'>
            <div className='flex items-center gap-2 text-green-700 dark:text-green-300'>
              <Zap className='h-4 w-4' />
              <span>Sponsored Paymaster</span>
            </div>
            <div className='flex items-center gap-2 text-blue-700 dark:text-blue-300'>
              <Shield className='h-4 w-4' />
              <span>Kernel v3.1 Security</span>
            </div>
            <div className='flex items-center gap-2 text-purple-700 dark:text-purple-300'>
              <CheckCircle className='h-4 w-4' />
              <span>EntryPoint V07</span>
            </div>
          </div>

          {/* Smart Account Info */}
          {smartAccountAddress && signerAddress && (
            <div className='pt-2 border-t border-green-200 dark:border-green-700'>
              <div className='space-y-1 text-xs'>
                <p className='text-green-600 dark:text-green-400'>
                  Kernel Account: {smartAccountAddress.slice(0, 6)}...
                  {smartAccountAddress.slice(-4)}
                </p>
                <p className='text-blue-600 dark:text-blue-400'>
                  Signer (EOA): {signerAddress.slice(0, 6)}...
                  {signerAddress.slice(-4)}
                </p>
                <p className='text-purple-600 dark:text-purple-400 font-medium'>
                  ✓ Different addresses = Account Abstraction active!
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
