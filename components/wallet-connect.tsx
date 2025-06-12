"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatAddress } from "@/lib/utils";
import {
  ExternalLink,
  Wallet,
  Loader2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useSmartAccount } from "@/hooks/use-smart-account";

export function WalletConnect() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const {
    smartAccountAddress,
    isSmartWalletReady,
    balances,
    isLoadingBalances,
    fetchBalances,
    tokens,
    hasSmartWallets,
    error,
    signerAddress,
  } = useSmartAccount();

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Wallet className='h-5 w-5' />
            Connect Wallet
          </CardTitle>
          <CardDescription>Initializing wallet connection...</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button disabled className='w-full'>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Loading...
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Show connect button if not authenticated
  if (!authenticated) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Wallet className='h-5 w-5' />
            Connect Wallet
          </CardTitle>
          <CardDescription>
            Connect your wallet to start swapping tokens with gasless
            transactions powered by ZeroDev OFFICIAL v5.4 + EntryPoint V07
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={login} className='w-full'>
            Connect with Privy
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // ✅ Detect embedded wallet vs injected wallets
  const embeddedWallet = wallets?.find(
    (wallet) =>
      wallet.walletClientType === "privy" && wallet.connectorType === "embedded"
  );
  const injectedWallets = wallets?.filter(
    (wallet) => wallet.connectorType === "injected"
  );

  const hasEmbeddedWallet = !!embeddedWallet;
  const needsEmbeddedWallet =
    !hasEmbeddedWallet && injectedWallets && injectedWallets.length > 0;

  return (
    <Card className='w-full mb-6'>
      <CardHeader>
        <CardTitle className='flex justify-between items-center'>
          <span className='flex items-center gap-2'>
            <Wallet className='h-5 w-5' />
            Connected Wallet
          </span>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={fetchBalances}
              disabled={isLoadingBalances || !smartAccountAddress}
            >
              {isLoadingBalances ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <RefreshCw className='h-4 w-4' />
              )}
            </Button>
            <Button variant='outline' size='sm' onClick={logout}>
              Disconnect
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Your wallet is connected on Sepolia Testnet with ZeroDev OFFICIAL v5.4
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* ✅ Wallet Type Warning */}
          {needsEmbeddedWallet && (
            <div className='p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md'>
              <div className='flex items-start gap-2'>
                <AlertTriangle className='h-5 w-5 text-yellow-600 mt-0.5' />
                <div>
                  <div className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>
                    Embedded Wallet Required for ZeroDev Gasless Transactions
                  </div>
                  <p className='text-xs text-yellow-600 dark:text-yellow-300 mt-1'>
                    You're using an external wallet (MetaMask, etc). To enable
                    gasless transactions with ZeroDev, please disconnect and reconnect using
                    Privy's embedded wallet option.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Embedded Wallet Success */}
          {hasEmbeddedWallet && (
            <div className='p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md'>
              <div className='flex items-center gap-2 text-sm text-green-800 dark:text-green-200'>
                <CheckCircle className='h-4 w-4' />
                <span>
                  Embedded wallet active - ZeroDev OFFICIAL v5.4 gasless transactions enabled!
                </span>
              </div>
            </div>
          )}

          {/* User Info */}
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Email</span>
              <span className='text-sm'>
                {user?.email?.address || "Not provided"}
              </span>
            </div>

            {/* ✅ Show signer wallet info (embedded wallet) */}
            {hasEmbeddedWallet && (
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Signer Wallet (Embedded)
                </span>
                <a
                  href={`https://sepolia.etherscan.io/address/${embeddedWallet.address}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-sm font-mono hover:text-primary text-blue-600'
                >
                  {formatAddress(embeddedWallet.address)}
                  <ExternalLink className='h-3 w-3' />
                </a>
              </div>
            )}

            {/* ✅ Show injected wallets as inactive */}
            {injectedWallets &&
              injectedWallets.map((wallet, index) => (
                <div key={index} className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    External Wallet (Inactive)
                  </span>
                  <span className='text-sm font-mono text-muted-foreground'>
                    {formatAddress(wallet.address)}
                    <span className='text-xs ml-2 text-yellow-600'>
                      No gasless
                    </span>
                  </span>
                </div>
              ))}

            {smartAccountAddress ? (
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  ZeroDev Smart Account
                </span>
                <a
                  href={`https://sepolia.etherscan.io/address/${smartAccountAddress}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-sm font-mono hover:text-primary text-green-600'
                >
                  {formatAddress(smartAccountAddress)}
                  <ExternalLink className='h-3 w-3' />
                </a>
              </div>
            ) : (
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  ZeroDev Smart Account
                </span>
                <span className='text-sm text-yellow-600 flex items-center gap-1'>
                  {hasEmbeddedWallet ? (
                    <>
                      <Loader2 className='h-3 w-3 animate-spin' />
                      Creating...
                    </>
                  ) : (
                    "Requires embedded wallet"
                  )}
                </span>
              </div>
            )}

            {/* ✅ Show address comparison if both exist */}
            {smartAccountAddress && signerAddress && smartAccountAddress !== signerAddress && (
              <div className='p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-xs'>
                <p className='text-green-700 dark:text-green-300'>
                  ✅ Account Abstraction working: Smart Account has different address than signer
                </p>
              </div>
            )}

            {/* ❌ Warning if addresses are the same */}
            {smartAccountAddress && signerAddress && smartAccountAddress === signerAddress && (
              <div className='p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs'>
                <p className='text-red-700 dark:text-red-300'>
                  ❌ Warning: Addresses should be different for Account Abstraction
                </p>
              </div>
            )}

            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>
                Account Type
              </span>
              <span className='text-sm'>
                {hasSmartWallets
                  ? "ZeroDev OFFICIAL v5.4 Kernel v3.1 (EIP-4337 V07)"
                  : hasEmbeddedWallet
                  ? "Embedded Wallet"
                  : "External Wallet"}
              </span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>
                Paymaster Status
              </span>
              <span
                className={`text-sm ${
                  isSmartWalletReady
                    ? "text-green-600"
                    : hasEmbeddedWallet
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {isSmartWalletReady
                  ? "Sponsored ✅"
                  : hasEmbeddedWallet
                  ? "Initializing..."
                  : "Not Available ❌"}
              </span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className='p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md'>
              <div className='flex items-start gap-2'>
                <AlertTriangle className='h-4 w-4 text-red-600 mt-0.5' />
                <div className='text-sm text-red-800 dark:text-red-200'>
                  {error}
                </div>
              </div>
            </div>
          )}

          {/* Token Balances - only show if smart account is ready */}
          {smartAccountAddress && (
            <div className='space-y-3'>
              <div className='text-sm text-muted-foreground'>
                ZeroDev OFFICIAL v5.4 Smart Account Balances
              </div>
              {isLoadingBalances ? (
                <div className='flex items-center justify-center p-4'>
                  <Loader2 className='h-4 w-4 animate-spin mr-2' />
                  <span className='text-sm'>Loading balances...</span>
                </div>
              ) : (
                <div className='space-y-3'>
                  {/* PEPE Token */}
                  <div className='flex items-center justify-between p-3 border rounded-md bg-card'>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <span className='font-medium'>PEPE</span>
                        <span className='text-sm font-mono'>
                          {parseFloat(
                            balances[tokens.PEPE.address] || "0"
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className='text-xs text-muted-foreground mt-1'>
                        Mock Pepe Token
                      </div>
                    </div>
                  </div>

                  {/* USDC Token */}
                  <div className='flex items-center justify-between p-3 border rounded-md bg-card'>
                    <div className='flex-1'>
                      <div className='flex items-center justify-between'>
                        <span className='font-medium'>USDC</span>
                        <span className='text-sm font-mono'>
                          {parseFloat(
                            balances[tokens.USDC.address] || "0"
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className='text-xs text-muted-foreground mt-1'>
                        Mock USD Coin
                      </div>
                    </div>
                  </div>

                  {/* Info about tokens */}
                  <div className='mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs'>
                    <p className='text-blue-700 dark:text-blue-300'>
                      💡 Use testnet faucets to get tokens for testing ZeroDev OFFICIAL v5.4
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ready status */}
          {isSmartWalletReady && (
            <div className='p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md'>
              <div className='text-sm text-green-800 dark:text-green-200'>
                ✅ ZeroDev OFFICIAL v5.4 Smart Account ready! All transactions will be gasless and sponsored by the paymaster.
              </div>
            </div>
          )}

          {/* Contract Links */}
          <div className='space-y-2'>
            <div className='text-sm text-muted-foreground'>Contract Links</div>
            <div className='grid grid-cols-1 gap-2 text-xs'>
              <a
                href={`https://sepolia.etherscan.io/address/${tokens.PEPE.address}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1 text-muted-foreground hover:text-primary'
              >
                PEPE Contract <ExternalLink className='h-3 w-3' />
              </a>
              <a
                href={`https://sepolia.etherscan.io/address/${tokens.USDC.address}`}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-1 text-muted-foreground hover:text-primary'
              >
                USDC Contract <ExternalLink className='h-3 w-3' />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default WalletConnect;