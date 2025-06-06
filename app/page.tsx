import { WalletConnect } from "@/components/wallet-connect"
import { TokenSwap } from "@/components/token-swap"

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Gasless Token Swap</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WalletConnect />
        <TokenSwap />
      </div>
    </div>
  )
}
