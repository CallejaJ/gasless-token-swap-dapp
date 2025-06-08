import { WalletConnect } from "@/components/wallet-connect";
import { TokenSwap } from "@/components/token-swap";
import { ModeToggle } from "@/components/mode-toggle";
import { PaymasterStatus } from "@/components/paymaster-status";

export default function Page() {
  return (
    <div className='container mx-auto py-10 px-4'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Gasless Token Swap</h1>
        <ModeToggle />
        <div className='flex items-center gap-4'>
          <PaymasterStatus />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <WalletConnect />
        <TokenSwap />
      </div>
    </div>
  );
}
