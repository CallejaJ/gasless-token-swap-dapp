// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleDEXOptimized is ReentrancyGuard, Ownable {
    
    IERC20 public immutable pepeToken;
    IERC20 public immutable usdcToken;
    
    // Packed struct to save gas
    struct Reserves {
        uint128 pepeReserve;
        uint128 usdcReserve;
    }
    
    Reserves public reserves;
    
    // Constants for exchange rate calculation
    // 1 PEPE = 0.000005 USDC
    // This means 1,000,000 PEPE = 5 USDC
    uint256 private constant PEPE_PRECISION = 1e18;
    uint256 private constant USDC_PRECISION = 1e6;
    uint256 private constant EXCHANGE_RATE = 5; // 5 USDC per 1M PEPE
    uint256 private constant RATE_DENOMINATOR = 1000000; // 1M
    
    event LiquidityAdded(uint256 pepeAmount, uint256 usdcAmount);
    event TokenSwapped(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );
    
    error InsufficientAmount();
    error InsufficientLiquidity();
    error TransferFailed();
    
    constructor(address _pepeToken, address _usdcToken) Ownable(msg.sender) {
        pepeToken = IERC20(_pepeToken);
        usdcToken = IERC20(_usdcToken);
    }
    
    /// @notice Add liquidity to the pool (owner only)
    function addLiquidity(uint256 _pepeAmount, uint256 _usdcAmount) 
        external 
        onlyOwner 
        nonReentrant 
    {
        if (_pepeAmount == 0 || _usdcAmount == 0) revert InsufficientAmount();
        
        // Transfer tokens from owner
        if (!pepeToken.transferFrom(msg.sender, address(this), _pepeAmount)) {
            revert TransferFailed();
        }
        if (!usdcToken.transferFrom(msg.sender, address(this), _usdcAmount)) {
            revert TransferFailed();
        }
        
        // Update reserves
        reserves.pepeReserve += uint128(_pepeAmount);
        reserves.usdcReserve += uint128(_usdcAmount);
        
        emit LiquidityAdded(_pepeAmount, _usdcAmount);
    }
    
    /// @notice Swap PEPE for USDC with optimized gas usage
    function swapPepeToUsdc(uint256 _pepeAmount) 
        external 
        nonReentrant 
    {
        if (_pepeAmount == 0) revert InsufficientAmount();
        
        // Calculate USDC output using simple math (gas optimized)
        uint256 usdcAmount = (_pepeAmount * EXCHANGE_RATE * USDC_PRECISION) / 
                           (RATE_DENOMINATOR * PEPE_PRECISION);
        
        if (usdcAmount == 0) revert InsufficientAmount();
        if (reserves.usdcReserve < usdcAmount) revert InsufficientLiquidity();
        
        // Update reserves first (checks-effects-interactions pattern)
        reserves.pepeReserve += uint128(_pepeAmount);
        reserves.usdcReserve -= uint128(usdcAmount);
        
        // Execute transfers
        if (!pepeToken.transferFrom(msg.sender, address(this), _pepeAmount)) {
            revert TransferFailed();
        }
        if (!usdcToken.transfer(msg.sender, usdcAmount)) {
            revert TransferFailed();
        }
        
        emit TokenSwapped(msg.sender, address(pepeToken), address(usdcToken), _pepeAmount, usdcAmount);
    }
    
    /// @notice Swap USDC for PEPE
    function swapUsdcToPepe(uint256 _usdcAmount) 
        external 
        nonReentrant 
    {
        if (_usdcAmount == 0) revert InsufficientAmount();
        
        // Calculate PEPE output
        uint256 pepeAmount = (_usdcAmount * RATE_DENOMINATOR * PEPE_PRECISION) / 
                           (EXCHANGE_RATE * USDC_PRECISION);
        
        if (pepeAmount == 0) revert InsufficientAmount();
        if (reserves.pepeReserve < pepeAmount) revert InsufficientLiquidity();
        
        // Update reserves
        reserves.usdcReserve += uint128(_usdcAmount);
        reserves.pepeReserve -= uint128(pepeAmount);
        
        // Execute transfers
        if (!usdcToken.transferFrom(msg.sender, address(this), _usdcAmount)) {
            revert TransferFailed();
        }
        if (!pepeToken.transfer(msg.sender, pepeAmount)) {
            revert TransferFailed();
        }
        
        emit TokenSwapped(msg.sender, address(usdcToken), address(pepeToken), _usdcAmount, pepeAmount);
    }
    
    /// @notice Calculate PEPE to USDC conversion (view function, no gas cost)
    function calculatePepeToUsdc(uint256 _pepeAmount) 
        external 
        pure 
        returns (uint256) 
    {
        return (_pepeAmount * EXCHANGE_RATE * USDC_PRECISION) / 
               (RATE_DENOMINATOR * PEPE_PRECISION);
    }
    
    /// @notice Calculate USDC to PEPE conversion (view function, no gas cost)
    function calculateUsdcToPepe(uint256 _usdcAmount) 
        external 
        pure 
        returns (uint256) 
    {
        return (_usdcAmount * RATE_DENOMINATOR * PEPE_PRECISION) / 
               (EXCHANGE_RATE * USDC_PRECISION);
    }
    
    /// @notice Get current reserves
    function getReserves() 
        external 
        view 
        returns (uint256 _pepeReserve, uint256 _usdcReserve) 
    {
        return (reserves.pepeReserve, reserves.usdcReserve);
    }
    
    /// @notice Get exchange rate info
    function getExchangeRate() 
        external 
        pure 
        returns (uint256 rate, uint256 denominator) 
    {
        return (EXCHANGE_RATE, RATE_DENOMINATOR);
    }
    
    /// @notice Emergency withdraw (owner only)
    function emergencyWithdraw() external onlyOwner {
        uint256 pepeBalance = pepeToken.balanceOf(address(this));
        uint256 usdcBalance = usdcToken.balanceOf(address(this));
        
        if (pepeBalance > 0) {
            pepeToken.transfer(owner(), pepeBalance);
        }
        if (usdcBalance > 0) {
            usdcToken.transfer(owner(), usdcBalance);
        }
        
        // Reset reserves
        delete reserves;
    }
}