const ERC721ExampleReceiver = artifacts.require("ERC721ExampleReceiver");
const _name = "ERC721TokenExampleReceiver";
const _symbol = "ETR";

module.exports = function(deployer) {
  deployer.deploy(ERC721ExampleReceiver, _name, _symbol);
};