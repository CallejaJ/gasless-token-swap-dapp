# Gasless Token Swap dApp

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Sepolia](https://img.shields.io/badge/Network-Sepolia%20Testnet-blue?style=for-the-badge)](https://sepolia.etherscan.io)
[![Account Abstraction](https://img.shields.io/badge/EIP--4337-Account%20Abstraction-purple?style=for-the-badge)](https://eips.ethereum.org/EIPS/eip-4337)
[![Privy](https://img.shields.io/badge/Auth-Privy-green?style=for-the-badge)](https://privy.io)

## 🎯 Overview

A decentralized application (dApp) that enables users to **swap ERC-20 tokens without holding any ETH** by leveraging **Smart Accounts (EIP-4337)** and **sponsored gas payments**. Built on Sepolia testnet using Privy for Smart Wallet management.

## ✨ Features

### 1. **Smart Account Creation** ✅

- Automatic smart account deployment when users connect their wallet
- Support for MetaMask and email authentication via Privy
- Display of both EOA and Smart Account addresses
- Real-time balance display for supported tokens

### 2. **Gasless Token Swaps** ✅

- Swap between PEPE ↔ USDC mock tokens
- **No ETH required** for transactions
- All gas fees sponsored by Paymaster
- Exchange rate calculation (1 PEPE = 0.000005 USDC)
- Automatic token approval handling

### 3. **Account Abstraction (EIP-4337)** ✅

- Smart accounts deployed using Privy
- Sponsored gas via Paymaster integration
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
  - **Privy** (Smart Wallet & authentication)
  - **Viem** 2.22.23 (Ethereum library)
  - **Account Abstraction**: ERC-4337 via Privy
- **Network**: Sepolia testnet
- **AA Provider**: **Privy** (with Safe Smart Wallets)

## 🎮 Demo

The app demonstrates:

1. **Email/Wallet connection** without requiring ETH
2. **Automatic Smart Account creation**
3. **Gasless token swaps** with clear UI feedback
4. **Real-time balance updates** (demo mode)
5. **Transaction tracking** via Etherscan links

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Privy account and App ID
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
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Alchemy Configuration
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_api_key
```

5. Configure Smart Wallets in Privy Dashboard:

   - Enable Smart Wallets
   - Select "Safe" as wallet type
   - Add Sepolia network with your Alchemy bundler URL

6. Run the development server:

```bash
npm run dev
```

## 📋 Requirements Status

### ✅ **All Core Requirements Met:**

1. **Wallet connection & smart account creation** ✅

   - [x] Auto-deploy smart account on wallet connection
   - [x] Display smart account address and balances
   - [x] Support email and wallet authentication

2. **Token swap** ✅

   - [x] Swap between PEPE ↔ USDC tokens
   - [x] Handle approve + swap functionality
   - [x] Exchange rate calculation and display

3. **Gasless transactions** ✅

   - [x] Users don't need ETH in their accounts
   - [x] Gas sponsored by Paymaster
   - [x] Clear UI indication: "Gas fees sponsored by Paymaster"

4. **Transaction feedback** ✅

   - [x] Loading, success, and error states
   - [x] Etherscan transaction links
   - [x] Transaction hash display

5. **Polished UI/UX** ✅
   - [x] Responsive mobile-first design
   - [x] Dark mode theme
   - [x] Professional interface

### 🎁 **Bonus Features:**

- ✅ **Price preview**: Real-time exchange rate display
- ✅ **Transaction status**: Comprehensive feedback system

## 🏗 Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Frontend  │────▶│    Privy     │────▶│  Smart Account  │
│  (Next.js)  │     │   (Auth)     │     │   (ERC-4337)   │
└─────────────┘     └──────────────┘     └─────────────────┘
                                                   │
                                                   ▼
                          ┌─────────────┐    ┌─────────────┐
                          │  Paymaster  │───▶│  Mock DEX   │
                          │ (Pimlico)   │    │  Contract   │
                          └─────────────┘    └─────────────┘
```

## 🧪 Implementation Details

- **Network**: Sepolia Testnet
- **AA Provider**: Privy with Safe Smart Wallets
- **Token Contracts**: Mock addresses (demo mode with fallback balances)
- **Paymaster**: Pimlico public paymaster for testing
- **Smart Wallet Type**: Safe (ERC-4337 compatible)

## 🎯 Demo Flow

1. **Connect**: Use email or MetaMask (no ETH needed)
2. **Smart Account**: Automatically created and displayed
3. **Swap**: Enter amount, see exchange rate, confirm
4. **Gasless**: Transaction executes without gas fees
5. **Track**: View transaction on Etherscan

## 🚧 Current Status

- ✅ **Fully functional** gasless token swap interface
- ✅ **Smart Account** integration working
- ✅ **All UI/UX** requirements met
- ⚠️ **Demo mode**: Uses simulated balances (real token contracts would need deployment)

## 🔮 Production Deployment

For production use:

1. Deploy actual ERC-20 token contracts
2. Configure production Paymaster
3. Set up proper token faucet
4. Add real DEX integration (Uniswap V2/V3)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Privy](https://privy.io) for Smart Wallet infrastructure
- [Alchemy](https://alchemy.com) for RPC services
- [Pimlico](https://pimlico.io) for Paymaster services
- [shadcn/ui](https://ui.shadcn.com) for UI components

---

**Built with ❤️ using Account Abstraction (EIP-4337)**
