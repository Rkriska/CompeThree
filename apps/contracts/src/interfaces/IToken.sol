// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IToken {
    function mintByContract(address to, uint256 amount) external;
}