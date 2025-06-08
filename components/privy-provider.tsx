"use client";

import type React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { WagmiProvider, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "viem/chains";
import { http } from "viem";

// Configuración de Wagmi para Sepolia
const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
  },
});

const queryClient = new QueryClient();

export function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

  // Si no hay App ID configurado, mostrar mensaje de error
  if (!appId || appId === "your-app-id-here") {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center space-y-4 p-8 border rounded-lg max-w-md mx-auto'>
          <h2 className='text-2xl font-bold text-destructive'>
            Privy App ID Required
          </h2>
          <p className='text-muted-foreground'>
            Please configure your Privy App ID in the .env.local file to use
            wallet authentication.
          </p>
          <div className='text-sm text-left bg-muted p-4 rounded font-mono space-y-1'>
            <p>1. Create account at https://dashboard.privy.io</p>
            <p>2. Create a new app</p>
            <p>3. Enable Smart Wallets in the dashboard</p>
            <p>4. Copy your App ID</p>
            <p>5. Add to .env.local:</p>
            <p className='text-primary'>
              NEXT_PUBLIC_PRIVY_APP_ID=your-app-id-here
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Configuración para Smart Wallets
  const smartWalletsConfig = alchemyKey
    ? {
        [sepolia.id]: {
          bundlerUrl: `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`,
        },
      }
    : {};

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false,
        },
        defaultChain: sepolia,
        supportedChains: [sepolia],
        loginMethods: ["email", "wallet", "sms"],
      }}
    >
      <SmartWalletsProvider config={smartWalletsConfig}>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={wagmiConfig}>
            {/* Mostrar advertencia si falta Alchemy */}
            {!alchemyKey && (
              <div className='bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 p-3'>
                <div className='text-center text-sm text-yellow-800 dark:text-yellow-200'>
                  ⚠️ Smart Wallets require Alchemy API key.
                  <a
                    href='https://alchemy.com'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='underline ml-1'
                  >
                    Get one here
                  </a>
                </div>
              </div>
            )}
            {children}
          </WagmiProvider>
        </QueryClientProvider>
      </SmartWalletsProvider>
    </PrivyProvider>
  );
}
