// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CodeArenaRewardsV2 is EIP712, Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    IERC20 public immutable usdc;
    address public judgeSigner;

    mapping(address => mapping(string => bool)) public claimed;
    mapping(address => uint256) public totalEarnings;

    bytes32 private constant REWARD_TYPEHASH = keccak256(
        "Reward(address solver,string problemId,uint256 amount)"
    );

    event RewardClaimed(address indexed solver, string problemId, uint256 amount);
    event JudgeSignerUpdated(address indexed oldSigner, address indexed newSigner);

    constructor(address _usdc, address _signer) 
        EIP712("CodeArena", "2") 
        Ownable(msg.sender) 
    {
        require(_usdc != address(0), "Invalid token address");
        require(_signer != address(0), "Invalid signer address");
        usdc = IERC20(_usdc);
        judgeSigner = _signer;
    }

    function claimReward(
        string calldata problemId, 
        uint256 amount, 
        bytes calldata signature
    ) external whenNotPaused nonReentrant {
        require(!claimed[msg.sender][problemId], "Already claimed");

        bytes32 hash = _hashTypedDataV4(keccak256(abi.encode(
            REWARD_TYPEHASH,
            msg.sender,
            keccak256(bytes(problemId)),
            amount
        )));

        require(hash.recover(signature) == judgeSigner, "Invalid signature");

        claimed[msg.sender][problemId] = true;
        totalEarnings[msg.sender] += amount;

        usdc.safeTransfer(msg.sender, amount);

        emit RewardClaimed(msg.sender, problemId, amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setJudgeSigner(address _newSigner) external onlyOwner {
        require(_newSigner != address(0), "Invalid signer address");
        address oldSigner = judgeSigner;
        judgeSigner = _newSigner;
        emit JudgeSignerUpdated(oldSigner, _newSigner);
    }

    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(token != address(0), "Invalid token address");
        IERC20(token).safeTransfer(owner(), amount);
    }
}
