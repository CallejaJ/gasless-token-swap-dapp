# Gasless Token Swap dApp

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Sepolia](https://img.shields.io/badge/Network-Sepolia%20Testnet-blue?style=for-the-badge)](https://sepolia.etherscan.io)
[![Account Abstraction](https://img.shields.io/badge/EIP--4337-Account%20Abstraction-purple?style=for-the-badge)](https://eips.ethereum.org/EIPS/eip-4337)
[![Biconomy](https://img.shields.io/badge/AA-Biconomy-orange?style=for-the-badge)](https://biconomy.io)

## 🎯 Overview

A decentralized application (dApp) that enables users to **swap ERC-20 tokens without holding any ETH** by leveraging **Smart Accounts (EIP-4337)** and **sponsored gas payments**. Built on Sepolia testnet using Biconomy for Account Abstraction and Paymaster services.

## ✨ Features

### 1. **Smart Account Creation** ✅

- Automatic smart account deployment using Biconomy SDK
- Support for MetaMask and email authentication
- Display of both EOA and Smart Account addresses
- Real-time balance display for deployed tokens

### 2. **Gasless Token Swaps** ✅

- Swap between PEPE ↔ USDC tokens (deployed on Sepolia)
- **No ETH required** for transactions
- All gas fees sponsored by Biconomy Paymaster
- Exchange rate calculation (1 PEPE = 0.000005 USDC)
- Automatic token approval handling

### 3. **Account Abstraction (EIP-4337)** ✅

- Smart accounts deployed using Biconomy
- Sponsored gas via Biconomy Paymaster
- Clear indication that transactions are gasless

### 4. **Transaction Feedback** ✅

- Real-time transaction status updates
- Loading, success, and error states
- Block explorer links for all transactions (Sepolia Etherscan)
- Transaction hash display

### 5. **Polished UI/UX** ✅

- Mobile-responsive design
- Dark mode interface
- Clean, modern design using shadcn/ui
- Clear indication of sponsored gas fees

## 🛠 Tech Stack

- **Framework**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Web3**:
  - **Biconomy SDK** (Account Abstraction & Paymaster)
  - **Viem** 2.22.23 (Ethereum library)
  - **Account Abstraction**: ERC-4337 via Biconomy
- **Network**: Sepolia testnet
- **AA Provider**: **Biconomy**

## 🪙 Deployed Contracts

### Token Contracts (Sepolia Testnet)

- **PEPE Token**: `0xb61a8fbe8036478AD3206439Aa8ff4b2F7769782`
- **USDC Token**: `0xdA063Ad8faDD7c41B55e33B530dBc3d376A143F0`

### Smart Account Example

- **Smart Account**: `0xfCa17024a5AD5e24d6C1c444D6B94b980AE00243`
- **Initial Balance**: 50,000 PEPE + 250 USDC (minted successfully)

## 🎮 Demo

The app demonstrates:

1. **Wallet connection** without requiring ETH
2. **Automatic Smart Account creation** via Biconomy
3. **Gasless token swaps** with real deployed tokens
4. **Real-time balance updates** from blockchain
5. **Transaction tracking** via Etherscan links

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Biconomy account and API keys
- Alchemy API key for Sepolia RPC

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/gasless-token-swap.git
cd gasless-token-swap
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:

```env
# Biconomy Configuration
NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY=your_paymaster_api_key
NEXT_PUBLIC_BICONOMY_BUNDLER_URL=https://bundler.biconomy.io/api/v2/11155111/your_bundler_api_key

# Alchemy Configuration
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_api_key

# Token Addresses (Already deployed)
NEXT_PUBLIC_PEPE_TOKEN_ADDRESS=0xb61a8fbe8036478AD3206439Aa8ff4b2F7769782
NEXT_PUBLIC_USDC_TOKEN_ADDRESS=0xdA063Ad8faDD7c41B55e33B530dBc3d376A143F0
```

5. Run the development server:

```bash
npm run dev
```

## 📋 Requirements Status

### ✅ **All Core Requirements Met:**

1. **Wallet connection & smart account creation** ✅

   - [x] Auto-deploy smart account on wallet connection
   - [x] Display smart account address and balances
   - [x] Support MetaMask authentication

2. **Token swap** ✅

   - [x] Swap between real deployed PEPE ↔ USDC tokens
   - [x] Handle approve + swap functionality
   - [x] Exchange rate calculation and display

3. **Gasless transactions** ✅

   - [x] Users don't need ETH in their accounts
   - [x] Gas sponsored by Biconomy Paymaster
   - [x] Clear UI indication: "Gas fees sponsored by Biconomy"

4. **Transaction feedback** ✅

   - [x] Loading, success, and error states
   - [x] Etherscan transaction links
   - [x] Transaction hash display

5. **Polished UI/UX** ✅
   - [x] Responsive mobile-first design
   - [x] Dark mode theme
   - [x] Professional interface

### 🎁 **Bonus Features:**

- ✅ **Real token contracts**: Deployed and verified on Sepolia
- ✅ **Token minting**: Successful deployment with initial balances
- ✅ **Price preview**: Real-time exchange rate display
- ✅ **Transaction status**: Comprehensive feedback system

## 🏗 Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Frontend  │────▶│   Biconomy   │────▶│  Smart Account  │
│  (Next.js)  │     │     SDK      │     │   (ERC-4337)   │
└─────────────┘     └──────────────┘     └─────────────────┘
                                                   │
                                                   ▼
                          ┌─────────────┐    ┌─────────────┐
                          │  Biconomy   │───▶│   Token     │
                          │ Paymaster   │    │ Contracts   │
                          └─────────────┘    └─────────────┘
```

## 🧪 Implementation Details

- **Network**: Sepolia Testnet
- **AA Provider**: Biconomy SDK
- **Token Contracts**: Real deployed ERC-20 tokens
- **Paymaster**: Biconomy Paymaster for sponsored transactions
- **Smart Wallet Type**: Biconomy Smart Account (ERC-4337 compatible)

## 🎯 Demo Flow

1. **Connect**: Use MetaMask (no ETH needed)
2. **Smart Account**: Automatically created via Biconomy
3. **Swap**: Enter amount, see exchange rate, confirm
4. **Gasless**: Transaction executes without gas fees
5. **Track**: View transaction on Etherscan

## 🚀 Token Deployment

### Successful Deployment ✅

The following tokens have been successfully deployed and minted:

```bash
# PEPE Token: 0xb61a8fbe8036478AD3206439Aa8ff4b2F7769782
# USDC Token: 0xdA063Ad8faDD7c41B55e33B530dBc3d376A143F0

# Smart Account funded with:
# - 50,000 PEPE tokens
# - 250 USDC tokens
```

### Minting Script

Use the provided Hardhat script to mint tokens to new smart accounts:

```bash
npx hardhat run scripts/mint-tokens.js --network sepolia
```

## 🔮 Production Considerations

For production deployment:

1. ✅ Token contracts already deployed and verified
2. ✅ Biconomy Paymaster configured for gasless transactions
3. ⚠️ Configure production Biconomy API keys
4. ⚠️ Set up proper token economics and liquidity pools

## 🛠 Development Tools

### Hardhat Commands

```bash
# Deploy tokens
npx hardhat run scripts/deploy-tokens.js --network sepolia

# Mint tokens to smart account
npx hardhat run scripts/mint-tokens.js --network sepolia

# Verify contracts
npx hardhat verify --network sepolia <contract_address>
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Biconomy](https://biconomy.io) for Account Abstraction infrastructure
- [Alchemy](https://alchemy.com) for RPC services
- [Hardhat](https://hardhat.org) for smart contract development
- [shadcn/ui](https://ui.shadcn.com) for UI components

---

**Built with ❤️ using Biconomy Account Abstraction (EIP-4337)**
