export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  faucetEnabled?: boolean;
}

// Use environment variables for deployed contract addresses
export const PEPE: Token = {
  symbol: "PEPE",
  name: "Mock Pepe",
  decimals: 18,
  address:
    process.env.NEXT_PUBLIC_PEPE_TOKEN_ADDRESS ||
    "0x6A019c763E2e62AB06A148641363A56775B67cf9",
  faucetEnabled: true,
};

export const USDC: Token = {
  symbol: "USDC",
  name: "Mock USD Coin",
  decimals: 6,
  address:
    process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS ||
    "0xe65C976b76b8d8894638cFc8727017534d7119c0",
  faucetEnabled: true,
};

// DEX Contract Address
export const DEX_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_DEX_CONTRACT_ADDRESS ||
  "0xF47d92f44a04886F636Cd772938a78e5AE2E26cC";

// Available tokens for swap
export const SUPPORTED_TOKENS = [PEPE, USDC];

// Default swap pairs
export const DEFAULT_FROM_TOKEN = PEPE;
export const DEFAULT_TO_TOKEN = USDC;
