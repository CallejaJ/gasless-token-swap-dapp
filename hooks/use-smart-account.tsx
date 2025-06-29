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
  parseEther,
  createWalletClient,
  custom,
} from "viem";
import { sepolia } from "viem/chains";
import { erc20Abi } from "abitype/abis";

// ✅ CORRECTED IMPORTS for permissionless@0.2.10 + ZeroDev
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
} from "@zerodev/sdk";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import { entryPoint07Address } from "viem/account-abstraction";

// ✅ Contract addresses
const PEPE_ADDRESS =
  process.env.NEXT_PUBLIC_PEPE_TOKEN_ADDRESS ||
  "0xb61a8fbe8036478AD3206439Aa8ff4b2F7769782";
const USDC_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_TOKEN_ADDRESS ||
  "0xdA063Ad8faDD7c41B55e33B530dBc3d376A143F0";
const DEX_CONTRACT =
  process.env.NEXT_PUBLIC_DEX_CONTRACT_ADDRESS ||
  "0x546582623c79EF1acdA5D872eD5d6689E37a3FAa";

// ✅ ZeroDev config - SEPARATE URLs
const ZERODEV_PROJECT_ID = process.env.NEXT_PUBLIC_ZERODEV_PROJECT_ID!;
const ZERODEV_BUNDLER_RPC = process.env.NEXT_PUBLIC_ZERODEV_BUNDLER_RPC!;
const ZERODEV_PAYMASTER_RPC = process.env.NEXT_PUBLIC_ZERODEV_PAYMASTER_RPC!;
const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!;

