// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {CodeArenaRewardsV2} from "src/CodeArenaRewardsV2.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {}
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract CodeArenaRewardsV2Test is Test {
    CodeArenaRewardsV2 public rewardContract;
    MockUSDC public usdc;

    uint256 public judgePrivateKey = 0xA1B2C3D4;
    address public judgeSigner;
    address public solver = address(0x1234);

    // Variabel untuk menyimpan Domain Separator
    bytes32 public domainSeparator;

    function setUp() public {
        judgeSigner = vm.addr(judgePrivateKey);
        usdc = new MockUSDC();
        rewardContract = new CodeArenaRewardsV2(address(usdc), judgeSigner);
        usdc.mint(address(rewardContract), 1000 * 10**6);

        // Menghitung DOMAIN_SEPARATOR secara manual untuk OpenZeppelin v5
        domainSeparator = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("CodeArena")),
                keccak256(bytes("2")),
                block.chainid,
                address(rewardContract)
            )
        );
    }

    function generateSignature(address _solver, string memory _problemId, uint256 _amount) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(abi.encode(
            keccak256("Reward(address solver,string problemId,uint256 amount)"),
            _solver,
            keccak256(bytes(_problemId)),
            _amount
        ));
        
        // Menggunakan domainSeparator yang dihitung manual di setUp()
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(judgePrivateKey, digest);
        return abi.encodePacked(r, s, v);
    }

    function test_SuccessfulClaim() public {
        string memory problemId = "soal-easy-01";
        uint256 rewardAmount = 10 * 10**6;

        bytes memory signature = generateSignature(solver, problemId, rewardAmount);

        vm.prank(solver);
        rewardContract.claimReward(problemId, rewardAmount, signature);

        assertEq(usdc.balanceOf(solver), rewardAmount);
        assertTrue(rewardContract.claimed(solver, problemId));
    }

    function test_FailInvalidSignature() public {
        string memory problemId = "soal-medium-02";
        uint256 rewardAmount = 50 * 10**6;

        uint256 fakeKey = 0x999999;
        bytes32 structHash = keccak256(abi.encode(
            keccak256("Reward(address solver,string problemId,uint256 amount)"),
            solver,
            keccak256(bytes(problemId)),
            rewardAmount
        ));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(fakeKey, digest);
        bytes memory fakeSignature = abi.encodePacked(r, s, v);

        vm.prank(solver);
        vm.expectRevert("Invalid signature");
        rewardContract.claimReward(problemId, rewardAmount, fakeSignature);
    }

    function test_FailDoubleClaim() public {
        string memory problemId = "soal-hard-03";
        uint256 rewardAmount = 100 * 10**6;
        bytes memory signature = generateSignature(solver, problemId, rewardAmount);

        vm.prank(solver);
        rewardContract.claimReward(problemId, rewardAmount, signature);

        vm.prank(solver);
        vm.expectRevert("Already claimed");
        rewardContract.claimReward(problemId, rewardAmount, signature);
    }

    function test_PauseMechanism() public {
        string memory problemId = "soal-super-hard";
        uint256 rewardAmount = 200 * 10**6;
        bytes memory signature = generateSignature(solver, problemId, rewardAmount);

        rewardContract.pause();

        vm.prank(solver);
        vm.expectRevert(abi.encodeWithSignature("EnforcedPause()"));
        rewardContract.claimReward(problemId, rewardAmount, signature);
    }
}
