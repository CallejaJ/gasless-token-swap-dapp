# 🚀 Hardhat Setup Guide

Complete guide to set up, deploy smart contracts, and mint tokens for the Gasless Token Swap dApp.

## Prerequisites

- Node.js 16+ installed
- Sepolia testnet ETH ([Get from faucet](https://sepoliafaucet.com/))
- Alchemy account with API key
- MetaMask wallet with exported private key

## 1. Navigate to hardhat folder

```bash
cd hardhat/
```

## 2. Initialize package.json

```bash
npm init -y
```

## 3. Install dependencies

```bash
# Hardhat and tooling
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# OpenZeppelin contracts and utilities
npm install @openzeppelin/contracts dotenv

# TypeScript support (optional)
npm install --save-dev typescript ts-node @types/node
```

## 4. Create environment file

Create `.env` file in `hardhat/` directory:

```bash
# hardhat/.env
ALCHEMY_API_KEY=your_alchemy_api_key
PRIVATE_KEY=your_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key_optional

# Smart Account to fund (optional - can be set later)
SMART_ACCOUNT_ADDRESS=0xYourSmartAccountAddress
```

## 5. Verify project structure

```
hardhat/
├── hardhat.config.js           ✅
├── contracts/                  ✅
│   ├── MockPepe.sol
│   ├── MockUSDC.sol
│   └── SimpleDEX.sol
├── scripts/                    ✅
│   ├── deploy.js
│   ├── deploy-and-mint.js
│   └── mint-tokens.js
├── package.json                ✅
├── .env                        ✅
└── node_modules/               ✅
```

## 6. Compile contracts

```bash
npx hardhat compile
```

## 7. Deploy and Setup Everything (Recommended)

### Option A: All-in-One Script 🎯

Deploy contracts, add liquidity, and mint tokens to a smart account in one command:

```bash
# First, update SMART_ACCOUNT_ADDRESS in your .env file
# Then run:
npx hardhat run scripts/deploy-and-mint.js --network sepolia
```

This script will:

1. Deploy MockPepe, MockUSDC, and SimpleDEX contracts
2. Add liquidity to the DEX (1M PEPE + 5 USDC)
3. Mint tokens to your smart account (50K PEPE + 250 USDC)
4. Display all contract addresses and transaction hashes

### Option B: Step-by-Step Deployment

If you prefer to deploy contracts separately:

```bash
# 1. Deploy contracts only
npx hardhat run scripts/deploy.js --network sepolia

# 2. Add liquidity to DEX
npx hardhat run scripts/add-liquidity.js --network sepolia

# 3. Mint tokens to smart account
npx hardhat run scripts/mint-tokens.js --network sepolia
```

## 📋 Deployment Output

After running `deploy-and-mint.js`, you'll see:

```
🚀 Starting deployment and setup on Sepolia...
👤 Deploying with account: 0x1234...
💰 Account balance: 0.5 ETH

📦 Deploying contracts...
   ✅ MockPepe deployed: 0xb61a8fbe8036478AD3206439Aa8ff4b2F7769782
   ✅ MockUSDC deployed: 0xdA063Ad8faDD7c41B55e33B530dBc3d376A143F0
   ✅ SimpleDEX deployed: 0x546582623c79EF1acdA5D872eD5d6689E37a3FAa

💧 Adding liquidity to DEX...
   ✅ Added 1000000 PEPE + 5 USDC
   Tx: 0x123...

🎁 Minting tokens to Smart Account...
📍 Target: 0xe7BA935750eCaf5D3d4AD96306Eb6820A15da013
   ✅ Minted 50000 PEPE - Tx: 0x456...
   ✅ Minted 250 USDC - Tx: 0x789...

📊 Final Smart Account Balances:
   PEPE: 50000
   USDC: 250

🎉 Setup complete! Your dApp is ready for gasless swaps!
```

## 8. Update your dApp

Copy the deployed contract addresses to your main app's `.env.local`:

```bash
# In your main app root/.env.local
NEXT_PUBLIC_PEPE_TOKEN_ADDRESS=0xb61a8fbe8036478AD3206439Aa8ff4b2F7769782
NEXT_PUBLIC_USDC_TOKEN_ADDRESS=0xdA063Ad8faDD7c41B55e33B530dBc3d376A143F0
NEXT_PUBLIC_DEX_CONTRACT_ADDRESS=0x546582623c79EF1acdA5D872eD5d6689E37a3FAa
```

## 📜 Available Scripts

### `deploy-and-mint.js` - Complete Setup (Recommended)

```javascript
// Deploys all contracts, adds liquidity, and mints tokens
// Perfect for fresh deployments
npx hardhat run scripts/deploy-and-mint.js --network sepolia
```

### `mint-tokens.js` - Mint to New Smart Accounts

```javascript
// Only mints tokens to a smart account
// Use when contracts are already deployed
npx hardhat run scripts/mint-tokens.js --network sepolia
```

### `add-liquidity.js` - Add DEX Liquidity

```javascript
// Adds more liquidity to existing DEX
npx hardhat run scripts/add-liquidity.js --network sepolia
```

## 🔧 Script Configuration

### Customize token amounts in scripts:

```javascript
// In deploy-and-mint.js or mint-tokens.js
const PEPE_AMOUNT = ethers.parseUnits("50000", 18); // 50K PEPE
const USDC_AMOUNT = ethers.parseUnits("250", 6); // 250 USDC

// DEX liquidity amounts
const DEX_PEPE = ethers.parseUnits("1000000", 18); // 1M PEPE
const DEX_USDC = ethers.parseUnits("5", 6); // 5 USDC
```

## 🚨 Common Issues

### Error: "Cannot find module hardhat"

**Solution**: Run `npm install` inside `hardhat/` directory

### Error: "Invalid private key"

**Solution**: Remove `0x` prefix from private key in `.env`

### Error: "Insufficient funds"

**Solution**: Get Sepolia ETH from [faucet](https://sepoliafaucet.com/)

### Error: "SMART_ACCOUNT_ADDRESS not set"

**Solution**: Update `.env` with your smart account address from the dApp

### Error: "Only owner can mint"

**Solution**: Ensure you're using the same private key that deployed the contracts

## ✅ Verification Commands

```bash
# Check Hardhat version
npx hardhat --version

# Compile contracts
npx hardhat compile

# Run local tests
npx hardhat test

# Check account balance
npx hardhat run scripts/check-balance.js --network sepolia

# Verify contracts on Etherscan
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## 🎯 Workflow Summary

1. **Initial Setup** (do once):

   ```bash
   npm install
   npx hardhat compile
   npx hardhat run scripts/deploy-and-mint.js --network sepolia
   ```

2. **Fund New Smart Accounts** (repeat as needed):

   ```bash
   # Update SMART_ACCOUNT_ADDRESS in .env
   npx hardhat run scripts/mint-tokens.js --network sepolia
   ```

3. **Add More DEX Liquidity** (if needed):
   ```bash
   npx hardhat run scripts/add-liquidity.js --network sepolia
   ```

## 📚 Contract Details

### MockPepe (PEPE)

- 18 decimals
- Mintable by owner
- Faucet function for users

### MockUSDC (USDC)

- 6 decimals (standard USDC)
- Mintable by owner
- Faucet function for users

### SimpleDEX

- Fixed exchange rate: 1 PEPE = 0.000005 USDC
- Owner can add liquidity
- Gasless swaps with ZeroDev

## 🔗 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Sepolia Testnet Explorer](https://sepolia.etherscan.io/)
- [Alchemy Dashboard](https://dashboard.alchemy.com/)
- [ZeroDev Documentation](https://docs.zerodev.app/)

---

🎉 **Success!** Your smart contracts are deployed, liquidity is added, and smart accounts are funded. Ready for gasless swaps!
