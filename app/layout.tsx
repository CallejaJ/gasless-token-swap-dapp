import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { PrivyProviderWrapper } from "@/components/privy-provider";
import { setupConsoleFilter } from "@/lib/console-filter";

// Setup console filter to hide analytics errors in development
setupConsoleFilter();

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gasless Token Swap | Base Sepolia",
  description:
    "Swap ERC-20 tokens without holding ETH using Smart Accounts and sponsored gas",
  keywords: [
    "DeFi",
    "Token Swap",
    "Gasless",
    "Smart Accounts",
    "Account Abstraction",
    "EIP-4337",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <PrivyProviderWrapper>
            <main className='min-h-screen bg-gradient-to-b from-background to-background/80'>
              {children}
            </main>
            <Toaster />
          </PrivyProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
