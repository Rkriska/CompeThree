// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {CodeArenaRewards} from "../src/CodeArenaRewards.sol";

contract DeployCodeArena is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Alamat USDC resmi di Celo Mainnet
        address usdcCeloMainnet = 0xcebA9300f2b948710d2653dD7B07f33A8B32118C;
        
        // Sementara pakai address random dulu, nanti bisa diganti wallet backend asli
        address judgeSignerAddress = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; 

        vm.startBroadcast(deployerPrivateKey);

        new CodeArenaRewards(usdcCeloMainnet, judgeSignerAddress);

        vm.stopBroadcast();
    }
}
