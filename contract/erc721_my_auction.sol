// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MyNft is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("MyNFT","MNFT"){}

    function createNft(string memory tokenURI) public returns(uint256){
        _tokenIds.increment();
        uint256 newNFTId = _tokenIds.current();
        _mint(_msgSender(),newNFTId);
        _setTokenURI(newNFTId,tokenURI);
        return newNFTId;
    }

    function totalSupply() public view returns (uint256){
        return _tokenIds.current();
    }

    function updateTokenURI(uint256 tokenId,string memory newTokenURI) public {
        require(_exists(tokenId),"NFT does not exist");
        require(_isApprovedOrOwner(_msgSender(),tokenId),"Caller is not Owner nor Approved for this NFT");
        _setTokenURI(tokenId,newTokenURI);
    }

    function burnNFT(uint256 tokenId) public{
        require(_exists(tokenId),"This NFT does not Exist");
        require(_isApprovedOrOwner(_msgSender(),tokenId),"Caller is not Owner nor Approved for this NFT");
        _burn(tokenId);

    }

    function transferNFT(address recipient, uint256 tokenId) public {
       require(_exists(tokenId),"ERC721: transfer of nonexistent token");
        require(_isApprovedOrOwner(_msgSender(),tokenId),"Caller is not owner nor approved for this NFT");
        _transfer(msg.sender,recipient,tokenId);
    }
  
} 
