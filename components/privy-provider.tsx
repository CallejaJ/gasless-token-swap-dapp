"use client";

import type React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sepolia } from "viem/chains";
import { useState } from "react";

export function PrivyProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  if (!appId || appId === "your-app-id-here") {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center space-y-4 p-8 border rounded-lg max-w-md mx-auto'>
          <h2 className='text-2xl font-bold text-destructive'>
            Privy App ID Required
          </h2>
          <p className='text-muted-foreground'>
            Please configure your Privy App ID in the .env.local file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={appId}
        config={{
          appearance: {
            theme: "dark",
            accentColor: "#676FFF",
          },

          embeddedWallets: {
            createOnLogin: "users-without-wallets",
          },

          defaultChain: sepolia,
          supportedChains: [sepolia],

          // ✅ Basic login methods
          loginMethods: ["email", "wallet"],

          // ✅ If you need to disable signature prompts, use this instead:
          // (Optional - only uncomment if necessary)
          mfa: {
            noPromptOnMfaRequired: false,
          },
        }}
      >
        <div className='bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border-b border-green-200 dark:border-green-800 p-3'>
          <div className='text-center text-sm text-green-800 dark:text-green-200'>
            ⚡ <strong>ZeroDev OFFICIAL v5.4 + EntryPoint V07 enabled!</strong>{" "}
            Account Abstraction ready.
          </div>
        </div>
        {children}
      </PrivyProvider>
    </QueryClientProvider>
  );
}
