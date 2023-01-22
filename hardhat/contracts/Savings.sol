pragma solidity ^0.8.17;

contract Savings {
    address payable public owner;
    mapping(address => uint256) public savings;
    mapping(address => bool) public isActive;
    uint256 public interestRate;

    constructor() public {
        owner = payable(msg.sender);
    }

    function deposit(uint256 _amount) public {
        require(isActive[msg.sender], "Account is not active");
        require(msg.sender.balance >= _amount, "Sender does not have enough funds");
        savings[msg.sender] += _amount;
    }

    function withdraw(uint256 _amount) public {
        require(isActive[msg.sender], "Account is not active");
        require(savings[msg.sender] >= _amount, "Insufficient funds");
        savings[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function activate() public {
        require(msg.sender == owner, "Only owner can activate accounts");
        isActive[msg.sender] = true;
    }

    function deactivate() public {
        require(msg.sender == owner, "Only owner can deactivate accounts");
        isActive[msg.sender] = false;
    }

    function setInterestRate(uint256 _interestRate) public {
        require(msg.sender == owner, "Only owner can set interest rate");
        interestRate = _interestRate;
    }

    function earnInterest() public {
        require(isActive[msg.sender], "Account is not active");
        savings[msg.sender] += savings[msg.sender] * (interestRate / 100);
    }
}
