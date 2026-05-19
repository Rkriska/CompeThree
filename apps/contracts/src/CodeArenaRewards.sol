// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract CodeArenaRewards is EIP712 {
    using ECDSA for bytes32;
    using SafeERC20 for IERC20;

    IERC20 public usdc;
    address public judgeSigner; 
    
    mapping(address => mapping(string => bool)) public claimed;
    mapping(address => uint256) public totalEarnings;
    
    event RewardClaimed(address solver, string problemId, uint256 amount);

    constructor(address _usdc, address _signer) EIP712("CodeArena", "1") {
        usdc = IERC20(_usdc);
        judgeSigner = _signer;
    }

    function claimReward(
        string calldata problemId,
        uint256 amount,
        bytes calldata signature
    ) external {
        require(!claimed[msg.sender][problemId], "Already claimed");

        bytes32 hash = _hashTypedDataV4(keccak256(abi.encode(
            keccak256("Reward(address solver,string problemId,uint256 amount)"),
            msg.sender,
            keccak256(bytes(problemId)),
            amount
        )));
        
        require(hash.recover(signature) == judgeSigner, "Invalid signature");

        claimed[msg.sender][problemId] = true;
        totalEarnings[msg.sender] += amount;
        
        // Menggunakan safeTransfer untuk memastikan transaksi otomatis gagal jika USDC tidak cukup
        usdc.safeTransfer(msg.sender, amount);

        emit RewardClaimed(msg.sender, problemId, amount);
    }
}
