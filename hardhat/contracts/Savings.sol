pragma solidity ^0.8.17;

import "./ConvertibleMark.sol";

contract Savings {
    address payable public owner;
    ConvertibleMark private convertibleMarkContract;
    mapping(address => uint256) public savings;
    uint256 public interestRate;

    event Deposit(address indexed contractAddress, address indexed userAddress, uint256 depositAmount);
    event Withdraw(address indexed contractAddress, address indexed userAddress, uint256 withdrawAmount);
    event Interest(address indexed contractAddress, address indexed userAddress, uint256 interestAmount);

    constructor(address _convertibleMarkContract) public {
        owner = payable(msg.sender);
        convertibleMarkContract = ConvertibleMark(_convertibleMarkContract);
        convertibleMarkContract.mint(address(this), 200_000 * 10 ** 18);
        interestRate = 1;
    }

    function deposit(uint256 _amount) public {
        require(convertibleMarkContract.balanceOf(msg.sender) >= _amount, "Sender does not have enough funds");
        require(convertibleMarkContract.approve(msg.sender, address(this), _amount), "Failed to approve transfer");
        require(convertibleMarkContract.allowance(msg.sender, address(this)) >= _amount, "Savings contract not authorized to spend the specified amount");
        require(convertibleMarkContract.transferFrom(msg.sender, address(this), _amount), "Failed to transfer convertible marks");
        savings[msg.sender] += _amount;

        emit Deposit(address(this), msg.sender, _amount);
    }

    function withdraw(uint256 _amount) public {
        require(savings[msg.sender] >= _amount, "Insufficient funds");
        uint256 interest = (savings[msg.sender] * interestRate) / 100;
        savings[msg.sender] -= _amount;
        require(convertibleMarkContract.transfer(msg.sender, _amount + interest), "Failed to transfer convertible marks");

        emit Withdraw(address(this), msg.sender, _amount);
        emit Interest(address(this), msg.sender, interest);
    }

    function setInterestRate(uint256 _interestRate) public {
        require(msg.sender == owner, "Only owner can set interest rate");
        interestRate = _interestRate;
    }
}
