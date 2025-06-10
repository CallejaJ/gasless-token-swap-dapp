"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import {
  createPublicClient,
  http,
  formatUnits,
  getContract,
  type Address,
  encodeFunctionData,
} from "viem";
import { sepolia } from "viem/chains";
import { erc20Abi } from "abitype/abis";

// ✅ Imports para Biconomy v4.5.7 (REAL Account Abstraction EIP-4337)
import { createSmartAccountClient } from "@biconomy/account";

// ✅ Direcciones de contratos
const PEPE_ADDRESS =
  process.env.NEXT_PUBLIC_PEPE_TOKEN_ADDRESS ||
  "0xCf0d3a20149dFD96aE8f4757632826F53c1A89AA";
const USDC_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS ||
  "0xe7e525b9917638eE57469EeB37b54f0780b1C8F2";
const DEX_CONTRACT =
  process.env.NEXT_PUBLIC_DEX_CONTRACT_ADDRESS ||
  "0x308C6e1BCa2f2939B973Ff2c977cedCE13875f43";

// ✅ Biconomy config
const BICONOMY_PAYMASTER_API_KEY =
  process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY!;
const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!;
const BICONOMY_PAYMASTER_URL =
  process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_URL ||
  "https://paymaster.biconomy.io/api/v2/11155111/MROF-EWd6.de4bef69-1391-43ce-951b-c195a3c62ea2";

console.log("🔧 Biconomy Config (v4.5.7):");
console.log(
  "Paymaster API Key:",
  BICONOMY_PAYMASTER_API_KEY ? "✅" : "❌ MISSING!"
);
console.log("Paymaster URL:", BICONOMY_PAYMASTER_URL ? "✅" : "❌ MISSING!");

interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: Address;
}

const TOKENS: Record<string, Token> = {
  PEPE: {
    symbol: "PEPE",
    name: "Mock Pepe",
    decimals: 18,
    address: PEPE_ADDRESS as Address,
  },
  USDC: {
    symbol: "USDC",
    name: "Mock USD Coin",
    decimals: 6,
    address: USDC_ADDRESS as Address,
  },
};

