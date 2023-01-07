// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./CWMToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucets {
    mapping(address => uint256) userNextBuyTime;
    uint256 private buyTimeLimit;
    CWMToken private cwmToken;

    constructor(address tokenAddress, uint256 _buyTimeLimit) {
        cwmToken = CWMToken(tokenAddress);
        buyTimeLimit = _buyTimeLimit;
    }

    function requestTokens() public {
        require(msg.sender != address(0), "Cannot send token zero address");
        require(
            block.timestamp > userNextBuyTime[msg.sender],
            "Your next request time is not reached yet"
        );
        require(
            cwmToken.transfer(msg.sender, 10 ether),
            "requestTokens(): Failed to Transfer"
        );
        userNextBuyTime[msg.sender] = block.timestamp + buyTimeLimit;
    }

    function getBuyLimitTime() public view returns (uint256) {
        return buyTimeLimit;
    }

    function getNextBuyTime() public view returns (uint256) {
        return userNextBuyTime[msg.sender];
    }
}
