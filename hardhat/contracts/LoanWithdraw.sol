pragma solidity ^0.8.17;

import "./ConvertibleMark.sol";
import "hardhat/console.sol";

contract LoanWithdraw {
    uint256 public ethTotalSupply;
    address payable public owner;
    ConvertibleMark private convertibleMarkContract;
    mapping(address => uint256) public loans;
    mapping(address => uint256) public collateral;
    uint256 public LTV;
    uint256 public interestRate;
    uint256 public maxLoan;

    event Lend(address indexed contractAddress, address indexed userAddress, uint256 loanAmount, uint256 collateralAmount);
    event Repay(address indexed contractAddress, address indexed userAddress, uint256 currentLoans, uint256 repayAmount);
    event Liquidate(address indexed contractAddress, address indexed owner, address indexed userAddress, uint256 currentLoans);

    constructor(address _convertibleMarkContract) public {
        owner = payable(msg.sender);
        convertibleMarkContract = ConvertibleMark(_convertibleMarkContract);
        convertibleMarkContract.mint(address(this), 200_000 * 10 ** 18);
        maxLoan = 1_000_000 * 10 ** 18;
        ethTotalSupply = 120_440_000;
        interestRate = 3;
        LTV = 80;
        // 80% as 80 * 10^18
    }

    function lend(uint256 _loanAmount) public payable {
        require(_loanAmount <= maxLoan, "Loan amount exceeds the maximum limit");
        require(convertEthsToConvertibleMarks(msg.value) * 100 >= LTV * _loanAmount * 10**18, "Collateral amount is insufficient");
        require(msg.sender.balance >= msg.value, "Sender does not have enough collateral to lend");

        uint256 balance = convertibleMarkContract.balanceOf(address(this));
        require(balance >= _loanAmount, "This contract does not have enough KM to lend");
        loans[msg.sender] += _loanAmount;
        collateral[msg.sender] += msg.value;
        convertibleMarkContract.transfer(msg.sender, _loanAmount);
        emit Lend(address(this), msg.sender, _loanAmount, msg.value);
    }

    function repay(uint256 _repaymentAmount) public returns (bool) {
        uint256 repaymentAmountWithInterestedRate = _repaymentAmount * (100 + interestRate) / 100;
        require(loans[msg.sender] >= _repaymentAmount, "Repayment amount exceeds loan amount");
        loans[msg.sender] -= _repaymentAmount;
        uint256 balance = convertibleMarkContract.balanceOf(msg.sender);
        require(balance >= repaymentAmountWithInterestedRate, "There is no enough money.");

        bool approvalSuccess = convertibleMarkContract.approve(msg.sender, address(this), repaymentAmountWithInterestedRate);
        require(approvalSuccess, "Approval failed");
        bool transferSuccess = convertibleMarkContract.transferFrom(msg.sender, address(this), repaymentAmountWithInterestedRate);
        require(transferSuccess, "Transfer failed");

        emit Repay(address(this), msg.sender, loans[msg.sender], _repaymentAmount);

        if (loans[msg.sender] > 0) {
            return false;
        }
        delete loans[msg.sender];
        bool sent = payable(msg.sender).send(collateral[msg.sender]);
        require(sent, 'Failed to send Ether');
        delete collateral[msg.sender];
        return true;
    }

    function liquidate(address payable _user) public onlyOwner {
        require(msg.sender == owner, "Only owner can liquidate");
        uint256 loan = loans[_user] * 10**18;
        uint256 liquidityThreshold = convertEthsToConvertibleMarks(collateral[_user]) * (100 - LTV) / 100;
        require(loan >= liquidityThreshold, "Loan amount is less than the liquidation threshold.");
        emit Liquidate(address(this), owner, _user, collateral[_user]);
        delete collateral[_user];
        delete loans[_user];
    }

    function setInterestRate(uint256 _interestRate) public onlyOwner {
        interestRate = _interestRate;
    }

    function setLTV(uint256 _LTV) public onlyOwner {
        require(_LTV < 100, 'LTV should be between 0 and 100');
        LTV = _LTV;
    }

    function setMaxLoan(uint256 _maxLoan) public onlyOwner {
        maxLoan = _maxLoan;
    }

    function setEthTotalSupply(uint256 _ethTotalSupply) public onlyOwner {
        ethTotalSupply = _ethTotalSupply;
    }

    // Converters
    function convertConvertibleMarksToEths(uint256 _amountInConvertibleMarks) public view returns (uint256) {
        uint256 totalSupply = convertibleMarkContract.totalSupply();
        return _amountInConvertibleMarks * totalSupply / ethTotalSupply;
    }

    function convertEthsToConvertibleMarks(uint256 _amountInEths) public view returns (uint256) {
        uint256 totalSupply = convertibleMarkContract.totalSupply();
        return (_amountInEths * ethTotalSupply * 10 ** 36) / totalSupply;
    }

    // modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }
}