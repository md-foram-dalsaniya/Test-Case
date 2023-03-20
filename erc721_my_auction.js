// Import dependencies
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNft", function () {
  let myNft;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const MyNft = await ethers.getContractFactory("MyNft");
    myNft = await MyNft.deploy();
    await myNft.deployed();
  });

  describe("createNft", function () {
    it("should create a new NFT with a unique ID and correct tokenURI", async function () {
      const tokenURI = "https://example.com/nft/1";
      const tx = await myNft.createNft(tokenURI);
      const receipt = await tx.wait();

      expect(receipt.status).to.equal(1);

      const tokenId = receipt.events[0].args[2];
      const ownerOfNft = await myNft.ownerOf(tokenId);
      const tokenURIFromContract = await myNft.tokenURI(tokenId);

      expect(ownerOfNft).to.equal(owner.address);
      expect(tokenURIFromContract).to.equal(tokenURI);
    });
  });

  describe("updateTokenURI", function () {
    it("should update the tokenURI of an existing NFT", async function () {
      const tokenURI = "https://example.com/nft/1";
      const newTokenURI = "https://example.com/nft/1-updated";
      const tx = await myNft.createNft(tokenURI);
      const receipt = await tx.wait();

      expect(receipt.status).to.equal(1);

      const tokenId = receipt.events[0].args[2];

      const tx2 = await myNft.updateTokenURI(tokenId, newTokenURI);
      const receipt2 = await tx2.wait();

      expect(receipt2.status).to.equal(1);

      const tokenURIFromContract = await myNft.tokenURI(tokenId);

      expect(tokenURIFromContract).to.equal(newTokenURI);
    });
  });

  describe("burnNFT", function () {
    it("should burn an existing NFT", async function () {
        const tokenURI = "https://example.com/nft/1";
        const tx = await myNft.createNft(tokenURI);
        const receipt = await tx.wait();
      
        expect(receipt.status).to.equal(1);
      
        const tokenId = receipt.events[0].args[2];
      
        const tx2 = await myNft.burnNFT(tokenId);
        const receipt2 = await tx2.wait();
      
        expect(receipt2.status).to.equal(1);
      });
      
  });

  describe("transferNFT", function () {
    let accounts;
    beforeEach(async function () {
      accounts = await ethers.getSigners();
    });
  
    it("should transfer an existing NFT to a new owner", async function () {
      // create a new NFT
      const tokenURI = "https://example.com/nft/1";
      const tx = await myNft.createNft(tokenURI);
      const receipt = await tx.wait();
      const tokenId = receipt.events[0].args[2];
  
      // transfer the NFT to a new owner
      await expect(myNft.transferNFT(accounts[1].address, tokenId))
        .to.emit(myNft, "Transfer")
        .withArgs(accounts[0].address, accounts[1].address, tokenId);
  
      // check that the new owner now owns the NFT
      expect(await myNft.ownerOf(tokenId)).to.equal(accounts[1].address);
    });
  
    it("should revert if the NFT does not exist", async function () {
        // Create a new account to act as the recipient
        const [sender, recipient] = await ethers.getSigners();
      
        // Attempt to transfer a non-existent NFT
        await expect(myNft.connect(sender).transferNFT(recipient.address, 1))
          .to.be.revertedWith("ERC721: transfer of nonexistent token");
      });
    });      
  
});
