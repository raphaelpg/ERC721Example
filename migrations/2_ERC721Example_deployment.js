const ERC721Example = artifacts.require("ERC721Example");
const _name = "ERC721TokenExample";
const _symbol = "ETE";

module.exports = function(deployer) {
  deployer.deploy(ERC721Example, _name, _symbol);
};
