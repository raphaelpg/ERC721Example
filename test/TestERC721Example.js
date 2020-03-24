const { BN, ether, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const ERC721Example = artifacts.require("ERC721Example");
const ERC721ExampleReceiver = artifacts.require("ERC721ExampleReceiver");

contract("ERC721Example", function(accounts){
    const deployer = accounts[0];
    const newOwner = accounts[1];
    const newOwner2 = accounts[2];
    const address0 = '0x0000000000000000000000000000000000000000';
    const _name = "ERC721TokenExample";
    const _symbol = "ETE";

    //Before each unit test  
    beforeEach(async function() {
        this.ERC721ExampleInstance = await ERC721Example.new(_name, _symbol);
    });

    //Testing ERC721 METADATA
    //Test 1
    it('Check name() function', async function() {
        let tokenName = await this.ERC721ExampleInstance.name();
        expect(tokenName).to.equal("ERC721TokenExample");
    });

    //Test 2
    it('Check symbol() function', async function() {
        let tokenSymbol = await this.ERC721ExampleInstance.symbol();
        expect(tokenSymbol).to.equal("ETE");
    });

    //Test 3
    it('Check balanceOf() function', async function() {
        //Check revert
        await expectRevert(this.ERC721ExampleInstance.balanceOf(address0),"ERC721: balance query for the zero address");
        
        let newOwnerBalance = await this.ERC721ExampleInstance.balanceOf(newOwner);
        expect(newOwnerBalance).to.be.bignumber.equal(new BN(0));
    });

    //Test 4
    it('Check awardToken() function', async function() {
        //Check revert
        await expectRevert(this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: newOwner}),"Ownable: caller is not the owner");
        
        //Creation of one token
        await this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: deployer});

        let balanceOfNewOwner = await this.ERC721ExampleInstance.balanceOf(newOwner); 
        expect(balanceOfNewOwner).to.be.bignumber.equal(new BN(1));
    });

    //Test 5
    it('Check tokenURI() function', async function() {
        await expectRevert(this.ERC721ExampleInstance.tokenURI(1),"ERC721Metadata: URI query for nonexistent token");

        //Creation of one token
        await this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: deployer});

        let tokenURI = await this.ERC721ExampleInstance.tokenURI(1);
        expect(tokenURI).to.be.equal('Bear');
    });

    //Test 6
    it('Check totalSupply() function', async function () {
        let totalSupply = await this.ERC721ExampleInstance.totalSupply();
        expect(totalSupply).to.be.bignumber.equal(new BN(0));
        
        //Creation of one token
        await this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: deployer});
        
        let totalSupplyAfterMint = await this.ERC721ExampleInstance.totalSupply();
        expect(totalSupplyAfterMint).to.be.bignumber.equal(new BN(1));
    });

    //Test 7
    it('Check tokenByIndex() function', async function () {
        //Check revert
        await expectRevert(this.ERC721ExampleInstance.tokenByIndex(1),"ERC721Enumerable: global index out of bounds");
        
        //Creation of one token
        await this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: deployer});
        
        let tokenID = await this.ERC721ExampleInstance.tokenByIndex(0);
        expect(tokenID).to.be.bignumber.equal(new BN(1));
    });

    //Test 8
    it('Check tokenOfOwnerByIndex() function', async function () {
        //Check revert
        await expectRevert(this.ERC721ExampleInstance.tokenOfOwnerByIndex(newOwner, 1),"ERC721Enumerable: owner index out of bounds");

        //Creation of one token
        await this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: deployer});
        
        let tokenID = await this.ERC721ExampleInstance.tokenOfOwnerByIndex(newOwner, 0);
        expect(tokenID).to.be.bignumber.equal(new BN(1));
    });

    //Test 9
    it('Check ownerOf() function', async function () {
        //Check revert
        await expectRevert(this.ERC721ExampleInstance.ownerOf(0),"ERC721: owner query for nonexistent token");

        //Creation of one token
        await this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: deployer});
        
        let retrievedOwner = await this.ERC721ExampleInstance.ownerOf(1);
        expect(retrievedOwner).to.equal(newOwner);
    });
    
    //Test 10
    it('Check approve() and getApproved() functions', async function () {
        //Check revert
        await expectRevert(this.ERC721ExampleInstance.getApproved(1),"ERC721: approved query for nonexistent token");

        //Creation of one token
        await this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: deployer});
        
        //Check revert
        await expectRevert(this.ERC721ExampleInstance.approve(newOwner, 1, {from: newOwner}),"ERC721: approval to current owner");
        await expectRevert(this.ERC721ExampleInstance.approve(newOwner2, 1, {from: newOwner2}),"ERC721: approve caller is not owner nor approved for all");
        
        await this.ERC721ExampleInstance.approve(newOwner2, 1, {from: newOwner});
        
        let approvedAddress = await this.ERC721ExampleInstance.getApproved(1);
        expect(approvedAddress).to.equal(newOwner2);
    });

    //Test 11
    it('Check setApprovalForAll() and isApprovedForAll() functions', async function () {
        //Check revert
        await expectRevert(this.ERC721ExampleInstance.setApprovalForAll(deployer, true, {from: deployer}),"ERC721: approve to caller");

        //Set approval to true
        await this.ERC721ExampleInstance.setApprovalForAll(newOwner, true, {from: deployer});
        let isApproved = await this.ERC721ExampleInstance.isApprovedForAll(deployer, newOwner);
        expect(isApproved).to.equal(true);

        //Set approval to false
        await this.ERC721ExampleInstance.setApprovalForAll(newOwner, false, {from: deployer});
        let isNotApproved = await this.ERC721ExampleInstance.isApprovedForAll(deployer, newOwner);
        expect(isNotApproved).to.equal(false);
    });

    //Test 12
    it('Check transferFrom() function', async function () {
        //Creation of one token
        await this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: deployer});

        //Check reverts
        await expectRevert(this.ERC721ExampleInstance.transferFrom(newOwner, newOwner2, 1, {from: deployer}),"ERC721: transfer caller is not owner nor approved");
        await expectRevert(this.ERC721ExampleInstance.transferFrom(newOwner2, newOwner, 1, {from: newOwner}),"ERC721: transfer of token that is not own");
        await expectRevert(this.ERC721ExampleInstance.transferFrom(newOwner, address0, 1, {from: newOwner}),"ERC721: transfer to the zero address");
        await expectRevert(this.ERC721ExampleInstance.transferFrom(newOwner, address0, 2, {from: newOwner}),"ERC721: operator query for nonexistent token");

        //Check new owner after transferFrom from current owner
        await this.ERC721ExampleInstance.transferFrom(newOwner, newOwner2, 1, {from: newOwner});
        let retrievedOwner = await this.ERC721ExampleInstance.ownerOf(1);
        expect(retrievedOwner).to.equal(newOwner2);

        //Set approval and test transferFrom from owner to approved address by itself
        await this.ERC721ExampleInstance.setApprovalForAll(deployer, true, {from: newOwner2});
        await this.ERC721ExampleInstance.transferFrom(newOwner2, deployer, 1, {from: deployer});
        let retrievedOwner2 = await this.ERC721ExampleInstance.ownerOf(1);
        expect(retrievedOwner2).to.equal(deployer);
    
        //Set approval and test transferFrom from owner to another address by approved
        await this.ERC721ExampleInstance.setApprovalForAll(newOwner2, true, {from: deployer});
        await this.ERC721ExampleInstance.transferFrom(deployer, newOwner, 1, {from: newOwner2});
        let retrievedOwner3 = await this.ERC721ExampleInstance.ownerOf(1);
        expect(retrievedOwner3).to.equal(newOwner);
    });

    //Test 13
    it('Check safeTransferFrom() function', async function () {
        //Creation of one token
        await this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: deployer});

        //Check reverts
        await expectRevert(this.ERC721ExampleInstance.safeTransferFrom(newOwner, newOwner2, 1, {from: deployer}),"ERC721: transfer caller is not owner nor approved");
        await expectRevert(this.ERC721ExampleInstance.safeTransferFrom(newOwner2, newOwner, 1, {from: newOwner}),"ERC721: transfer of token that is not own");
        await expectRevert(this.ERC721ExampleInstance.safeTransferFrom(newOwner, address0, 1, {from: newOwner}),"ERC721: transfer to the zero address");
        await expectRevert(this.ERC721ExampleInstance.safeTransferFrom(newOwner, address0, 2, {from: newOwner}),"ERC721: operator query for nonexistent token");

        //Check new owner after safeTransferFrom from current owner
        await this.ERC721ExampleInstance.safeTransferFrom(newOwner, newOwner2, 1, {from: newOwner});
        let retrievedOwner = await this.ERC721ExampleInstance.ownerOf(1);
        expect(retrievedOwner).to.equal(newOwner2);

        //Set approval and test safeTransferFrom from owner to approved address by itself
        await this.ERC721ExampleInstance.setApprovalForAll(deployer, true, {from: newOwner2});
        await this.ERC721ExampleInstance.safeTransferFrom(newOwner2, deployer, 1, {from: deployer});
        let retrievedOwner2 = await this.ERC721ExampleInstance.ownerOf(1);
        expect(retrievedOwner2).to.equal(deployer);
    
        //Set approval and test safeTransferFrom from owner to another address by approved
        await this.ERC721ExampleInstance.setApprovalForAll(newOwner2, true, {from: deployer});
        await this.ERC721ExampleInstance.safeTransferFrom(deployer, newOwner, 1, {from: newOwner2});
        let retrievedOwner3 = await this.ERC721ExampleInstance.ownerOf(1);
        expect(retrievedOwner3).to.equal(newOwner);
    });

    //Test 14
    it('Check safeTransferFrom() function to contract address', async function () {
        //Creation of one token
        await this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: deployer});

        //Check revert
        await expectRevert(this.ERC721ExampleInstance.safeTransferFrom(newOwner, this.ERC721ExampleInstance.address, 1, {from: newOwner}),"ERC721: transfer to non ERC721Receiver implementer");

        //Check new owner after safeTransferFrom to contract address
        this.ERC721ExampleReceiverInstance = await ERC721ExampleReceiver.new();
        await this.ERC721ExampleInstance.safeTransferFrom(newOwner, this.ERC721ExampleReceiverInstance.address, 1, {from: newOwner});
        let retrievedOwner = await this.ERC721ExampleInstance.ownerOf(1);
        expect(retrievedOwner).to.equal(this.ERC721ExampleReceiverInstance.address);
    });

    //Test 15
    it('Check exists() function', async function () {
        //Creation of one token
        await this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: deployer});

        //Check tokenExist function
        let tokenExists = await this.ERC721ExampleInstance.exists(1);
        expect(tokenExists).to.equal(true);

        let tokenDoNotExists = await this.ERC721ExampleInstance.exists(2);
        expect(tokenDoNotExists).to.equal(false);
    });

    //Test 16
    it('Check isApprovedOrOwner() function', async function () {
        //Creation of one token
        await this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: deployer});

        //Check revert
        await expectRevert(this.ERC721ExampleInstance.isApprovedOrOwner(newOwner, 2),"ERC721: operator query for nonexistent token");

        //Check isApprovedOrOwner function
        //owner
        let isApproved = await this.ERC721ExampleInstance.isApprovedOrOwner(newOwner, 1);
        expect(isApproved).to.equal(true);

        //not approved
        let isNotApproved = await this.ERC721ExampleInstance.isApprovedOrOwner(newOwner2, 1);
        expect(isNotApproved).to.equal(false);

        //approved
        await this.ERC721ExampleInstance.approve(newOwner2, 1, {from: newOwner});
        let isApproved2 = await this.ERC721ExampleInstance.isApprovedOrOwner(newOwner2, 1);
        expect(isApproved2).to.equal(true);

        //operator
        await this.ERC721ExampleInstance.setApprovalForAll(deployer, true, {from: newOwner});
        let isApproved3 = await this.ERC721ExampleInstance.isApprovedOrOwner(deployer, 1);
        expect(isApproved3).to.equal(true);
    });

    //Test 17
    it('Check burn() function', async function () {
        //Creation of one token
        await this.ERC721ExampleInstance.awardToken(newOwner, "Bear", {from: deployer});

        //Check tokenExist function
        let tokenExists = await this.ERC721ExampleInstance.exists(1);
        expect(tokenExists).to.equal(true);

        //Test burn function
        await this.ERC721ExampleInstance.burn(1);

        let tokenExists2 = await this.ERC721ExampleInstance.exists(1);
        expect(tokenExists2).to.equal(false);

        await expectRevert(this.ERC721ExampleInstance.ownerOf(1),"ERC721: owner query for nonexistent token");
    });
});