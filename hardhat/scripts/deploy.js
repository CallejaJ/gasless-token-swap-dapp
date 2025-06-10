const { ethers } = require("hardhat");

async function main() {
  // Obtenemos la cuenta desplegadora
  const [deployer] = await ethers.getSigners();

  console.log("🚀 Deploying contracts with initial tokens...");
  console.log(`📝 Deploying with account: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Deployer balance: ${ethers.formatEther(balance)} ETH`);

  // 1. Desplegar MockPepe
  console.log("\n📦 Deploying MockPepe...");
  const MockPepe = await ethers.getContractFactory("MockPepe");
  const mockPepe = await MockPepe.deploy();
  await mockPepe.waitForDeployment();
  console.log(`✅ MockPepe deployed to: ${await mockPepe.getAddress()}`);

  // 2. Desplegar MockUSDC
  console.log("\n📦 Deploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUsdc = await MockUSDC.deploy();
  await mockUsdc.waitForDeployment();
  console.log(`✅ MockUSDC deployed to: ${await mockUsdc.getAddress()}`);

  // 3. Desplegar SimpleDEXOptimized
  console.log("\n📦 Deploying SimpleDEXOptimized...");
  const SimpleDEXOptimized = await ethers.getContractFactory(
    "SimpleDEXOptimized"
  );
  const dex = await SimpleDEXOptimized.deploy(
    await mockPepe.getAddress(),
    await mockUsdc.getAddress()
  );
  await dex.waitForDeployment();
  console.log(`✅ SimpleDEXOptimized deployed to: ${await dex.getAddress()}`);

  // 4. Preparar liquidez inicial
  console.log("\n💧 Setting up liquidity...");

  // Cantidades a depositar (1M PEPE = 5 USDC según tu tasa de cambio)
  const pepeAmount = ethers.parseUnits("1000000", 18); // 1,000,000 PEPE (18 decimales)
  const usdcAmount = ethers.parseUnits("5", 6); // 5 USDC (6 decimales)

  // Verificar saldos del deployer
  console.log("\n🔍 Verifying deployer token balances...");
  const initialPepeBalance = await mockPepe.balanceOf(deployer.address);
  const initialUsdcBalance = await mockUsdc.balanceOf(deployer.address);

  console.log(`   PEPE balance: ${ethers.formatUnits(initialPepeBalance, 18)}`);
  console.log(`   USDC balance: ${ethers.formatUnits(initialUsdcBalance, 6)}`);

  if (initialPepeBalance < pepeAmount || initialUsdcBalance < usdcAmount) {
    throw new Error(
      "Deployer doesn't have enough tokens for initial liquidity"
    );
  }

  // Aprobar tokens para el DEX
  console.log("\n🔏 Approving tokens for DEX...");
  const approvePepeTx = await mockPepe.approve(
    await dex.getAddress(),
    pepeAmount
  );
  await approvePepeTx.wait();
  const approveUsdcTx = await mockUsdc.approve(
    await dex.getAddress(),
    usdcAmount
  );
  await approveUsdcTx.wait();

  console.log("✅ Tokens approved successfully");

  // Verificar allowances
  const pepeAllowance = await mockPepe.allowance(
    deployer.address,
    await dex.getAddress()
  );
  const usdcAllowance = await mockUsdc.allowance(
    deployer.address,
    await dex.getAddress()
  );

  console.log(`   PEPE allowance: ${ethers.formatUnits(pepeAllowance, 18)}`);
  console.log(`   USDC allowance: ${ethers.formatUnits(usdcAllowance, 6)}`);

  // Añadir liquidez al DEX
  console.log("\n💦 Adding liquidity to DEX...");
  try {
    const addLiquidityTx = await dex.addLiquidity(pepeAmount, usdcAmount);
    await addLiquidityTx.wait();
    console.log("✅ Liquidity added successfully!");
  } catch (error) {
    console.error("❌ Error adding liquidity:", error);
    throw error;
  }

  // Verificar reservas del DEX
  console.log("\n🔎 Checking DEX reserves...");
  const [pepeReserve, usdcReserve] = await dex.getReserves();
  console.log(`   PEPE reserve: ${ethers.formatUnits(pepeReserve, 18)}`);
  console.log(`   USDC reserve: ${ethers.formatUnits(usdcReserve, 6)}`);

  console.log("\n🎉 Deployment and setup completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
