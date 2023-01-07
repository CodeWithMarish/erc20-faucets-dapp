// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CWMToken is ERC20, Ownable {
    constructor() ERC20("CodeWithMarish", "CWM") {
        _mint(msg.sender, 100 ether);
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }
}
