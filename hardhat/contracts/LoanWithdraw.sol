pragma solidity ^0.8.17;

import "./ConvertibleMark.sol";

contract LoanWithdraw {
    address payable public owner;
    ConvertibleMark private convertibleMarkContract;
    mapping(address => uint256) public loans;
    mapping(address => uint256) public collateral;
    mapping(address => PhysicalCollateral) public physicalCollateral;
    address[] public collateralManagers;
    uint256 public interestRate;
    uint256 public LTV;
    uint256 public ethTotalSupply;
    uint256 public maxLoan;

    struct PhysicalCollateral {
        bool isApproved;
        uint256 loanAmount;
        string description;
        bytes documentation;
        uint256 amount;
        string currency;
    }


    constructor(address _convertibleMarkContract) public {
        owner = payable(msg.sender);
        convertibleMarkContract = ConvertibleMark(_convertibleMarkContract);
        convertibleMarkContract.mint(address(this), 200_000);
        LTV = 0.8;
    }

    function addCollateralManager(address collateralManagerAddress) public onlyOwner {
        for (uint i = 0; i < collateralManagers.length; i++) {
            require(collateralManagers[i] != collateralManagerAddress, "Address already exists in the array");
        }
        collateralManagers.push(collateralManagerAddress);
    }

    function lend(uint256 _loanAmount, uint256 _collateralAmount) public {
        require(_loanAmount <= maxLoan, "Loan amount exceeds the maximum limit");
        require(loans[msg.sender] == 0, "User already has an existing loan");
        require(_collateralAmount >= convertConvertibleMarksToEths(_loanAmount) * LTV, "Collateral amount is insufficient");
        require(msg.sender.balance >= _collateralAmount, "Sender does not have enough collateral to lend");

        uint256 balance = convertibleMarkContract.balanceOf(address(this));
        require(balance >= _loanAmount, "This contract does not have enough KM to lend");
        loans[msg.sender] = _loanAmount;
        collateral[msg.sender] = _collateralAmount;
        convertConvertibleMarksToEths(_loanAmount);
        payable(msg.sender).transfer(_loanAmount);
    }

    function createRequestToLendWithPhysicalCollateral(uint256 _loanAmount, uint256 _collateralAmount, bytes _collateralDocumentation, string _collateralCurrency, string memory _physicalCollateralDescription) public {
        require(_loanAmount <= maxLoan, "Loan amount exceeds the maximum limit");
        require(loans[msg.sender] == 0, "User already has an existing loan");
        require(_collateralAmount > 0, "Physical collateral value must be greater than 0 for physical collateral");
        uint256 balanceInConvertibleMarks = convertibleMarkContract.balanceOf(address(this));
        require(balanceInConvertibleMarks >= _loanAmount, "This contract does not have enough KM to lend");
        physicalCollateral[msg.sender] = PhysicalCollateral(false, _loanAmount, _physicalCollateralDescription, _collateralDocumentation, _collateralAmount, _loanAmount);
    }

    function approvePhysicalCollateral(address _user) public onlyPhysicalCollateralManager {
        require(msg.sender == collateralManager[_user], "Only collateral manager can approve physical collateral");
        PhysicalCollateral physicalCollateral = physicalCollateral[_user];
        require(physicalCollateral.isApproved != true, "Collateral is already approved");
        physicalCollateral.isApproved = true;
        loans[msg.sender] = physicalCollateral.loanAmount;
        convertibleMarkContract.transfer(_user, _loanAmount);
    }

    // Funkcija repay omogućava korisniku da otplati deo ili celokupan kredit, proveravajući da li iznos otplate prelazi iznos kredita koji je korisnik duguje.
    function repay(uint256 _repaymentAmount) public {
        require(loans[msg.sender] >= _repaymentAmount, "Repayment amount exceeds loan amount");
        loans[msg.sender] -= _repaymentAmount;
        convertibleMarkContract.transferFrom(msg.sender, address(this), _repaymentAmount);
    }

    function liquidate(address payable _user) public onlyOwner {
        require(msg.sender == owner || msg.sender == collateralManager[_user], "Only owner or collateral manager can liquidate");
        if (physicalCollateral[_user].isApproved) {
            require(loans[_user] >= physicalCollateral[_user].loanAmount * (1 - LTV), "Loan amount is less than the liquidation threshold");
            require(bytes(physicalCollateral[_user]).length > 0, "Entry does not exist.");
            delete physicalCollateral[_user];
            delete loans[_user];
        } else {
            require(loans[_user] >= collateral[_user] * (1 - LTV), "Loan amount is less than the liquidation threshold");
            uint256 collateralReturn = convertEthsToConvertibleMarks(collateral[_user]) * (1 - LTV);
            delete collateral[_user];
            delete loans[_user];
            convertibleMarkContract.transferFrom(address(this), _user, collateralReturn);
        }
    }

    // Setters
    function setInterestRate(uint256 _interestRate) public onlyOwner {
        interestRate = _interestRate;
    }

    function setLTV(uint256 _LTV) public onlyOwner {
        LTV = _LTV;
    }

    function setMaxLoan(uint256 _maxLoan) public onlyOwner {
        maxLoan = _maxLoan;
    }

    function setEthTotalSupply(uint256 _ethTotalSupply) public  onlyOwner{
        ethTotalSupply = _ethTotalSupply;
    }

    // Converters
    function convertConvertibleMarksToEths(uint256 _amountInConvertibleMarks) private {
        uint256 totalSupply = convertibleMarkContract.totalSupply();
        return _amountInConvertibleMarks * totalSupply / ethTotalSupply;
    }
    function convertEthsToConvertibleMarks(uint256 _amountInEths) private {
        uint256 totalSupply = convertibleMarkContract.totalSupply();
        return _amountInEths * ethTotalSupply / totalSupply;
    }

    // modifiers
    modifier onlyPhysicalCollateralManager() {
        bool exists = false;
        for (uint i = 0; i < collateralManagers.length; i++) {
            if (collateralManagers[i] == msg.sender) {
                exists = true;
                break;
            }
        }
        require(exists, "Only the physical collateral manager can call this function.");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function.");
        _;
    }
}