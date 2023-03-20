// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract myToken is Context, ERC20 {
    constructor () ERC20("SimpleToken", "SIMP") {
        _mint(msg.sender, 10000000 * (10 ** uint256(decimals())));
    }
}

