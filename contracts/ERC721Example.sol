pragma solidity ^0.6.2;

import "./ERC721Full.sol";
import "./Counters.sol";
import "./Ownable.sol";

contract ERC721Example is ERC721Full, Ownable {
	  using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor(string memory tokenName, string memory tokenSymbol) ERC721Full(tokenName, tokenSymbol) public {
    }

    function awardToken(address newOwner, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(newOwner, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    function isApprovedOrOwner(address spender, uint256 tokenId) public view returns (bool){
        return _isApprovedOrOwner(spender, tokenId);
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
}