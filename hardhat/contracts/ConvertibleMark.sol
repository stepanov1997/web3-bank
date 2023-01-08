// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ConvertibleMark is ERC20 {

    constructor() ERC20("Convertible Mark", "KM") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}