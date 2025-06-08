# 🚀 Hardhat Setup Guide

Complete guide to set up and deploy smart contracts for the Gasless Token Swap dApp.

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
```

## 5. Verify project structure

```
hardhat/
├── hardhat.config.js (or .ts)  ✅
├── contracts/                  ✅
│   ├── MockPepe.sol
│   ├── MockUSDC.sol
│   └── SimpleDEX.sol
├── scripts/                    ✅
│   └── deploy.js
├── package.json                ✅
├── .env                        ✅
└── node_modules/               ✅
```

## 6. Compile contracts

```bash
npx hardhat compile
```

## 7. Deploy to Sepolia testnet

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## 📋 Deployment Output

After successful deployment, you'll get:

```
🚀 Starting deployment on Sepolia...
📝 Deploying contracts with account: 0x1234...
💰 Account balance: 0.5 ETH

🪙 MockPepe deployed to: 0xABC123...
🪙 MockUSDC deployed to: 0xDEF456...
🏪 SimpleDEX deployed to: 0xGHI789...

✅ All contracts deployed successfully!
📝 Save these addresses in your .env file
```

## 8. Update your dApp

Copy the deployed contract addresses to your main app's `.env.local`:

```bash
# In your main app root/.env.local
NEXT_PUBLIC_PEPE_ADDRESS=0xABC123...
NEXT_PUBLIC_USDC_ADDRESS=0xDEF456...
NEXT_PUBLIC_DEX_ADDRESS=0xGHI789...
```

## 🚨 Common Issues

### Error: "Cannot find module hardhat"

**Solution**: Run `npm install` inside `hardhat/` directory

### Error: "Invalid private key"

**Solution**: Remove `0x` prefix from private key in `.env`

### Error: "Insufficient funds"

**Solution**: Get Sepolia ETH from [faucet](https://sepoliafaucet.com/)

### Error: "Network sepolia not found"

**Solution**: Verify `hardhat.config.js` has sepolia network configured

### Error: "Gas estimation failed"

**Solution**: Check contract syntax and increase gas limit

## ✅ Verification Commands

```bash
# Check Hardhat version
npx hardhat --version

# Compile contracts
npx hardhat compile

# Run local tests
npx hardhat test --network hardhat

# Check account balance
npx hardhat run scripts/check-balance.js --network sepolia
```

## 🎯 Next Steps

1. **Deploy contracts** following this guide
2. **Update contract addresses** in your main app
3. **Test token swaps** with real contracts
4. **Add faucet functionality** to get test tokens
5. **Verify contracts** on Etherscan (optional)

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Sepolia Testnet Explorer](https://sepolia.etherscan.io/)
- [Alchemy Dashboard](https://dashboard.alchemy.com/)

## 🔧 Configuration Files

### TypeScript Config (optional)

If using TypeScript, rename `hardhat.config.js` to `hardhat.config.ts` and update package.json:

```json
{
  "scripts": {
    "compile": "hardhat compile",
    "deploy": "hardhat run scripts/deploy.ts --network sepolia",
    "test": "hardhat test"
  }
}
```

---

🎉 **Success!** Your smart contracts are now deployed and ready to power real gasless token swaps!