// ✅ COMPLETE DEX ABI for both directions
const dexAbi = [
  {
    name: "swapPepeToUsdc",
    type: "function",
    inputs: [{ name: "_pepeAmount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "swapUsdcToPepe",
    type: "function",
    inputs: [{ name: "_usdcAmount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "calculatePepeToUsdc",
    type: "function",
    inputs: [{ name: "_pepeAmount", type: "uint256" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "pure",
  },
  {
    name: "calculateUsdcToPepe",
    type: "function",
    inputs: [{ name: "_usdcAmount", type: "uint256" }],
    outputs: [{ type: "uint256" }],
    stateMutability: "pure",
  },
  {
    name: "getReserves",
    type: "function",
    inputs: [],
    outputs: [
      { name: "_pepeReserve", type: "uint256" },
      { name: "_usdcReserve", type: "uint256" },
    ],
    stateMutability: "view",
  },
] as const;

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
  const [kernelClient, setKernelClient] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [showSigningInfo, setShowSigningInfo] = useState(false);

  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: sepolia,
      transport: http(SEPOLIA_RPC_URL),
    });
  }, []);

  const embeddedWallet = useMemo(() => {
    return wallets.find((wallet) => wallet.walletClientType === "privy");
  }, [wallets]);

  // ✅ Initialize ZeroDev - CORRECTED SYNTAX FOR permissionless@0.2.10
  const initializeZeroDevClient = useCallback(async () => {
    if (!ZERODEV_PROJECT_ID || !ZERODEV_BUNDLER_RPC || !ZERODEV_PAYMASTER_RPC) {
      setError("❌ Missing ZeroDev configuration in environment variables.");
      return;
    }

    if (!embeddedWallet) {
      setError("❌ Embedded wallet required. Please login first.");
      return;
    }

    try {
      setIsInitializing(true);
      setError(null);
      console.log(
        "🚀 Initializing ZeroDev with permissionless@0.2.10 approach..."
      );

      // 1. ✅ Get provider from Privy embedded wallet
      const provider = await embeddedWallet.getEthereumProvider();
      if (!provider) {
        throw new Error("Failed to get Ethereum provider from embedded wallet");
      }

      // 2. ✅ Create wallet client from provider
      const walletClient = createWalletClient({
        account: embeddedWallet.address as Address,
        chain: sepolia,
        transport: custom(provider),
      });
      console.log("✅ Wallet client created from Privy provider");

      // 3. ✅ Create ECDSA validator
      const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
        signer: walletClient,
        entryPoint: {
          address: entryPoint07Address,
          version: "0.7",
        },
        kernelVersion: "0.3.1" as const,
      });
      console.log("✅ ECDSA validator created with EntryPoint V07");

      // 4. ✅ Create Kernel account
      const kernelAccount = await createKernelAccount(publicClient, {
        plugins: { sudo: ecdsaValidator },
        entryPoint: {
          address: entryPoint07Address,
          version: "0.7",
        },
        kernelVersion: "0.3.1" as const,
      });

      console.log("🆚 SIGNER ADDRESS:", embeddedWallet.address);
      console.log("🆚 SMART ACCOUNT ADDRESS:", kernelAccount.address);

      // ✅ Verify that addresses are different
      if (kernelAccount.address === embeddedWallet.address) {
        throw new Error(
          "Smart Account address should be different from signer address"
        );
      }
      console.log("✅ Addresses are different - Account Abstraction working!");

      // 5. ✅ Create paymaster client
      const paymasterClient = createZeroDevPaymasterClient({
        chain: sepolia,
        transport: http(ZERODEV_PAYMASTER_RPC),
      });
      console.log("💰 Paymaster client created");

      // 6. ✅ Create Kernel client
      const kernelAccountClient = createKernelAccountClient({
        account: kernelAccount,
        chain: sepolia,
        bundlerTransport: http(ZERODEV_BUNDLER_RPC),
        paymaster: paymasterClient,
      });

      console.log("✅ ZeroDev Kernel Account ready!");
      console.log("💰 Gasless transactions enabled!");

      setKernelClient(kernelAccountClient);
      setSmartAccountAddress(kernelAccount.address as Address);
    } catch (err: unknown) {
      console.error("❌ ZeroDev initialization failed:", err);
      if (err instanceof Error) {
        setError(`ZeroDev error: ${err.message}`);
      } else {
        setError("ZeroDev error: Unknown error occurred");
      }
    } finally {
      setIsInitializing(false);
    }
  }, [embeddedWallet, publicClient]);

  // Initialize when ready
  useEffect(() => {
    if (ready && authenticated && embeddedWallet && ZERODEV_PROJECT_ID) {
      console.log("✅ Conditions met - initializing ZeroDev");
      initializeZeroDevClient();
    } else {
      resetState();
    }
  }, [ready, authenticated, embeddedWallet, initializeZeroDevClient]);

  const resetState = useCallback(() => {
    setSmartAccountAddress(null);
    setKernelClient(null);
    setBalances({});
    setError(null);
  }, []);

  // ✅ Check DEX liquidity before swap
  const checkDexLiquidity = useCallback(async () => {
    if (!publicClient) return null;

    try {
      const reserves = (await publicClient.readContract({
        address: DEX_CONTRACT as Address,
        abi: dexAbi,
        functionName: "getReserves",
      })) as readonly [bigint, bigint];

      return {
        pepeReserve: formatUnits(reserves[0], 18),
        usdcReserve: formatUnits(reserves[1], 6),
        pepeReserveRaw: reserves[0],
        usdcReserveRaw: reserves[1],
      };
    } catch (error) {
      console.error("Failed to fetch DEX reserves:", error);
      return null;
    }
  }, [publicClient]);

  // ✅ Calculate swap output without executing
  const calculateSwapOutput = useCallback(
    async (fromToken: Token, toToken: Token, amount: bigint) => {
      if (!publicClient) return null;

      try {
        const isPepeToUsdc =
          fromToken.symbol === "PEPE" && toToken.symbol === "USDC";

        if (isPepeToUsdc) {
          const output = (await publicClient.readContract({
            address: DEX_CONTRACT as Address,
            abi: dexAbi,
            functionName: "calculatePepeToUsdc",
            args: [amount],
          })) as bigint;
          return formatUnits(output, 6);
        } else {
          const output = (await publicClient.readContract({
            address: DEX_CONTRACT as Address,
            abi: dexAbi,
            functionName: "calculateUsdcToPepe",
            args: [amount],
          })) as bigint;
          return formatUnits(output, 18);
        }
      } catch (error) {
        console.error("Failed to calculate swap output:", error);
        return null;
      }
    },
    [publicClient]
  );

  // ✅ Improved fetch balances with better error handling
  const fetchBalances = useCallback(async () => {
    if (!smartAccountAddress) return;

    try {
      setIsLoadingBalances(true);
      console.log("🔄 Fetching balances for:", smartAccountAddress);

      const [pepeBalance, usdcBalance] = await Promise.all([
        publicClient.readContract({
          address: PEPE_ADDRESS as Address,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [smartAccountAddress],
        }),
        publicClient.readContract({
          address: USDC_ADDRESS as Address,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [smartAccountAddress],
        }),
      ]);

      const newBalances = {
        [PEPE_ADDRESS]: formatUnits(
          pepeBalance as bigint,
          TOKENS.PEPE.decimals
        ),
        [USDC_ADDRESS]: formatUnits(
          usdcBalance as bigint,
          TOKENS.USDC.decimals
        ),
      };

      setBalances((prev) => {
        // Solo actualiza si hay cambios
        if (JSON.stringify(prev) !== JSON.stringify(newBalances)) {
          console.log("🔄 Balances actualizados:", newBalances);
          return newBalances;
        }
        return prev;
      });
    } catch (error) {
      console.error("❌ Failed to fetch balances:", error);
      setError("Failed to fetch balances");
    } finally {
      setIsLoadingBalances(false);
    }
  }, [smartAccountAddress, publicClient]);

  useEffect(() => {
    if (smartAccountAddress) {
      fetchBalances();
    }
  }, [smartAccountAddress, fetchBalances]);

  // ✅ Execute transaction
  const executeTransaction = useCallback(
    async (to: Address, data: `0x${string}`, value: bigint = 0n) => {
      if (!kernelClient) {
        throw new Error("Kernel client not ready");
      }

      try {
        console.log("🚀 Executing gasless transaction...");

        const txHash = await kernelClient.sendTransaction({
          to,
          value,
          data,
        });

        console.log("✅ Gasless transaction confirmed:", txHash);
        console.log("💰 Gas was sponsored by ZeroDev!");

        return txHash;
      } catch (error: any) {
        console.error("❌ Transaction failed:", error);

        // Don't throw paymaster error if simulation fails
        if (error.message?.includes("reverted during simulation")) {
          throw new Error(
            "Transaction reverted - check contract function and parameters"
          );
        }

        throw error;
      }
    },
    [kernelClient]
  );

  // ✅ Gasless approval
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

  // ✅ BIDIRECTIONAL gasless swap with robust balance refresh
  const executeSwap = useCallback(
    async (fromToken: Token, toToken: Token, amount: bigint) => {
      if (!kernelClient || !smartAccountAddress) {
        throw new Error("Kernel client not ready");
      }

      const isPepeToUsdc =
        fromToken.symbol === "PEPE" && toToken.symbol === "USDC";
      const isUsdcToPepe =
        fromToken.symbol === "USDC" && toToken.symbol === "PEPE";

      if (!isPepeToUsdc && !isUsdcToPepe) {
        throw new Error("Invalid token pair");
      }

      try {
        // 1. Verificar liquidez
        const [dexReserves, expectedOutput] = await Promise.all([
          publicClient.readContract({
            address: DEX_CONTRACT as Address,
            abi: dexAbi,
            functionName: "getReserves",
          }) as Promise<readonly [bigint, bigint]>,
          isPepeToUsdc
            ? publicClient.readContract({
                address: DEX_CONTRACT as Address,
                abi: dexAbi,
                functionName: "calculatePepeToUsdc",
                args: [amount],
              })
            : publicClient.readContract({
                address: DEX_CONTRACT as Address,
                abi: dexAbi,
                functionName: "calculateUsdcToPepe",
                args: [amount],
              }),
        ]);

        // Verificar liquidez
        const reserveCheck = isPepeToUsdc ? dexReserves[1] : dexReserves[0];
        if (reserveCheck < (expectedOutput as bigint)) {
          throw new Error(`Insufficient ${toToken.symbol} liquidity`);
        }

        // 2. Aprobación
        const approvalTx = await executeApproval(fromToken.address, amount);
        await publicClient.waitForTransactionReceipt({
          hash: approvalTx,
          confirmations: 1,
        });

        // 3. Swap
        const swapData = encodeFunctionData({
          abi: dexAbi,
          functionName: isPepeToUsdc ? "swapPepeToUsdc" : "swapUsdcToPepe",
          args: [amount],
        });

        const txHash = await executeTransaction(
          DEX_CONTRACT as Address,
          swapData
        );

        // 4. Actualizar balances
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Esperar 3 segundos
        await fetchBalances();

        // Verificación adicional después de 10 segundos
        setTimeout(() => fetchBalances(), 10000);

        return txHash;
      } catch (error) {
        console.error("❌ Swap failed:", error);
        await fetchBalances(); // Intentar actualizar balances incluso si falla
        throw error;
      }
    },
    [
      kernelClient,
      smartAccountAddress,
      executeTransaction,
      executeApproval,
      publicClient,
      fetchBalances,
    ]
  );

  const getTokenBalance = useCallback(
    (tokenAddress: Address): string => balances[tokenAddress] || "0.0",
    [balances]
  );

  const isSmartWalletReady = useMemo(
    () => !!(smartAccountAddress && kernelClient && authenticated && ready),
    [smartAccountAddress, kernelClient, authenticated, ready]
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
    checkDexLiquidity,
    calculateSwapOutput,
    reset: resetState,
    isSmartWalletReady,
    hasSmartWallets: !!kernelClient,
    smartWalletClient: kernelClient,
    isGasless: !!kernelClient,
    paymasterActive: !!kernelClient,
    signerAddress: embeddedWallet?.address as Address | null,
    showSigningInfo,
    setShowSigningInfo,
  };
}
