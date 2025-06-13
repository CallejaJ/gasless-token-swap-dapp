# Gasless Token Swap dApp

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Sepolia](https://img.shields.io/badge/Network-Sepolia%20Testnet-blue?style=for-the-badge)](https://sepolia.etherscan.io)
[![Account Abstraction](https://img.shields.io/badge/EIP--4337-Account%20Abstraction-purple?style=for-the-badge)](https://eips.ethereum.org/EIPS/eip-4337)
[![ZeroDev](https://img.shields.io/badge/AA-ZeroDev%20v5.4-green?style=for-the-badge)](https://zerodev.app)

## 🎯 Overview

A decentralized application (dApp) that enables users to **swap ERC-20 tokens without holding any ETH** by leveraging **Smart Accounts (EIP-4337)** and **sponsored gas payments**. Built on Sepolia testnet using ZeroDev SDK v5.4 for Account Abstraction and Paymaster services.

## ✨ Features

### 1. **Smart Account Creation** ✅

- Automatic smart account deployment using ZeroDev SDK v5.4
- Support for Privy embedded wallets and email authentication
- Display of both EOA and Smart Account addresses
- Real-time balance display for deployed tokens

### 2. **Gasless Token Swaps** ✅

- Swap between PEPE ↔ USDC tokens (deployed on Sepolia)
- **No ETH required** for transactions
- All gas fees sponsored by ZeroDev Paymaster
- Exchange rate calculation (1 PEPE = 0.000005 USDC)
- Automatic token approval handling

### 3. **Account Abstraction (EIP-4337)** ✅

- Smart accounts deployed using ZeroDev Kernel v3.1
- EntryPoint v0.7 support
- Sponsored gas via ZeroDev Verifying Paymaster
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
  - **ZeroDev SDK v5.4** (Account Abstraction & Paymaster)
  - **Privy** (Embedded Wallets)
  - **Viem** 2.28.0 (Ethereum library)
  - **permissionless** 0.2.10 (ERC-4337)
- **Network**: Sepolia testnet
- **AA Provider**: **ZeroDev OFFICIAL**

## 🪙 Deployed Contracts

### Token Contracts (Sepolia Testnet)

- **PEPE Token**: `0xb61a8fbe8036478AD3206439Aa8ff4b2F7769782`
- **USDC Token**: `0xdA063Ad8faDD7c41B55e33B530dBc3d376A143F0`
- **DEX Contract**: `0x546582623c79EF1acdA5D872eD5d6689E37a3FAa`

### Smart Account Example

- **Smart Account**: `0xe7BA935750eCaf5D3d4AD96306Eb6820A15da013`
- **Initial Balance**: 50,000 PEPE + 250 USDC

## 🎮 Demo

The app demonstrates:

1. **Wallet connection** without requiring ETH
2. **Automatic Smart Account creation** via ZeroDev
3. **Gasless token swaps** with real deployed tokens
4. **Real-time balance updates** from blockchain
5. **Transaction tracking** via Etherscan links

### Live Transaction Examples

- **Approval TX**: [0xebf536699c6ce32fd2b632af284e2d1525faf6710fecdea9fe73c66f6168ee36](https://sepolia.etherscan.io/tx/0xebf536699c6ce32fd2b632af284e2d1525faf6710fecdea9fe73c66f6168ee36)
- **Swap TX**: [0x24827e0590ab255e1990ee0ffe9fd7bc9ffb0f39b88c55044445c2f9ab73f4e2](https://sepolia.etherscan.io/tx/0x24827e0590ab255e1990ee0ffe9fd7bc9ffb0f39b88c55044445c2f9ab73f4e2)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A ZeroDev account and project ID
- Alchemy API key for Sepolia RPC
- Privy account for embedded wallets

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/gasless-token-swap.git
cd gasless-token-swap
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:

```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Network
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_api_key

# ZeroDev Configuration - API v3 with Chain ID
NEXT_PUBLIC_ZERODEV_PROJECT_ID=your_zerodev_project_id
NEXT_PUBLIC_ZERODEV_BUNDLER_RPC=https://rpc.zerodev.app/api/v3/your_project_id/chain/11155111
NEXT_PUBLIC_ZERODEV_PAYMASTER_RPC=https://rpc.zerodev.app/api/v3/your_project_id/chain/11155111?selfFunded=true

# Token Contracts (Already deployed)
NEXT_PUBLIC_PEPE_TOKEN_ADDRESS=0xb61a8fbe8036478AD3206439Aa8ff4b2F7769782
NEXT_PUBLIC_USDC_TOKEN_ADDRESS=0xdA063Ad8faDD7c41B55e33B530dBc3d376A143F0
NEXT_PUBLIC_DEX_CONTRACT_ADDRESS=0x546582623c79EF1acdA5D872eD5d6689E37a3FAa
```

5. Run the development server:

```bash
npm run dev
```

## 💰 Funding Smart Accounts

To fund smart accounts with test tokens, use the provided Hardhat script:

### Setup Hardhat Environment

1. Create a `.env` file in the root directory:

```env
PRIVATE_KEY=your_deployer_private_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_api_key
```

2. Update the smart account address in the script:

```javascript
const SMART_ACCOUNT_ADDRESS = "0xYourSmartAccountAddress";
```

3. Run the minting script:

```bash
npx hardhat run scripts/mint-tokens.js --network sepolia
```

The script will:

- Mint 50,000 PEPE tokens to the smart account
- Mint 250 USDC tokens to the smart account
- Display transaction hashes and final balances

### Script Output Example:

```
🎁 Minting tokens to Smart Account...
📍 Target Smart Account: 0xe7BA935750eCaf5D3d4AD96306Eb6820A15da013
👤 Using owner account: 0xYourDeployerAddress

🪙 Minting PEPE...
✅ Minted 50000 PEPE
   Tx hash: 0x...

💵 Minting USDC...
✅ Minted 250 USDC
   Tx hash: 0x...

🎉 Tokens minted successfully!
```

## 📋 Requirements Status

### ✅ **All Core Requirements Met:**

1. **Wallet connection & smart account creation** ✅

   - [x] Auto-deploy smart account on wallet connection
   - [x] Display smart account address and balances
   - [x] Support Privy embedded wallets

2. **Token swap** ✅

   - [x] Swap between real deployed PEPE ↔ USDC tokens
   - [x] Handle approve + swap functionality
   - [x] Exchange rate calculation and display

3. **Gasless transactions** ✅

   - [x] Users don't need ETH in their accounts
   - [x] Gas sponsored by ZeroDev Paymaster
   - [x] Clear UI indication: "Gas fees sponsored by ZeroDev OFFICIAL"

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
- ✅ **DEX with liquidity**: SimpleDEX contract with reserves
- ✅ **Price preview**: Real-time exchange rate display
- ✅ **Transaction verification**: View all transactions on Etherscan

## 🏗 Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Frontend  │────▶│   ZeroDev    │────▶│  Smart Account  │
│  (Next.js)  │     │   SDK v5.4   │     │   (Kernel v3.1) │
└─────────────┘     └──────────────┘     └─────────────────┘
         │                                         │
         │                                         ▼
         ▼                  ┌─────────────┐  ┌─────────────┐
    ┌────────┐             │  Verifying  │  │    Token    │
    │ Privy  │             │  Paymaster  │  │  Contracts  │
    └────────┘             └─────────────┘  └─────────────┘
```

## 🧪 Implementation Details

- **Network**: Sepolia Testnet
- **AA Provider**: ZeroDev SDK v5.4
- **EntryPoint**: v0.7 (0x0000000071727De22E5E9d8BAf0edAc6f37da032)
- **Kernel Version**: v3.1
- **Paymaster Type**: Verifying Paymaster (selfFunded)
- **Token Contracts**: Real deployed ERC-20 tokens
- **DEX Contract**: SimpleDEX with fixed exchange rate

## 🎯 Demo Flow

1. **Connect**: Login with email (no ETH needed)
2. **Smart Account**: Automatically created via ZeroDev
3. **Fund**: Use the minting script to add tokens
4. **Swap**: Enter amount, see exchange rate, confirm
5. **Gasless**: Transaction executes without gas fees
6. **Track**: View transaction on Etherscan

## 🚀 Deployment Scripts

### Deploy Tokens (if needed)

```bash
npx hardhat run scripts/deploy-tokens.js --network sepolia
```

### Deploy DEX (if needed)

```bash
npx hardhat run scripts/deploy-dex.js --network sepolia
```

### Add Liquidity to DEX

```bash
npx hardhat run scripts/add-liquidity.js --network sepolia
```

### Mint Tokens to Smart Account

```bash
npx hardhat run scripts/mint-tokens.js --network sepolia
```

## 🔮 Production Considerations

For production deployment:

1. ✅ Token contracts already deployed and verified
2. ✅ ZeroDev Paymaster configured for gasless transactions
3. ✅ DEX contract deployed with initial liquidity
4. ⚠️ Configure production ZeroDev API keys and paymaster balance
5. ⚠️ Set up proper monitoring and analytics

## 🛠 Development Tools

### Hardhat Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy tokens
npx hardhat run scripts/deploy-tokens.js --network sepolia

# Verify contracts
npx hardhat verify --network sepolia <contract_address>
```

### ZeroDev Dashboard

Monitor your project at: https://dashboard.zerodev.app

- Check paymaster balance
- View transaction history
- Monitor gas sponsorship
- Configure policies

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [ZeroDev](https://zerodev.app) for Account Abstraction infrastructure
- [Privy](https://privy.io) for embedded wallet solution
- [Alchemy](https://alchemy.com) for RPC services
- [Hardhat](https://hardhat.org) for smart contract development
- [shadcn/ui](https://ui.shadcn.com) for UI components

---

**Built with ❤️ using ZeroDev OFFICIAL Account Abstraction (EIP-4337)**
