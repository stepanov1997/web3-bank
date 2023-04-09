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
//    uint256 public interestRate;
    uint256 public maxLoan;

    constructor(address _convertibleMarkContract) public {
        owner = payable(msg.sender);
        convertibleMarkContract = ConvertibleMark(_convertibleMarkContract);
        convertibleMarkContract.mint(address(this), 200_000);
        maxLoan = 1_000_000;
        ethTotalSupply = 120_440_000;
        LTV = 80; // 80% as 80 * 10^18
    }

    function lend(uint256 _loanAmount) public payable {
        uint256 _collateralAmount = msg.value;
        require(_loanAmount <= maxLoan, "Loan amount exceeds the maximum limit");
        require(loans[msg.sender] == 0, "User already has an existing loan");
        require(_collateralAmount >= convertConvertibleMarksToEths(_loanAmount) * LTV / (10**18), "Collateral amount is insufficient");
        require(msg.sender.balance >= _collateralAmount, "Sender does not have enough collateral to lend");

        uint256 balance = convertibleMarkContract.balanceOf(address(this));
        require(balance >= _loanAmount, "This contract does not have enough KM to lend");
        loans[msg.sender] = _loanAmount;
        collateral[msg.sender] = _collateralAmount;
        convertibleMarkContract.transferFrom(address(this), msg.sender, _loanAmount);

        payable(msg.sender).transfer(_collateralAmount);
    }

    function repay(uint256 _repaymentAmount) public {
        require(loans[msg.sender] >= _repaymentAmount, "Repayment amount exceeds loan amount");
        loans[msg.sender] -= _repaymentAmount;
        convertibleMarkContract.transferFrom(msg.sender, address(this), _repaymentAmount);
        if(loans[msg.sender] <= 0) {
            delete loans[msg.sender];
            address payable contractAddress = payable(address(this));
            contractAddress.transfer(collateral[msg.sender]);
            delete collateral[msg.sender];
        }
    }

    function liquidate(address payable _user) public onlyOwner {
        require(msg.sender == owner, "Only owner can liquidate");
        require(loans[_user] >= collateral[_user] * (10**18 - LTV) / (10**18), "Loan amount is less than the liquidation threshold");
        uint256 collateralReturn = (10**18 - LTV) * convertEthsToConvertibleMarks(collateral[_user]) / (10**18);
        delete collateral[_user];
        delete loans[_user];
        convertibleMarkContract.transferFrom(address(this), _user, collateralReturn);
    }

    // Setters
//    function setInterestRate(uint256 _interestRate) public onlyOwner {
//        interestRate = _interestRate;
//    }

    function setLTV(uint256 _LTV) public onlyOwner {
        require(_LTV < 10**18, 'LTV should be between 0 and 1');
        LTV = _LTV;
    }

    function setMaxLoan(uint256 _maxLoan) public onlyOwner {
        maxLoan = _maxLoan;
    }

    function setEthTotalSupply(uint256 _ethTotalSupply) public  onlyOwner{
        ethTotalSupply = _ethTotalSupply;
    }

    // Converters
    function convertConvertibleMarksToEths(uint256 _amountInConvertibleMarks) public view returns (uint256) {
        console.log("csd1=%s",_amountInConvertibleMarks);
        uint256 totalSupply = convertibleMarkContract.totalSupply();
        console.log("csd1:totalsupply=%s",totalSupply);
        console.log("csd1:converted=%s",_amountInConvertibleMarks*ethTotalSupply);
        console.log("csd1:ethTotalSupply=%s",ethTotalSupply);
        console.log("csd1:convertedAndDivided=%s",_amountInConvertibleMarks*ethTotalSupply/totalSupply);
        return _amountInConvertibleMarks * ethTotalSupply / totalSupply;
    }
    function convertEthsToConvertibleMarks(uint256 _amountInEths) public view returns (uint256) {
        console.log("csd2=%s",_amountInEths);
        uint256 totalSupply = convertibleMarkContract.totalSupply();
        console.log("csd2:totalsupply=%s",totalSupply);
        console.log("csd1:ethTotalSupply=%s",ethTotalSupply);
        console.log("csd2:converted=%s",_amountInEths * ethTotalSupply);
        console.log("csd2:convertedAndDivided=%s",_amountInEths * ethTotalSupply / totalSupply);
        return _amountInEths * ethTotalSupply / totalSupply;
    }

    // modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }
}