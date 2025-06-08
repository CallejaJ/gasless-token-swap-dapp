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
    "0xCf0d3a20149dFD96aE8f4757632826F53c1A89AA",
  faucetEnabled: true,
};

export const USDC: Token = {
  symbol: "USDC",
  name: "Mock USD Coin",
  decimals: 6,
  address:
    process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS ||
    "0xe7e525b9917638eE57469EeB37b54f0780b1C8F2",
  faucetEnabled: true,
};

// DEX Contract Address
export const DEX_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_DEX_CONTRACT_ADDRESS ||
  "0x308C6e1BCa2f2939B973Ff2c977cedCE13875f43";

// Available tokens for swap
export const SUPPORTED_TOKENS = [PEPE, USDC];

// Default swap pairs
export const DEFAULT_FROM_TOKEN = PEPE;
export const DEFAULT_TO_TOKEN = USDC;
