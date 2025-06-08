// constants/tokens.ts
export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
}

export const TOKENS: Token[] = [
  {
    symbol: "PEPE",
    name: "Pepe Token",
    decimals: 18,
    address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  },
];

export const DEX_CONTRACT = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
export const GAS_LIMIT = 300000; // Adjust based on your contract's requirements
export const MIN_SWAP_AMOUNT = 1; // Minimum amount to swap in the smallest unit of the token
export const MAX_SWAP_AMOUNT = 1000; // Maximum amount to swap in the smallest unit of the token
export const SWAP_FEE_PERCENTAGE = 0.3; // Example fee percentage for the swap
export const SWAP_FEE_ADDRESS = "0xYourFeeAddressHere"; // Replace with your fee collection address
export const SWAP_TIMEOUT = 300; // Timeout for the swap transaction in seconds
export const SWAP_CONFIRMATION_BLOCKS = 12; // Number of blocks to wait for confirmation        s
export const SWAP_SLIPPAGE = 0.01; // 1% slippage tolerance for the swap
