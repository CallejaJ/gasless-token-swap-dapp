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

  // ✅ Public client
  const publicClient = useMemo(() => {
    return createPublicClient({
      chain: sepolia,
      transport: http(SEPOLIA_RPC_URL),
    });
  }, []);

  // ✅ Get embedded wallet from Privy
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

      // 2. ✅ Create wallet client from provider (NEW SYNTAX)
      const walletClient = createWalletClient({
        account: embeddedWallet.address as Address,
        chain: sepolia,
        transport: custom(provider),
      });
      console.log("✅ Wallet client created from Privy provider");

      // 3. ✅ Create ECDSA validator - CORRECTED SYNTAX with explicit version
      const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
        signer: walletClient,
        entryPoint: {
          address: entryPoint07Address,
          version: "0.7",
        },
        kernelVersion: "0.3.1" as const,
      });
      console.log("✅ ECDSA validator created with EntryPoint V07");

      // 4. ✅ Create Kernel account - CORRECTED SYNTAX with explicit version
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

      // 5. ✅ Create paymaster client - CORRECTED SYNTAX with explicit version
      const paymasterClient = createZeroDevPaymasterClient({
        chain: sepolia,
        entryPoint: {
          address: entryPoint07Address,
          version: "0.7",
        },
        transport: http(ZERODEV_PAYMASTER_RPC),
      });
      console.log("💰 Paymaster client created");

      // 6. ✅ Create Kernel client - CRITICAL CHANGE: Use paymaster directly
      const kernelAccountClient = createKernelAccountClient({
        account: kernelAccount,
        chain: sepolia,
        entryPoint: {
          address: entryPoint07Address,
          version: "0.7",
        },
        bundlerTransport: http(ZERODEV_BUNDLER_RPC),
        paymaster: paymasterClient, // CHANGE: use paymaster directly
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
      const reserves = await publicClient.readContract({
        address: DEX_CONTRACT as Address,
        abi: dexAbi,
        functionName: "getReserves",
      });

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
          const output = await publicClient.readContract({
            address: DEX_CONTRACT as Address,
            abi: dexAbi,
            functionName: "calculatePepeToUsdc",
            args: [amount],
          });
          return formatUnits(output, 6);
        } else {
          const output = await publicClient.readContract({
            address: DEX_CONTRACT as Address,
            abi: dexAbi,
            functionName: "calculateUsdcToPepe",
            args: [amount],
          });
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

      const newBalances: Record<string, string> = {};

      // PEPE balance
      const pepeContract = getContract({
        address: PEPE_ADDRESS as Address,
        abi: erc20Abi,
        client: publicClient,
      });
      const pepeBalance = await pepeContract.read.balanceOf([
        smartAccountAddress,
      ]);
      newBalances[PEPE_ADDRESS] = formatUnits(
        pepeBalance,
        TOKENS.PEPE.decimals
      );
      console.log("✅ PEPE balance:", newBalances[PEPE_ADDRESS]);

      // USDC balance
      const usdcContract = getContract({
        address: USDC_ADDRESS as Address,
        abi: erc20Abi,
        client: publicClient,
      });
      const usdcBalance = await usdcContract.read.balanceOf([
        smartAccountAddress,
      ]);
      newBalances[USDC_ADDRESS] = formatUnits(
        usdcBalance,
        TOKENS.USDC.decimals
      );
      console.log("✅ USDC balance:", newBalances[USDC_ADDRESS]);

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

  // ✅ BIDIRECTIONAL gasless swap with improved balance refresh
  const executeSwap = useCallback(
    async (fromToken: Token, toToken: Token, amount: bigint) => {
      if (!kernelClient || !smartAccountAddress) {
        throw new Error("Kernel client not ready");
      }

      // Determine swap direction
      const isPepeToUsdc =
        fromToken.symbol === "PEPE" && toToken.symbol === "USDC";
      const isUsdcToPepe =
        fromToken.symbol === "USDC" && toToken.symbol === "PEPE";

      if (!isPepeToUsdc && !isUsdcToPepe) {
        throw new Error(
          "Invalid token pair. Only PEPE ↔ USDC swaps are supported."
        );
      }

      console.log("🔄 Starting gasless swap...");
      console.log("   From:", fromToken.symbol, fromToken.address);
      console.log("   To:", toToken.symbol, toToken.address);
      console.log(
        "   Amount:",
        formatUnits(amount, fromToken.decimals),
        fromToken.symbol
      );

      try {
        // 0. Verify DEX reserves and add better debugging
        console.log("🔍 DEBUG: Raw amount passed:", amount.toString());
        console.log("🔍 DEBUG: From token decimals:", fromToken.decimals);
        console.log("🔍 DEBUG: To token decimals:", toToken.decimals);

        const dexReserves = await publicClient.readContract({
          address: DEX_CONTRACT as Address,
          abi: dexAbi,
          functionName: "getReserves",
        });

        console.log("📊 DEX Reserves (raw):");
        console.log("   PEPE (raw):", dexReserves[0].toString());
        console.log("   USDC (raw):", dexReserves[1].toString());
        console.log("📊 DEX Reserves (formatted):");
        console.log("   PEPE:", formatUnits(dexReserves[0], 18));
        console.log("   USDC:", formatUnits(dexReserves[1], 6));

        // Calculate expected output based on direction
        let expectedOutput: bigint;
        let reserveCheck: bigint;

        if (isPepeToUsdc) {
          expectedOutput = await publicClient.readContract({
            address: DEX_CONTRACT as Address,
            abi: dexAbi,
            functionName: "calculatePepeToUsdc",
            args: [amount],
          });
          reserveCheck = dexReserves[1]; // USDC reserve
          console.log(
            "💱 Expected USDC output (raw):",
            expectedOutput.toString()
          );
          console.log(
            "💱 Expected USDC output (formatted):",
            formatUnits(expectedOutput, 6)
          );
          console.log("🔍 USDC Reserve check (raw):", reserveCheck.toString());
        } else {
          console.log(
            "🔍 DEBUG: Calling calculateUsdcToPepe with amount:",
            amount.toString()
          );
          expectedOutput = await publicClient.readContract({
            address: DEX_CONTRACT as Address,
            abi: dexAbi,
            functionName: "calculateUsdcToPepe",
            args: [amount],
          });
          reserveCheck = dexReserves[0]; // PEPE reserve
          console.log(
            "💱 Expected PEPE output (raw):",
            expectedOutput.toString()
          );
          console.log(
            "💱 Expected PEPE output (formatted):",
            formatUnits(expectedOutput, 18)
          );
          console.log("🔍 PEPE Reserve check (raw):", reserveCheck.toString());
        }

        // Check if DEX has enough liquidity
        if (reserveCheck < expectedOutput) {
          console.log("❌ LIQUIDITY CHECK FAILED:");
          console.log(
            "   Required:",
            formatUnits(expectedOutput, toToken.decimals),
            toToken.symbol
          );
          console.log(
            "   Available:",
            formatUnits(reserveCheck, toToken.decimals),
            toToken.symbol
          );

          throw new Error(
            `DEX has insufficient ${
              toToken.symbol
            } liquidity. Required: ${formatUnits(
              expectedOutput,
              toToken.decimals
            )} ${toToken.symbol}, Available: ${formatUnits(
              reserveCheck,
              toToken.decimals
            )} ${toToken.symbol}`
          );
        }

        console.log("✅ LIQUIDITY CHECK PASSED:");
        console.log(
          "   Required:",
          formatUnits(expectedOutput, toToken.decimals),
          toToken.symbol
        );
        console.log(
          "   Available:",
          formatUnits(reserveCheck, toToken.decimals),
          toToken.symbol
        );

        // 1. Gasless approval
        console.log("1️⃣ Gasless approval...");
        const approvalTx = await executeApproval(fromToken.address, amount);
        console.log("✅ Approval tx:", approvalTx);

        // Wait for approval confirmation
        await publicClient.waitForTransactionReceipt({
          hash: approvalTx,
          confirmations: 1,
        });

        // Verify allowance
        const allowance = await publicClient.readContract({
          address: fromToken.address,
          abi: erc20Abi,
          functionName: "allowance",
          args: [smartAccountAddress, DEX_CONTRACT as Address],
        });
        console.log(
          "✅ Allowance confirmed:",
          formatUnits(allowance, fromToken.decimals)
        );

        // 2. Gasless swap with correct function
        console.log("2️⃣ Gasless swap...");
        let swapData: `0x${string}`;

        if (isPepeToUsdc) {
          swapData = encodeFunctionData({
            abi: dexAbi,
            functionName: "swapPepeToUsdc",
            args: [amount],
          });
        } else {
          swapData = encodeFunctionData({
            abi: dexAbi,
            functionName: "swapUsdcToPepe",
            args: [amount],
          });
        }

        const txHash = await executeTransaction(
          DEX_CONTRACT as Address,
          swapData
        );

        console.log("🎉 Swap successful! Tx:", txHash);

        // Immediate balance refresh (more aggressive)
        setTimeout(() => {
          console.log("🔄 Refreshing balances (first attempt)...");
          fetchBalances();
        }, 1000);

        // Second refresh after more confirmations
        setTimeout(() => {
          console.log("🔄 Refreshing balances (second attempt)...");
          fetchBalances();
        }, 5000);

        return txHash;
      } catch (error) {
        console.error("❌ Gasless swap failed:", error);
        throw error;
      }
    },
    [
      kernelClient,
      executeTransaction,
      executeApproval,
      fetchBalances,
      publicClient,
      smartAccountAddress,
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
  };
}
