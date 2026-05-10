// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IToken} from "./interfaces/IToken.sol";
import {AccessControl} from "@openzeppelin-contracts/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin-contracts/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

contract JointVentures is AccessControl, Pausable, ReentrancyGuard {
    
    bytes32 public constant FINANCE_ROLE = keccak256("FINANCE_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    address public finance;
    uint256 public target;
    uint256 public collected;
    bool public active;

    string public name;
    address[] public registeredMembers;

    mapping(address => uint256) public contribution;

    struct MemberData {
        string name;
        uint256 amount;
        bool isMember;
    }

    mapping(address => MemberData) public members;

    error OnlyFinance();
    error RegisteredMember();
    error NotActive();
    error NotRegisteredMember();

    event FinanceSet(address newFinance);
    event Activate(bool activate);
    event TargetSet(uint256 newTargetTotal);
    event Registered(address indexed member, string name);
    event Deposited(address indexed member, uint256 amount);

    constructor(
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setFinance(address _finance) external onlyRole(DEFAULT_ADMIN_ROLE) {
        finance = _finance;
        emit FinanceSet(_finance);
    }

    function activate(bool _activate) external onlyRole(OPERATOR_ROLE) {
        active = _activate;

        emit Activate(_activate);
    }

    function setTarget(uint256 _target) external onlyRole(FINANCE_ROLE) {
        target = _target;

        emit TargetSet(_target);
    }

    function register(string calldata _name) external nonReentrant whenNotPaused {
        if (members[msg.sender].isMember) revert RegisteredMember();

        members[msg.sender] = MemberData({name: _name, amount: 0, isMember: true});
        registeredMembers.push(msg.sender);

        emit Registered(msg.sender, _name);
    }

    function deposit(address _token, uint256 _amount) external nonReentrant whenNotPaused {
        require(active, NotActive());
        require(members[msg.sender].isMember, NotRegisteredMember());

        _deposit(_token, _amount);

        emit Deposited(msg.sender, _amount);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _deposit(address _token, uint256 _amount) internal {
        contribution[msg.sender] += _amount;
        collected += _amount;


        IToken(_token).mintByContract(msg.sender, _amount);
    }
}
