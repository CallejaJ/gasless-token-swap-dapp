import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { BiconomyProvider } from "@/components/biconomy-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gasless Token Swap | Base Sepolia",
  description: "Swap ERC-20 tokens without holding ETH using Smart Accounts and sponsored gas",
  keywords: ["DeFi", "Token Swap", "Gasless", "Smart Accounts", "Account Abstraction", "EIP-4337"],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <BiconomyProvider>
            <main className="min-h-screen bg-gradient-to-b from-background to-background/80">{children}</main>
            <Toaster />
          </BiconomyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
