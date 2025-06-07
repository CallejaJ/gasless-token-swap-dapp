// Utility to check current chain configuration
import { sepolia } from "viem/chains";

export function checkChainConfig() {
  console.log("Expected chain:", {
    name: sepolia.name,
    id: sepolia.id,
    nativeCurrency: sepolia.nativeCurrency,
    rpcUrls: sepolia.rpcUrls, // Utility to check current chain configuration
  });
}
