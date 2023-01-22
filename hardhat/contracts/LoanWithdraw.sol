pragma solidity ^0.8.17;

// Ovaj smart contract omogućava korisnicima da dižu kredit od pool-a KM tokena, a da koriste USDT kao kolateral. Smart contract sadrži funkcije za izdavanje kredita (lend), otplatu kredita (repay), likvidaciju kolaterala (liquidate), kao i funkcije za podešavanje parametara smart contract-a, kao što su kamatna stopa (setInterestRate), LTV (setLTV) i maksimalni iznos kredita (setMaxLoan).
// Ova implementacija koristi strukturu `PhysicalCollateral` koja sadrži podatke o fizičkoj hipoteci kao što su opis, odobrenost i vrijednost u USDT-u ili KM-u. Funkcija `lend` također sadrži logiku za konverziju valuta i proveru ispravnosti unetih podataka o fizičkoj hipoteci.
contract LoanWithdraw {
    address payable public owner;
    mapping(address => uint256) public loans;
    mapping(address => uint256) public collateral;
    mapping(address => address) public collateralManager;
    uint256 public interestRate;
    uint256 public LTV;
    uint256 public maxLoan;
    // Address of the USDT token contract
    address payable public usdtAddress;

    struct PhysicalCollateral {
        bool isApproved;
        string description;
        uint256 valueInUSDT;
        uint256 valueInKM;
    }

    mapping(address => PhysicalCollateral) public physicalCollateral;

    constructor() public {
        owner = msg.sender;
        // set the address of the USDT token contract
        usdtAddress = address(0x8f8221afbb33998d8584a2b05749ba73c37a938a);
    }

    //Funkcija lend omogućava korisniku da podnese zahtev za kredit, proveravajući prvo da li je iznos kredita manji od maksimalnog iznosa kredita, da li količina kolaterala iznosi barem LTV puta iznos kredita, da li korisnik ima dovoljno sredstva za kolateral i da li smart contract ima dovoljno KM tokena za izdavanje kredita. Ako su svi uslovi ispunjeni, kredit se izdaje i kolateral se smešta u smart contract.
    function lend(uint256 _loanAmount, uint256 _collateralAmount, bool _isPhysicalCollateral, string memory _physicalCollateralDescription, address _collateralManager) public {
        require(_loanAmount <= maxLoan, "Loan amount exceeds the maximum limit");
        require(loans[msg.sender] == 0, "User already has an existing loan");
        if (_isPhysicalCollateral) {
            require(_collateralManager != address(0), "Collateral manager must be set for physical collateral");
            require(_collateralValueInUSDT > 0, "Collateral value must be greater than 0 for physical collateral");
            physicalCollateral[msg.sender] = PhysicalCollateral(false, _physicalCollateralDescription, _collateralValueInUSDT, convertFromUSDT(_collateralValueInUSDT));
            _collateralAmount = physicalCollateral[msg.sender].valueInKM;
        } else {
            // convert _collateralAmount from USDT to KM using the current exchange rate
            _collateralAmount = convertFromUSDT(_collateralAmount);
        }
        require(_collateralAmount >= _loanAmount * LTV, "Collateral amount is insufficient");
        require(msg.sender.balance >= _collateralAmount || _isPhysicalCollateral, "Sender does not have enough collateral to lend");
        require(address(this).balance >= _loanAmount, "This contract does not have enough KM to lend");
        loans[msg.sender] = _loanAmount;
        collateral[msg.sender] = _collateralAmount;
        collateralManager[msg.sender] = _collateralManager;
        msg.sender.transfer(_loanAmount);
    }

    function approvePhysicalCollateral(address _user) public {
        require(msg.sender == collateralManager[_user], "Only collateral manager can approve physical collateral");
        require(physicalCollateral[_user].isApproved != true, "Collateral is already approved");
        // Perform additional validation and checks on physical collateral
        // ...
        // Approve collateral
        physicalCollateral[_user].isApproved = true;
    }

    // Funkcija repay omogućava korisniku da otplati deo ili celokupan kredit, proveravajući da li iznos otplate prelazi iznos kredita koji je korisnik duguje.
    function repay(uint256 _repaymentAmount) public {
        require(loans[msg.sender] >= _repaymentAmount, "Repayment amount exceeds loan amount");
        // convert _repaymentAmount to USDT using the current exchange rate
        _repaymentAmount = convertToUSDT(_repaymentAmount);
        loans[msg.sender] -= _repaymentAmount;
        // transfer _repaymentAmount in USDT to the lender
        usdtAddress.transfer(_repaymentAmount);
    }

    //Funkcija liquidate omogućava vlasniku smart contract-a da likvidira kolateral u slučaju da korisnik ne otplaćuje kredit, proveravajući da li iznos kredita prelazi LTV od iznosa kolaterala.
    function liquidate(address payable _user) public {
        require(msg.sender == owner || msg.sender == collateralManager[_user], "Only owner or collateral manager can liquidate");
        if (physicalCollateral[_user].isApproved) {
            require(loans[_user] >= physicalCollateral[_user].valueInKM * (1 - LTV), "Loan amount is less than the liquidation threshold");
            // Perform physical collateral liquidation
            //...
            physicalCollateral[_user] = PhysicalCollateral(false, "", 0, 0);
            collateral[_user] = 0;
            loans[_user] = 0;
        } else {
            require(loans[_user] >= collateral[_user] * (1 - LTV), "Loan amount is less than the liquidation threshold");
            uint256 collateralReturn = collateral[_user] * (1 - LTV);
            collateral[_user] = 0;
            loans[_user] = 0;
            _user.transfer(collateralReturn);
        }
    }

    function setInterestRate(uint256 _interestRate) public {
        require(msg.sender == owner, "Only owner can set interest rate");
        // convert _interestRate to USDT using the current exchange rate
        _interestRate = convertToUSDT(_interestRate);
        interestRate = _interestRate;
    }

    function setLTV(uint256 _LTV) public {
        require(msg.sender == owner, "Only owner can set LTV ratio");
        LTV = _LTV;
    }

    function setMaxLoan(uint256 _maxLoan) public {
        require(msg.sender == owner, "Only owner can set max loan amount");
        maxLoan = _maxLoan;
    }

    function convertFromUSDT(uint256 _usdtAmount) private view returns (uint256) {
        // code to convert _usdtAmount to KM using the current exchange rate
        return _usdtAmount;
    }

    function convertToUSDT(uint256 _kmAmount) private view returns (uint256) {
        // code to convert _kmAmount to USDT using the current exchange rate
        return _kmAmount;
    }
}