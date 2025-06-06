import { WalletConnect } from "@/components/wallet-connect"
import { TokenSwap } from "@/components/token-swap"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 container max-w-md mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <WalletConnect />
        <TokenSwap />
      </div>
      <Footer />
    </div>
  )
}
