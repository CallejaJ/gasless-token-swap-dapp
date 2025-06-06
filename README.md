# Gasless Token Swap dApp

[![Live Demo](https://img.shields.io/badge/Demo-Live-green?style=for-the-badge)](https://gasless-token-swap.vercel.app)
[![Base Sepolia](https://img.shields.io/badge/Network-Base%20Sepolia-blue?style=for-the-badge)](https://sepolia.basescan.org)
[![Account Abstraction](https://img.shields.io/badge/EIP--4337-Account%20Abstraction-purple?style=for-the-badge)](https://eips.ethereum.org/EIPS/eip-4337)

## 🎯 Overview

A decentralized application (dApp) that enables users to **swap ERC-20 tokens without holding any ETH** by leveraging **Smart Accounts (EIP-4337)** and **sponsored gas payments**. Built on Base Sepolia testnet.

## ✨ Features

### 1. **Smart Account Creation**

- Automatic smart account deployment when users connect their wallet
- Support for MetaMask, Coinbase Wallet, and WalletConnect
- Email authentication option via Privy
- Display of both EOA and Smart Account addresses

### 2. **Gasless Token Swaps**

- Swap between PEPE ↔ USDC mock tokens
- No ETH required for transactions
- All gas fees sponsored by Paymaster
- Automatic token approval handling

### 3. **Account Abstraction (EIP-4337)**

- Smart accounts deployed using Abstract Global Wallet
- Bundled transactions (approve + swap)
- Sponsored gas via Paymaster integration
- Session keys for improved UX

### 4. **User Experience**

- Real-time transaction status updates
- Block explorer links for all transactions
- Mobile-responsive design
- Dark mode interface
- Clear indication of sponsored gas fees

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Web3**:
  - Privy (wallet connection & authentication)
  - Wagmi v2 (Ethereum interactions)
  - Viem (Ethereum library)
  - Abstract Global Wallet (smart accounts)
- **Network**: Base Sepolia testnet
- **Smart Contracts**: ERC-20 tokens, Uniswap V2 style DEX

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MetaMask or another Web3 wallet
- Base Sepolia testnet ETH (only for deploying contracts, not required for users)

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

# Abstract Global Wallet
NEXT_PUBLIC_AGW_PROJECT_ID=your_agw_project_id

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org
```

5. Run the development server:

```bash
npm run dev
```

## 📋 Functional Requirements

### ✅ Implemented Features

1. **Wallet Connection & Smart Account Creation**

   - [x] Auto-deploy smart account on wallet connection
   - [x] Display smart account address and balances
   - [x] Support multiple wallet providers

2. **Token Swap**

   - [x] Swap between PEPE ↔ USDC tokens
   - [x] Handle approve + swap in single transaction
   - [x] Real DEX integration on testnet

3. **Gasless Transactions**

   - [x] Users don't need ETH
   - [x] Sponsored Paymaster covers all gas
   - [x] UI shows "Gas sponsored by Smart Accounts"

4. **Transaction Feedback**

   - [x] Loading, success, and error states
   - [x] Block explorer links
   - [x] Transaction history

5. **UI/UX**
   - [x] Responsive mobile-first design
   - [x] Dark mode
   - [x] Intuitive swap interface

## 🏗 Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Frontend  │────▶│    Privy     │────▶│  Smart Account  │
│  (Next.js)  │     │   (Auth)     │     │   (EIP-4337)   │
└─────────────┘     └──────────────┘     └─────────────────┘
                                                   │
                                                   ▼
                          ┌─────────────┐    ┌─────────────┐
                          │  Paymaster  │───▶│     DEX     │
                          │  (Sponsor)  │    │  Contract   │
                          └─────────────┘    └─────────────┘
```

## 🧪 Testing

### Test Tokens

Get test tokens from our faucet (coming soon) or deploy your own:

- **PEPE**: `0x...` (Base Sepolia)
- **USDC**: `0x...` (Base Sepolia)

### Manual Testing

1. Connect wallet (no ETH needed)
2. Smart account auto-deploys
3. Enter swap amount
4. Confirm transaction
5. View on block explorer

## 🚢 Deployment

### Vercel Deployment

```bash
npm run build
vercel --prod
```

### Environment Variables (Production)

Set these in your Vercel dashboard:

- All variables from `.env.local`
- Ensure `NODE_ENV=production`

## 📝 Smart Contracts

Contracts are deployed on Base Sepolia:

- **Token Factory**: `0x...`
- **DEX Router**: `0x...`
- **Paymaster**: `0x...`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Privy](https://privy.io) for wallet authentication
- [Abstract](https://abs.xyz) for smart account infrastructure
- [Base](https://base.org) for the testnet
- [shadcn/ui](https://ui.shadcn.com) for UI components

## 📞 Support

- Create an issue for bug reports
- Join our [Discord](https://discord.gg/...) for discussions
- Follow us on [Twitter](https://twitter.com/...)

---

Built with ❤️ for the decentralized future
