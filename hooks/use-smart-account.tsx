"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import {
  createPublicClient,
  http,
  parseUnits,
  formatUnits,
  getContract,
  type Address,
  encodeFunctionData,
} from "viem";
import { sepolia } from "viem/chains";
import { erc20Abi } from "abitype/abis";

// Token addresses on Sepolia
const PEPE_ADDRESS = "0x6982508145454Ce325dDbE47a25d4ec3d2311933";
const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const DEX_CONTRACT = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // Uniswap V2 Router

interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: Address;
}

const TOKENS: Record<string, Token> = {
  PEPE: {
    symbol: "PEPE",
    name: "Pepe Token",
    decimals: 18,
    address: PEPE_ADDRESS,
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: USDC_ADDRESS,
  },
};

export function useSmartAccount() {
  const { authenticated, user, ready } = usePrivy();
  const { wallets } = useWallets();

  const [smartAccountAddress, setSmartAccountAddress] =
    useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

  // Intentar importar useSmartWallets dinámicamente
  const [smartWalletClient, setSmartWalletClient] = useState<any>(null);
  const [hasSmartWallets, setHasSmartWallets] = useState(false);

  useEffect(() => {
    // Intentar cargar el hook de Smart Wallets
    const loadSmartWallets = async () => {
      try {
        const { useSmartWallets } = await import(
          "@privy-io/react-auth/smart-wallets"
        );
        setHasSmartWallets(true);
      } catch (error) {
        console.log("Smart Wallets not available, using regular wallets");
        setHasSmartWallets(false);
      }
    };

    loadSmartWallets();
  }, []);

  // Create public client for blockchain interactions
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: sepolia,
      transport: http(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
          "https://eth-sepolia.public.blastapi.io"
      ),
    });
  }, []);

  // Get wallet address (embedded wallet or smart wallet)
  const walletAddress = useMemo(() => {
    if (!user?.linkedAccounts) return null;

    // Primero buscar smart wallet
    const smartWallet = user.linkedAccounts.find(
      (account) => account.type === "smart_wallet"
    );
    if (smartWallet) return smartWallet.address as Address;

    // Si no hay smart wallet, usar embedded wallet
    const embeddedWallet = user.linkedAccounts.find(
      (account) =>
        account.type === "wallet" && account.walletClientType === "privy"
    );
    return (embeddedWallet?.address as Address) || null;
  }, [user?.linkedAccounts]);

  // Initialize account when ready and authenticated
  useEffect(() => {
    if (ready && authenticated && walletAddress) {
      setSmartAccountAddress(walletAddress);
      fetchBalances();
    } else {
      resetState();
    }
  }, [ready, authenticated, walletAddress]);

  const resetState = () => {
    setSmartAccountAddress(null);
    setBalances({});
    setError(null);
  };

  // Fetch token balances
  const fetchBalances = useCallback(async () => {
    if (!walletAddress) return;

    try {
      setIsLoadingBalances(true);
      const newBalances: Record<string, string> = {};

      // Fetch PEPE balance
      const pepeContract = getContract({
        address: PEPE_ADDRESS,
        abi: erc20Abi,
        client: publicClient,
      });

      try {
        const pepeBalance = await pepeContract.read.balanceOf([walletAddress]);
        newBalances[PEPE_ADDRESS] = formatUnits(
          pepeBalance,
          TOKENS.PEPE.decimals
        );
      } catch (err) {
        console.log("PEPE balance fetch failed:", err);
        newBalances[PEPE_ADDRESS] = "0.0";
      }

      // Fetch USDC balance
      const usdcContract = getContract({
        address: USDC_ADDRESS,
        abi: erc20Abi,
        client: publicClient,
      });

      try {
        const usdcBalance = await usdcContract.read.balanceOf([walletAddress]);
        newBalances[USDC_ADDRESS] = formatUnits(
          usdcBalance,
          TOKENS.USDC.decimals
        );
      } catch (err) {
        console.log("USDC balance fetch failed:", err);
        newBalances[USDC_ADDRESS] = "0.0";
      }

      setBalances(newBalances);
    } catch (err) {
      console.error("Error fetching balances:", err);
      setError("Failed to fetch token balances");
      // Set default balances for demo
      setBalances({
        [PEPE_ADDRESS]: "1000.0",
        [USDC_ADDRESS]: "500.0",
      });
    } finally {
      setIsLoadingBalances(false);
    }
  }, [walletAddress, publicClient]);

  // Execute transaction (mock implementation)
  const executeTransaction = useCallback(
    async (to: Address, data: `0x${string}`, value: bigint = 0n) => {
      if (!smartAccountAddress) {
        throw new Error("Wallet not initialized");
      }

      // Mock transaction for demo purposes
      const mockTxHash = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("")}`;

      console.log("Mock transaction:", { to, data, value });

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return mockTxHash;
    },
    [smartAccountAddress]
  );

  // Execute token swap (mock implementation)
  const executeSwap = useCallback(
    async (fromToken: Token, toToken: Token, amount: bigint) => {
      if (!smartAccountAddress) {
        throw new Error("Wallet not initialized");
      }

      console.log("Mock swap:", { fromToken, toToken, amount });

      // Mock transaction
      const txHash = await executeTransaction(
        DEX_CONTRACT,
        "0x1234567890abcdef" as `0x${string}`
      );

      // Update balances optimistically
      setTimeout(() => {
        fetchBalances();
      }, 3000);

      return txHash;
    },
    [smartAccountAddress, executeTransaction, fetchBalances]
  );

  // Get token balance by address
  const getTokenBalance = useCallback(
    (tokenAddress: Address): string => {
      return balances[tokenAddress] || "0.0";
    },
    [balances]
  );

  // Check if wallet is ready
  const isSmartWalletReady = useMemo(() => {
    return !!(smartAccountAddress && authenticated);
  }, [smartAccountAddress, authenticated]);

  return {
    smartAccountAddress,
    isDeploying: false,
    error,
    balances,
    isLoadingBalances,
    tokens: TOKENS,
    executeTransaction,
    executeSwap,
    getTokenBalance,
    fetchBalances,
    reset: resetState,
    isSmartWalletReady,
    hasSmartWallets,
    smartWalletClient,
  };
}
