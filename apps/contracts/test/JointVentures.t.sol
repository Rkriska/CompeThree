// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {JointVentures} from "../src/JointVentures.sol";
import {Token} from "../src/Token.sol";
import {IERC20} from "@openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract JointVenturesTest is Test {
    JointVentures public jointVentures;
    Token public token;

    address public owner = address(0x1234);
    address public finance = address(0x123);
    address public member1 = address(0x1);

    function setUp() public {
        vm.startPrank(owner);
        jointVentures = new JointVentures();
        token = new Token(address(this), address(jointVentures));

        // Granting role
        jointVentures.grantRole(jointVentures.FINANCE_ROLE(), finance);
        jointVentures.grantRole(jointVentures.OPERATOR_ROLE(), finance);
        vm.stopPrank();
    }


    function testDeposit() public {
        vm.prank(owner);
        jointVentures.setFinance(finance);
        
        vm.prank(finance);
        jointVentures.activate(true);

        vm.prank(member1);
        jointVentures.register("test");

        vm.startPrank(member1);
        jointVentures.deposit(address(token), 100);
        uint256 amount = jointVentures.contribution(member1);
        vm.stopPrank();

        console.log("Member contribution:", amount);
        console.log("Member token balance:", token.balanceOf(member1));

        assertEq(amount, 100, "Member contribution should be 100");
        assertEq(token.balanceOf(member1), amount, "Token balance should be 100");
    }

    function test_setFinance() public {
        address newFinance = address(0x456);
        vm.prank(owner);
        jointVentures.setFinance(newFinance);
    }


    function test_depositWhenNotPaused() public {
        vm.prank(owner);
        jointVentures.setFinance(finance);
        
        vm.prank(finance);
        jointVentures.activate(true);

        vm.prank(member1);
        jointVentures.register("test");

        vm.prank(member1);
        jointVentures.deposit(address(token), 100);
    }

    function test_depositWhenPaused() public {
        vm.prank(owner);
        jointVentures.setFinance(finance);
        
        vm.prank(finance);
        jointVentures.activate(true);

        vm.prank(member1);
        jointVentures.register("test");

        vm.prank(owner);
        jointVentures.pause();

        vm.prank(member1);
        vm.expectRevert();
        jointVentures.deposit(address(token), 100);
    }
}