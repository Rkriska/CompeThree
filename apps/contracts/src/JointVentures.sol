// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract JointVentures {
    address public owner;
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

    event FinanceSet(address newFinance);
    event Activate(bool activate);
    event TargetSet(uint256 newTargetTotal);
    event Registered(address indexed member, string name);
    event Deposited(address indexed member, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function setFinance(address _finance) external {
        require(msg.sender == owner, "Hanya owner yang dapat mengubah bendahara");
        finance = _finance;
        emit FinanceSet(_finance);
    }

    function activate(bool _activate) external {
        require(msg.sender == finance, "Hanya bendahara yang dapat mengaktifkan/menonaktifkan patungan");
        active = _activate;

        emit Activate(_activate);
    }

    function setTarget(uint256 _target) external {
        require(msg.sender == finance, "Hanya bendahara yang dapat mengubah target total");
        target = _target;

        emit TargetSet(_target);
    }

    function register(string calldata _name) external {
        members[msg.sender] = MemberData({name: _name, amount: 0, isMember: true});

        require(members[msg.sender].isMember, "Anggota sudah daftar");
        registeredMembers.push(msg.sender);
        emit Registered(msg.sender, _name);
    }

    function deposit(uint256 _amount) external {
        require(active, "Patungan tidak aktif");
        require(members[msg.sender].isMember, "Anggota belum daftar");

        members[msg.sender].amount += _amount;
        collected += _amount;

        emit Deposited(msg.sender, _amount);
    }
}
