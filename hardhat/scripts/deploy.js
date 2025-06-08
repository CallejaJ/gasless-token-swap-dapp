const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment on Sepolia...");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log(
    "💰 Account balance:",
    ethers.formatEther(await deployer.provider.getBalance(deployer.address)),
    "ETH"
  );

  // 1. Deploy PEPE Token
  console.log("\n📦 Deploying MockPepe...");
  const MockPepe = await ethers.getContractFactory("MockPepe");
  const pepeToken = await MockPepe.deploy();
  await pepeToken.waitForDeployment();
  const pepeAddress = await pepeToken.getAddress();
  console.log("✅ MockPepe deployed to:", pepeAddress);

  // 2. Deploy USDC Token
  console.log("\n📦 Deploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdcToken = await MockUSDC.deploy();
  await usdcToken.waitForDeployment();
  const usdcAddress = await usdcToken.getAddress();
  console.log("✅ MockUSDC deployed to:", usdcAddress);

  // 3. Deploy SimpleDEX
  console.log("\n📦 Deploying SimpleDEX...");
  const SimpleDEX = await ethers.getContractFactory("SimpleDEX");
  const dex = await SimpleDEX.deploy(pepeAddress, usdcAddress);
  await dex.waitForDeployment();
  const dexAddress = await dex.getAddress();
  console.log("✅ SimpleDEX deployed to:", dexAddress);

  // 4. Add initial liquidity to DEX
  console.log("\n💧 Adding initial liquidity...");

  // Mint tokens to deployer for liquidity
  const pepeAmount = ethers.parseUnits("1000000", 18); // 1M PEPE
  const usdcAmount = ethers.parseUnits("5000", 6); // 5K USDC

  await pepeToken.mint(deployer.address, pepeAmount);
  await usdcToken.mint(deployer.address, usdcAmount);
  console.log("💰 Minted tokens for liquidity");

  // Approve DEX to spend tokens
  await pepeToken.approve(dexAddress, pepeAmount);
  await usdcToken.approve(dexAddress, usdcAmount);
  console.log("✅ Approved DEX to spend tokens");

  // Add liquidity
  await dex.addLiquidity(pepeAmount, usdcAmount);
  console.log("🏊 Added liquidity to DEX");

  // 5. Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const [pepeReserve, usdcReserve] = await dex.getReserves();
  console.log("📊 DEX Reserves:");
  console.log("   PEPE:", ethers.formatUnits(pepeReserve, 18));
  console.log("   USDC:", ethers.formatUnits(usdcReserve, 6));

  // 6. Create summary for .env update
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=".repeat(60));
  console.log("\n📋 Contract Addresses:");
  console.log(`MockPepe (PEPE): ${pepeAddress}`);
  console.log(`MockUSDC (USDC): ${usdcAddress}`);
  console.log(`SimpleDEX:       ${dexAddress}`);

  console.log("\n🔧 Update your .env.local with:");
  console.log(`NEXT_PUBLIC_PEPE_TOKEN_ADDRESS=${pepeAddress}`);
  console.log(`NEXT_PUBLIC_USDC_TOKEN_ADDRESS=${usdcAddress}`);
  console.log(`NEXT_PUBLIC_DEX_CONTRACT_ADDRESS=${dexAddress}`);

  console.log("\n🌐 Etherscan Links:");
  console.log(`PEPE: https://sepolia.etherscan.io/address/${pepeAddress}`);
  console.log(`USDC: https://sepolia.etherscan.io/address/${usdcAddress}`);
  console.log(`DEX:  https://sepolia.etherscan.io/address/${dexAddress}`);

  console.log("\n💡 Next Steps:");
  console.log("1. Update your .env.local with the contract addresses above");
  console.log("2. Update constants/tokens.ts with the new addresses");
  console.log("3. Users can call faucet() on both tokens to get test tokens");
  console.log("4. Test the real swaps in your app!");

  // Save addresses to a file for later use
  const fs = require("fs");
  const addresses = {
    pepeToken: pepeAddress,
    usdcToken: usdcAddress,
    simpleDEX: dexAddress,
    deployer: deployer.address,
    network: "sepolia",
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    "deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n📄 Contract addresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
