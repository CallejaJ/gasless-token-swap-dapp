"use client";

import { usePrivy } from "@privy-io/react-auth";
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
import { ExternalLink, Wallet, Loader2 } from "lucide-react";
import { useSmartAccount } from "@/hooks/use-smart-account";

export function WalletConnect() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { smartAccountAddress, isDeploying } = useSmartAccount();

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
            Connect your wallet to start swapping tokens without gas fees using
            Privy
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

  // Show connected state
  const walletAddress = user?.wallet?.address || "";
  // const smartAccountAddress = user?.smartWallet?.address || ""

  return (
    <Card className='w-full mb-6'>
      <CardHeader>
        <CardTitle className='flex justify-between items-center'>
          <span className='flex items-center gap-2'>
            <Wallet className='h-5 w-5' />
            Connected Wallet
          </span>
          <Button variant='outline' size='sm' onClick={logout}>
            Disconnect
          </Button>
        </CardTitle>
        <CardDescription>
          Your wallet is connected on Sepolia Testnet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* User Info */}
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>Email</span>
              <span className='text-sm'>
                {user?.email?.address || "Not provided"}
              </span>
            </div>

            {walletAddress && (
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Wallet Address
                </span>
                <a
                  href={`https://sepolia.etherscan.io/address/${walletAddress}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-sm font-mono hover:text-primary'
                >
                  {formatAddress(walletAddress)}
                  <ExternalLink className='h-3 w-3' />
                </a>
              </div>
            )}

            {smartAccountAddress && (
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Smart Account
                </span>
                <a
                  href={`https://sepolia.etherscan.io/address/${smartAccountAddress}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-sm font-mono hover:text-primary'
                >
                  {formatAddress(smartAccountAddress)}
                  <ExternalLink className='h-3 w-3' />
                </a>
              </div>
            )}

            <div className='flex justify-between items-center'>
              <span className='text-sm text-muted-foreground'>
                Account Type
              </span>
              <span className='text-sm'>Smart Account (ERC-4337)</span>
            </div>
          </div>

          {/* Mock Token Balances */}
          <div className='space-y-2'>
            <div className='text-sm text-muted-foreground'>Token Balances</div>
            <div className='grid grid-cols-2 gap-2'>
              <div className='flex justify-between items-center p-2 border rounded-md'>
                <span className='font-medium'>PEPE</span>
                <span>1000.00</span>
              </div>
              <div className='flex justify-between items-center p-2 border rounded-md'>
                <span className='font-medium'>USDC</span>
                <span>500.00</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
