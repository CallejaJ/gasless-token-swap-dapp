# Gasless Token Swap dApp

This project demonstrates a gasless token swap application using Smart Accounts (Account Abstraction, EIP-4337) and a sponsored Paymaster.

## Features

- **Wallet Connection & Smart Account Creation**: Users are automatically assigned a smart account when connecting their wallet.
- **Token Swap**: Users can swap between two tokens (PEPE ↔ USDC mock).
- **Gasless Transactions**: Users don't need any ETH in their account as gas costs are covered by a sponsored Paymaster.
- **Transaction Feedback**: Shows loading, success, and error states with links to view transactions on a block explorer.
- **Polished UI/UX**: Responsive and mobile-first design.

## Tech Stack

- **Framework**: Next.js
- **Web3**: ethers.js
- **AA Provider**: Biconomy
- **Network**: Base Sepolia
- **Mock tokens**: PEPE (18 decimals), USDC (6 decimals)
- **UI**: Tailwind CSS, shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm 9.0.0 or later

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/gasless-token-swap.git
   cd gasless-token-swap
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env.local` file in the root directory and add your Biconomy API keys:
   \`\`\`
   NEXT_PUBLIC_BICONOMY_BUNDLER_URL=your_bundler_url
   NEXT_PUBLIC_BICONOMY_PAYMASTER_URL=your_paymaster_url
   \`\`\`

4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

1. **Smart Account Creation**: When a user connects their wallet, a smart account is created using Biconomy's SDK.
2. **Token Approval**: Before swapping, the user approves the smart contract to spend their tokens.
3. **Gasless Swap**: The swap transaction is sponsored by the Paymaster, so users don't need ETH.
4. **Transaction Confirmation**: Users receive feedback on their transaction status and can view it on the block explorer.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
