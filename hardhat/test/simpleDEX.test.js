// test/simpleDEX.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

// Usa `parseUnits` para manejar más fácilmente los decimales de los tokens
const { parseUnits } = ethers;

describe("SimpleDEXOptimized", function () {
  // Fixture para desplegar los contratos y establecer un estado inicial limpio para cada prueba
  async function deployContractsFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    // Desplegar Mock Tokens
    const MockPepeFactory = await ethers.getContractFactory("MockPepe");
    const pepeToken = await MockPepeFactory.deploy();
    await pepeToken.waitForDeployment();

    const MockUSDCFactory = await ethers.getContractFactory("MockUSDC");
    const usdcToken = await MockUSDCFactory.deploy();
    await usdcToken.waitForDeployment();

    // Desplegar el DEX
    const SimpleDEXFactory = await ethers.getContractFactory(
      "SimpleDEXOptimized"
    );
    const dex = await SimpleDEXFactory.deploy(
      await pepeToken.getAddress(),
      await usdcToken.getAddress()
    );
    await dex.waitForDeployment();

    // Distribuir tokens a los usuarios para las pruebas
    // El 'owner' ya tiene tokens de la acuñación inicial
    // Usamos la faucet para 'user1' que da 10,000 PEPE y 1,000 USDC
    await pepeToken.connect(user1).faucet();
    await usdcToken.connect(user1).faucet();

    return { dex, pepeToken, usdcToken, owner, user1, user2 };
  }

  // Fixture que añade liquidez, disponible para todos los tests
  async function deployAndAddLiquidityFixture() {
    const { dex, pepeToken, usdcToken, owner, user1 } = await loadFixture(
      deployContractsFixture
    );
    const pepeLiquidity = parseUnits("5000000", 18); // 5M PEPE
    const usdcLiquidity = parseUnits("25", 6); // 25 USDC

    await pepeToken
      .connect(owner)
      .approve(await dex.getAddress(), pepeLiquidity);
    await usdcToken
      .connect(owner)
      .approve(await dex.getAddress(), usdcLiquidity);
    await dex.connect(owner).addLiquidity(pepeLiquidity, usdcLiquidity);

    return { dex, pepeToken, usdcToken, owner, user1 };
  }

  describe("Deployment", function () {
    it("Should set the right token addresses", async function () {
      const { dex, pepeToken, usdcToken } = await loadFixture(
        deployContractsFixture
      );
      expect(await dex.pepeToken()).to.equal(await pepeToken.getAddress());
      expect(await dex.usdcToken()).to.equal(await usdcToken.getAddress());
    });

    it("Should set the right owner", async function () {
      const { dex, owner } = await loadFixture(deployContractsFixture);
      expect(await dex.owner()).to.equal(owner.address);
    });
  });

  describe("Liquidity Addition", function () {
    it("Should allow the owner to add liquidity", async function () {
      const { dex, pepeToken, usdcToken, owner } = await loadFixture(
        deployContractsFixture
      );
      const pepeAmount = parseUnits("1000000", 18); // 1M PEPE
      const usdcAmount = parseUnits("500", 6); // 500 USDC

      await pepeToken
        .connect(owner)
        .approve(await dex.getAddress(), pepeAmount);
      await usdcToken
        .connect(owner)
        .approve(await dex.getAddress(), usdcAmount);

      await expect(dex.connect(owner).addLiquidity(pepeAmount, usdcAmount))
        .to.emit(dex, "LiquidityAdded")
        .withArgs(pepeAmount, usdcAmount);

      const { pepeReserve, usdcReserve } = await dex.reserves();
      expect(pepeReserve).to.equal(pepeAmount);
      expect(usdcReserve).to.equal(usdcAmount);
    });

    it("Should revert if a non-owner tries to add liquidity", async function () {
      const { dex, user1 } = await loadFixture(deployContractsFixture);
      const pepeAmount = parseUnits("100", 18);
      const usdcAmount = parseUnits("1", 6);

      await expect(dex.connect(user1).addLiquidity(pepeAmount, usdcAmount))
        .to.be.revertedWithCustomError(dex, "OwnableUnauthorizedAccount")
        .withArgs(user1.address);
    });

    it("Should revert if adding zero liquidity", async function () {
      const { dex, owner } = await loadFixture(deployContractsFixture);

      await expect(
        dex.connect(owner).addLiquidity(100, 0)
      ).to.be.revertedWithCustomError(dex, "InsufficientAmount");

      await expect(
        dex.connect(owner).addLiquidity(0, 100)
      ).to.be.revertedWithCustomError(dex, "InsufficientAmount");
    });
  });

  describe("Token Swaps", function () {
    describe("swapPepeToUsdc", function () {
      it("Should swap PEPE for USDC correctly", async function () {
        const { dex, pepeToken, usdcToken, user1 } = await loadFixture(
          deployAndAddLiquidityFixture
        );
        // La faucet da 10,000 PEPE, usamos 5,000 para el swap.
        const pepeIn = parseUnits("5000", 18);

        await pepeToken.connect(user1).approve(await dex.getAddress(), pepeIn);

        const expectedUsdcOut = await dex.calculatePepeToUsdc(pepeIn);

        // Verificamos los balances de forma explícita antes y después
        const userUsdcBalanceBefore = await usdcToken.balanceOf(user1.address);
        const dexPepeBalanceBefore = await pepeToken.balanceOf(
          await dex.getAddress()
        );

        // Ejecutamos la transacción y verificamos el evento
        await expect(dex.connect(user1).swapPepeToUsdc(pepeIn))
          .to.emit(dex, "TokenSwapped")
          .withArgs(
            user1.address,
            await pepeToken.getAddress(),
            await usdcToken.getAddress(),
            pepeIn,
            expectedUsdcOut
          );

        // Comprobamos los balances después
        const userUsdcBalanceAfter = await usdcToken.balanceOf(user1.address);
        const dexPepeBalanceAfter = await pepeToken.balanceOf(
          await dex.getAddress()
        );

        expect(userUsdcBalanceAfter - userUsdcBalanceBefore).to.equal(
          expectedUsdcOut
        );
        expect(dexPepeBalanceAfter - dexPepeBalanceBefore).to.equal(pepeIn);
      });

      it("Should revert with InsufficientLiquidity if DEX doesn't have enough USDC", async function () {
        const { dex, pepeToken, user1 } = await loadFixture(
          deployAndAddLiquidityFixture
        );
        const massivePepeIn = parseUnits("6000000", 18);

        await pepeToken
          .connect(user1)
          .approve(await dex.getAddress(), massivePepeIn);

        await expect(
          dex.connect(user1).swapPepeToUsdc(massivePepeIn)
        ).to.be.revertedWithCustomError(dex, "InsufficientLiquidity");
      });

      it("Should revert with InsufficientAmount for zero input", async function () {
        const { dex, user1 } = await loadFixture(deployAndAddLiquidityFixture);
        await expect(
          dex.connect(user1).swapPepeToUsdc(0)
        ).to.be.revertedWithCustomError(dex, "InsufficientAmount");
      });
    });

    describe("swapUsdcToPepe", function () {
      it("Should swap USDC for PEPE correctly", async function () {
        const { dex, pepeToken, usdcToken, user1 } = await loadFixture(
          deployAndAddLiquidityFixture
        );
        const usdcIn = parseUnits("10", 6);

        await usdcToken.connect(user1).approve(await dex.getAddress(), usdcIn);

        const expectedPepeOut = await dex.calculateUsdcToPepe(usdcIn);

        // Verificamos los balances de forma explícita antes y después
        const userPepeBalanceBefore = await pepeToken.balanceOf(user1.address);
        const dexUsdcBalanceBefore = await usdcToken.balanceOf(
          await dex.getAddress()
        );

        // Ejecutamos la transacción y verificamos el evento
        await expect(dex.connect(user1).swapUsdcToPepe(usdcIn))
          .to.emit(dex, "TokenSwapped")
          .withArgs(
            user1.address,
            await usdcToken.getAddress(),
            await pepeToken.getAddress(),
            usdcIn,
            expectedPepeOut
          );

        // Comprobamos los balances después
        const userPepeBalanceAfter = await pepeToken.balanceOf(user1.address);
        const dexUsdcBalanceAfter = await usdcToken.balanceOf(
          await dex.getAddress()
        );

        expect(userPepeBalanceAfter - userPepeBalanceBefore).to.equal(
          expectedPepeOut
        );
        expect(dexUsdcBalanceAfter - dexUsdcBalanceBefore).to.equal(usdcIn);
      });

      it("Should revert with InsufficientLiquidity if DEX doesn't have enough PEPE", async function () {
        const { dex, usdcToken, user1 } = await loadFixture(
          deployAndAddLiquidityFixture
        );
        const massiveUsdcIn = parseUnits("30", 6);

        await usdcToken
          .connect(user1)
          .approve(await dex.getAddress(), massiveUsdcIn);

        await expect(
          dex.connect(user1).swapUsdcToPepe(massiveUsdcIn)
        ).to.be.revertedWithCustomError(dex, "InsufficientLiquidity");
      });
    });
  });

  describe("View Functions", function () {
    it("getReserves should return the correct reserve amounts", async function () {
      const { dex, pepeToken, usdcToken, owner } = await loadFixture(
        deployAndAddLiquidityFixture
      );
      const [_pepeReserve, _usdcReserve] = await dex.getReserves();
      expect(_pepeReserve).to.equal(parseUnits("5000000", 18));
      expect(_usdcReserve).to.equal(parseUnits("25", 6));
    });

    it("getExchangeRate should return the correct constants", async function () {
      const { dex } = await loadFixture(deployContractsFixture);
      const [rate, denominator] = await dex.getExchangeRate();
      expect(rate).to.equal(5);
      expect(denominator).to.equal(1000000);
    });
  });

  describe("Owner Functions", function () {
    it("emergencyWithdraw should withdraw all tokens to the owner", async function () {
      const { dex, pepeToken, usdcToken, owner } = await loadFixture(
        deployAndAddLiquidityFixture
      );

      const dexPepeBalanceBefore = await pepeToken.balanceOf(
        await dex.getAddress()
      );
      const dexUsdcBalanceBefore = await usdcToken.balanceOf(
        await dex.getAddress()
      );

      expect(dexPepeBalanceBefore).to.be.gt(0);
      expect(dexUsdcBalanceBefore).to.be.gt(0);

      await dex.connect(owner).emergencyWithdraw();

      expect(await pepeToken.balanceOf(await dex.getAddress())).to.equal(0);
      expect(await usdcToken.balanceOf(await dex.getAddress())).to.equal(0);

      // Verificamos que los balances del owner han incrementado
      expect(await pepeToken.balanceOf(owner.address)).to.be.gt(0);
      expect(await usdcToken.balanceOf(owner.address)).to.be.gt(0);

      const { pepeReserve, usdcReserve } = await dex.reserves();
      expect(pepeReserve).to.equal(0);
      expect(usdcReserve).to.equal(0);
    });

    it("emergencyWithdraw should revert if called by non-owner", async function () {
      const { dex, user1 } = await loadFixture(deployAndAddLiquidityFixture);
      await expect(dex.connect(user1).emergencyWithdraw())
        .to.be.revertedWithCustomError(dex, "OwnableUnauthorizedAccount")
        .withArgs(user1.address);
    });
  });
});
