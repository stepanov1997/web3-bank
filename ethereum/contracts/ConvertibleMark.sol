//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ConvertibleMark is ERC20, Ownable {

    constructor() ERC20("Convertible Mark", "KM") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
