// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleDEX is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable pepeToken;
    IERC20 public immutable usdcToken;
    
    uint256 public pepeReserve;
    uint256 public usdcReserve;
    
    // Exchange rate: 1 PEPE = 0.000005 USDC
    uint256 public constant EXCHANGE_RATE = 5; // 5 USDC per 1,000,000 PEPE
    uint256 public constant RATE_DENOMINATOR = 1000000;
    
    event LiquidityAdded(uint256 pepeAmount, uint256 usdcAmount);
    event TokenSwapped(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );
    
    constructor(address _pepeToken, address _usdcToken) Ownable(msg.sender) {
        require(_pepeToken != address(0), "Invalid PEPE token address");
        require(_usdcToken != address(0), "Invalid USDC token address");
        
        pepeToken = IERC20(_pepeToken);
        usdcToken = IERC20(_usdcToken);
    }
    
    function addLiquidity(uint256 _pepeAmount, uint256 _usdcAmount) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(_pepeAmount > 0 && _usdcAmount > 0, "Invalid amounts");
        
        pepeToken.safeTransferFrom(msg.sender, address(this), _pepeAmount);
        usdcToken.safeTransferFrom(msg.sender, address(this), _usdcAmount);
        
        pepeReserve += _pepeAmount;
        usdcReserve += _usdcAmount;
        
        emit LiquidityAdded(_pepeAmount, _usdcAmount);
    }
    
    function swapPepeToUsdc(uint256 _pepeAmount) 
        external 
        nonReentrant 
    {
        require(_pepeAmount > 0, "Invalid PEPE amount");
        
        uint256 usdcAmount = calculatePepeToUsdc(_pepeAmount);
        require(usdcAmount > 0, "Invalid swap amount");
        require(usdcReserve >= usdcAmount, "Insufficient USDC liquidity");
        
        pepeToken.safeTransferFrom(msg.sender, address(this), _pepeAmount);
        usdcToken.safeTransfer(msg.sender, usdcAmount);
        
        pepeReserve += _pepeAmount;
        usdcReserve -= usdcAmount;
        
        emit TokenSwapped(
            msg.sender,
            address(pepeToken),
            address(usdcToken),
            _pepeAmount,
            usdcAmount
        );
    }
    
    function swapUsdcToPepe(uint256 _usdcAmount) 
        external 
        nonReentrant 
    {
        require(_usdcAmount > 0, "Invalid USDC amount");
        
        uint256 pepeAmount = calculateUsdcToPepe(_usdcAmount);
        require(pepeAmount > 0, "Invalid swap amount");
        require(pepeReserve >= pepeAmount, "Insufficient PEPE liquidity");
        
        usdcToken.safeTransferFrom(msg.sender, address(this), _usdcAmount);
        pepeToken.safeTransfer(msg.sender, pepeAmount);
        
        usdcReserve += _usdcAmount;
        pepeReserve -= pepeAmount;
        
        emit TokenSwapped(
            msg.sender,
            address(usdcToken),
            address(pepeToken),
            _usdcAmount,
            pepeAmount
        );
    }
    
    function calculatePepeToUsdc(uint256 _pepeAmount) 
        public 
        pure 
        returns (uint256) 
    {
        // 1 PEPE = 0.000005 USDC
        // USDC has 6 decimals, PEPE has 18 decimals
        return (_pepeAmount * EXCHANGE_RATE) / (RATE_DENOMINATOR * 1e12);
    }
    
    function calculateUsdcToPepe(uint256 _usdcAmount) 
        public 
        pure 
        returns (uint256) 
    {
        // 1 USDC = 200,000 PEPE
        return (_usdcAmount * RATE_DENOMINATOR * 1e12) / EXCHANGE_RATE;
    }
    
    function getReserves() 
        external 
        view 
        returns (uint256 _pepeReserve, uint256 _usdcReserve) 
    {
        return (pepeReserve, usdcReserve);
    }
    
    function getExchangeRate() 
        external 
        pure 
        returns (uint256 rate, uint256 denominator) 
    {
        return (EXCHANGE_RATE, RATE_DENOMINATOR);
    }
}