// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {JointVentures} from "../src/JointVentures.sol";
import {Token} from "../src/Token.sol";

contract DeployScript is Script {
    JointVentures public jointVentures;
    Token public token;

    address public finance = vm.envAddress("FINANCE_ADDRESS");
    address public operator = vm.envAddress("OPERATOR_ADDRESS");

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // DEPLOYMENT
        jointVentures = new JointVentures();
        console.log("JointVentures contract deployed at:", address(jointVentures));

        token = new Token(msg.sender, address(jointVentures));
        console.log("Token contract deployed at:", address(token));

        // GRANT ROLE
        jointVentures.grantRole(jointVentures.FINANCE_ROLE(), finance);
        jointVentures.grantRole(jointVentures.OPERATOR_ROLE(), operator);

        vm.stopBroadcast();
    }
}
