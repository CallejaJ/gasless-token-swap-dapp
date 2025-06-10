const { ethers } = require("hardhat");

async function main() {
  // ⚠️ CONFIGURACIÓN - Actualiza estos valores
  const SMART_ACCOUNT_ADDRESS = "0xfCa17024a5AD5e24d6C1c444D6B94b980AE00243";

  // Direcciones de los contratos desplegados
  const PEPE_ADDRESS = "0xb61a8fbe8036478AD3206439Aa8ff4b2F7769782";
  const USDC_ADDRESS = "0xdA063Ad8faDD7c41B55e33B530dBc3d376A143F0";

  // Cantidades a mintear
  const PEPE_AMOUNT = ethers.parseUnits("50000", 18); // 50,000 PEPE
  const USDC_AMOUNT = ethers.parseUnits("250", 6); // 250 USDC

  console.log("🎁 Minting tokens to Smart Account...");

  // Corregir checksum de la dirección
  const smartAccountAddress = ethers.getAddress(
    SMART_ACCOUNT_ADDRESS.toLowerCase()
  );
  console.log(`📍 Target Smart Account: ${smartAccountAddress}`);

  const [owner] = await ethers.getSigners();
  console.log(`👤 Using owner account: ${owner.address}`);

  // Conectar a los contratos
  const pepeToken = await ethers.getContractAt("MockPepe", PEPE_ADDRESS);
  const usdcToken = await ethers.getContractAt("MockUSDC", USDC_ADDRESS);

  console.log(`📦 PEPE Token: ${await pepeToken.getAddress()}`);
  console.log(`💵 USDC Token: ${await usdcToken.getAddress()}`);

  // Verificar que somos el owner
  const pepeOwner = await pepeToken.owner();
  const usdcOwner = await usdcToken.owner();

  if (pepeOwner !== owner.address || usdcOwner !== owner.address) {
    throw new Error("❌ Current account is not the owner of the tokens!");
  }

  // Verificar balances antes
  console.log("\n📊 Balances before minting:");
  const pepeBefore = await pepeToken.balanceOf(smartAccountAddress);
  const usdcBefore = await usdcToken.balanceOf(smartAccountAddress);
  console.log(`   PEPE: ${ethers.formatUnits(pepeBefore, 18)}`);
  console.log(`   USDC: ${ethers.formatUnits(usdcBefore, 6)}`);

  // Mintear PEPE
  console.log("\n🪙 Minting PEPE...");
  const pepeTx = await pepeToken.mint(smartAccountAddress, PEPE_AMOUNT);
  await pepeTx.wait();
  console.log(`✅ Minted ${ethers.formatUnits(PEPE_AMOUNT, 18)} PEPE`);
  console.log(`   Tx hash: ${pepeTx.hash}`);

  // Mintear USDC
  console.log("\n💵 Minting USDC...");
  const usdcTx = await usdcToken.mint(smartAccountAddress, USDC_AMOUNT);
  await usdcTx.wait();
  console.log(`✅ Minted ${ethers.formatUnits(USDC_AMOUNT, 6)} USDC`);
  console.log(`   Tx hash: ${usdcTx.hash}`);

  // Verificar balances después
  console.log("\n📊 Balances after minting:");
  const pepeAfter = await pepeToken.balanceOf(smartAccountAddress);
  const usdcAfter = await usdcToken.balanceOf(smartAccountAddress);
  console.log(`   PEPE: ${ethers.formatUnits(pepeAfter, 18)}`);
  console.log(`   USDC: ${ethers.formatUnits(usdcAfter, 6)}`);

  console.log("\n🎉 Tokens minted successfully!");
  console.log("🔗 View on Etherscan:");
  console.log(`   https://sepolia.etherscan.io/address/${smartAccountAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