export function useSmartAccount() {
  const { authenticated, ready } = usePrivy();
  const { wallets } = useWallets();

  const [smartAccountAddress, setSmartAccountAddress] =
    useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [smartAccount, setSmartAccount] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Public client
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: sepolia,
      transport: http(SEPOLIA_RPC_URL),
    });
  }, []);

  // ✅ SOLO usar embedded wallet
  const embeddedWallet = useMemo(() => {
    if (wallets && wallets.length > 0) {
      const privyWallet = wallets.find(
        (w) => w.walletClientType === "privy" && w.connectorType === "embedded"
      );
      return privyWallet;
    }
    return null;
  }, [wallets]);

  // ✅ Crear signer compatible con Biconomy v4.5.7
  const createBiconomySigner = useCallback(async () => {
    if (!embeddedWallet) return null;

    try {
      const provider = await embeddedWallet.getEthereumProvider();
      console.log(
        "✅ Creating Biconomy signer from embedded wallet:",
        embeddedWallet.address
      );

      // Retornar el provider directamente para Biconomy v4.5.7
      return provider;
    } catch (err) {
      console.error("❌ Failed to create signer:", err);
      return null;
    }
  }, [embeddedWallet]);

  // ✅ Inicializar Biconomy con REAL Account Abstraction (EIP-4337)
  const initializeBiconomyClient = useCallback(async () => {
    if (!BICONOMY_PAYMASTER_API_KEY) {
      setError(
        "❌ Missing Biconomy API key. Check your environment variables."
      );
      return;
    }

    if (!embeddedWallet || embeddedWallet.connectorType !== "embedded") {
      setError(
        "❌ Embedded wallet required. Please enable 'Smart wallets' and 'Auto-create embedded wallets' in Privy dashboard"
      );
      return;
    }

    try {
      setIsInitializing(true);
      setError(null);
      console.log("🚀 Initializing Biconomy v4.5.7 (REAL EIP-4337)...");
      console.log("📱 Using embedded wallet:", embeddedWallet.address);

      // 1. Obtener provider de Privy
      const provider = await embeddedWallet.getEthereumProvider();

      // 2. Crear un adaptador para el signer
      const signer = {
        provider: provider,
        getAddress: async () => embeddedWallet.address as Address,
        _isSigner: true,
      };

      // 3. ✅ Crear Smart Account Client (v4.5.7)
      const smartAccountClient = await createSmartAccountClient({
        signer: signer,
        paymasterUrl: BICONOMY_PAYMASTER_URL,
        chainId: sepolia.id, // 11155111
        rpcUrl: SEPOLIA_RPC_URL, // Biconomy v4.5.7 necesita esto
      });

      const address = await smartAccountClient.getAccountAddress();

      console.log("✅ Biconomy Smart Account (EIP-4337) initialized!");
      console.log("🎯 Smart Account Address:", address);
      console.log(
        "🔥 This is REAL Account Abstraction with Sponsored Paymaster!"
      );

      setSmartAccount(smartAccountClient);
      setSmartAccountAddress(address as Address);
    } catch (err: unknown) {
      console.error("❌ Biconomy initialization failed:", err);

      if (err instanceof Error) {
        if (err.message.includes("API") || err.message.includes("key")) {
          setError(
            "❌ Invalid Biconomy API key. Check your environment variables."
          );
        } else {
          setError(`Biconomy error: ${err.message}`);
        }
      } else {
        setError("Biconomy error: Unknown error occurred");
      }
    } finally {
      setIsInitializing(false);
    }
  }, [embeddedWallet]);

  // Inicializar cuando esté todo listo
  useEffect(() => {
    console.log("🔍 Checking conditions:");
    console.log("- Ready:", ready);
    console.log("- Authenticated:", authenticated);
    console.log("- Embedded wallet:", embeddedWallet?.address);
    console.log("- Wallet connector type:", embeddedWallet?.connectorType);
    console.log(
      "- Biconomy API Key:",
      BICONOMY_PAYMASTER_API_KEY ? "✅" : "❌"
    );

    if (
      ready &&
      authenticated &&
      embeddedWallet &&
      BICONOMY_PAYMASTER_API_KEY
    ) {
      if (embeddedWallet.connectorType === "embedded") {
        console.log(
          "✅ All conditions met - initializing Biconomy v4.5.7 (REAL EIP-4337)"
        );
        initializeBiconomyClient();
      } else {
        setError(
          "❌ Please use embedded wallet. Enable 'Smart wallets' in Privy dashboard"
        );
      }
    } else {
      resetState();
    }
  }, [ready, authenticated, embeddedWallet, initializeBiconomyClient]);

  const resetState = useCallback(() => {
    setSmartAccountAddress(null);
    setSmartAccount(null);
    setBalances({});
    setError(null);
  }, []);

  // Fetch balances
  const fetchBalances = useCallback(async () => {
    const addressToCheck = smartAccountAddress;
    if (!addressToCheck) {
      console.log("⏳ Smart account not ready for balance fetch");
      return;
    }

    try {
      setIsLoadingBalances(true);
      const newBalances: Record<string, string> = {};

      // PEPE balance
      const pepeContract = getContract({
        address: PEPE_ADDRESS as Address,
        abi: erc20Abi,
        client: publicClient,
      });
      const pepeBalance = await pepeContract.read.balanceOf([addressToCheck]);
      newBalances[PEPE_ADDRESS] = formatUnits(
        pepeBalance,
        TOKENS.PEPE.decimals
      );
      console.log(`✅ PEPE balance: ${newBalances[PEPE_ADDRESS]}`);

      // USDC balance
      const usdcContract = getContract({
        address: USDC_ADDRESS as Address,
        abi: erc20Abi,
        client: publicClient,
      });
      const usdcBalance = await usdcContract.read.balanceOf([addressToCheck]);
      newBalances[USDC_ADDRESS] = formatUnits(
        usdcBalance,
        TOKENS.USDC.decimals
      );
      console.log(`✅ USDC balance: ${newBalances[USDC_ADDRESS]}`);

      setBalances(newBalances);
    } catch (err) {
      console.error("❌ Balance fetch failed:", err);
      setBalances({
        [PEPE_ADDRESS]: "0.0",
        [USDC_ADDRESS]: "0.0",
      });
    } finally {
      setIsLoadingBalances(false);
    }
  }, [smartAccountAddress, publicClient]);

  // Auto-fetch balances
  useEffect(() => {
    if (smartAccountAddress) {
      fetchBalances();
    }
  }, [smartAccountAddress, fetchBalances]);

  // ✅ Ejecutar transacción GASLESS con Biconomy
  const executeTransaction = useCallback(
    async (to: Address, data: `0x${string}`, value: bigint = 0n) => {
      if (!smartAccount) {
        throw new Error("Biconomy Smart Account not ready");
      }

      try {
        console.log(
          "🚀 Executing GASLESS transaction (EIP-4337 Account Abstraction):",
          {
            to,
            data,
            value: value.toString(),
          }
        );

        const tx = {
          to,
          data,
          value: value.toString(),
        };

        console.log("📤 Sending transaction with Biconomy Smart Account...");
        console.log("Smart Account address:", smartAccountAddress);
        console.log("Transaction details:", tx);

        const userOpResponse = await smartAccount.sendTransaction(tx, {
          paymasterServiceData: { mode: "SPONSORED" }, // ✅ REAL Sponsored Paymaster
        });

        console.log("⏳ Waiting for transaction hash...");
        const { transactionHash } = await userOpResponse.waitForTxHash();

        console.log("✅ Transaction confirmed:", transactionHash);
        return transactionHash;
      } catch (error: any) {
        console.error("❌ Gasless transaction failed:", error);
        console.error("Error details:", {
          message: error.message,
          code: error.code,
          data: error.data,
        });
        throw error;
      }
    },
    [smartAccount, smartAccountAddress]
  );

  // Approval gasless
  const executeApproval = useCallback(
    async (tokenAddress: Address, amount: bigint) => {
      const approveData = encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [DEX_CONTRACT as Address, amount],
      });
      return await executeTransaction(tokenAddress, approveData);
    },
    [executeTransaction]
  );

  // Swap gasless completo
  const executeSwap = useCallback(
    async (fromToken: Token, toToken: Token, amount: bigint) => {
      if (!smartAccount) {
        throw new Error("Biconomy not ready");
      }

      console.log("🔄 Starting GASLESS swap (EIP-4337 Account Abstraction):", {
        from: fromToken.symbol,
        to: toToken.symbol,
        amount: amount.toString(),
      });

      try {
        // 1. Approval gasless
        console.log("1️⃣ Gasless approval...");
        await executeApproval(fromToken.address, amount);

        await new Promise((resolve) => setTimeout(resolve, 3000));

        // 2. Swap gasless
        console.log("2️⃣ Gasless swap...");
        const swapData = encodeFunctionData({
          abi: [
            {
              name: "swapPepeToUsdc",
              type: "function",
              inputs: [{ name: "_pepeAmount", type: "uint256" }],
              outputs: [],
            },
          ],
          functionName: "swapPepeToUsdc",
          args: [amount],
        });

        const txHash = await executeTransaction(
          DEX_CONTRACT as Address,
          swapData
        );

        setTimeout(fetchBalances, 5000);

        return txHash;
      } catch (error) {
        console.error("❌ Gasless swap failed:", error);
        throw error;
      }
    },
    [smartAccount, executeTransaction, executeApproval, fetchBalances]
  );

  const getTokenBalance = useCallback(
    (tokenAddress: Address): string => balances[tokenAddress] || "0.0",
    [balances]
  );

  const isSmartWalletReady = useMemo(
    () => !!(smartAccountAddress && smartAccount && authenticated && ready),
    [smartAccountAddress, smartAccount, authenticated, ready]
  );

  return {
    smartAccountAddress,
    isDeploying: isInitializing,
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
    hasSmartWallets: !!smartAccount,
    smartWalletClient: smartAccount,
    isGasless: !!smartAccount,
    paymasterActive: !!smartAccount,
  };
}
