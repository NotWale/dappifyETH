const Dappify = artifacts.require("Dappify");

module.exports = function(deployer) {
  deployer.deploy(Dappify);
};
