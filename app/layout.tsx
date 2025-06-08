import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { PrivyProviderWrapper } from "@/components/privy-provider";
import { ClientWrapper } from "@/components/client-wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gasless Token Swap | Sepolia Testnet",
  description:
    "Swap ERC-20 tokens without holding ETH using Smart Accounts and sponsored gas",
  keywords: [
    "ethereum",
    "defi",
    "token swap",
    "gasless",
    "smart accounts",
    "account abstraction",
  ],
  authors: [{ name: "Your Name" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ClientWrapper>
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
        </ClientWrapper>
      </body>
    </html>
  );
}
