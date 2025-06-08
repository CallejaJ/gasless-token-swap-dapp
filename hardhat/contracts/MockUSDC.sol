// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDC is ERC20, Ownable {
    uint256 public constant FAUCET_AMOUNT = 1000 * 10**6; // 1,000 USDC
    uint256 public constant FAUCET_COOLDOWN = 24 hours;
    
    mapping(address => uint256) public lastFaucetTime;
    
    event FaucetUsed(address indexed user, uint256 amount);
    
    constructor() ERC20("Mock USD Coin", "USDC") Ownable(msg.sender) {
        // Mint initial supply to deployer for liquidity  
        _mint(msg.sender, 100000 * 10**6); // 100K USDC
    }
    
    function decimals() public pure override returns (uint8) {
        return 6; // USDC has 6 decimals
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function faucet() external {
        require(
            block.timestamp >= lastFaucetTime[msg.sender] + FAUCET_COOLDOWN,
            "Faucet cooldown active"
        );
        
        lastFaucetTime[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
        
        emit FaucetUsed(msg.sender, FAUCET_AMOUNT);
    }
    
    function getFaucetCooldown(address user) external view returns (uint256) {
        uint256 nextAvailable = lastFaucetTime[user] + FAUCET_COOLDOWN;
        if (block.timestamp >= nextAvailable) {
            return 0;
        }
        return nextAvailable - block.timestamp;
    }
}