import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WalletConnect } from "@/components/wallet-connect"
import { TokenSwap } from "@/components/token-swap"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <div className="container mx-auto py-10">
          <h1 className="text-3xl font-bold text-center mb-8">Gasless Token Swap</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <WalletConnect />
            <TokenSwap />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
