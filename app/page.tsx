import { WalletConnect } from "@/components/wallet-connect";
import { TokenSwap } from "@/components/token-swap";
import { Header } from "@/components/header";

export default function Page() {
  return (
    <div className='min-h-screen'>
      <Header />
      <div className='container mx-auto py-10 px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <WalletConnect />
          <TokenSwap />
        </div>
      </div>
    </div>
  );
}
