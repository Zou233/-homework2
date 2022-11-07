// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {

    mapping(address => bool) claimedAirdropPlayerList;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {

    }

    function airdrop(address addr) external {
        require(claimedAirdropPlayerList[addr] == false, "This user has claimed airdrop already");
        _mint(addr, 1000);
        claimedAirdropPlayerList[addr] = true;
    }

    function get_prize(address addr) external{
        _mint(addr,1000);
    }
}
