var HyperQuantToken = artifacts.require("./HyperQuantToken.sol");
var HyperQuantCrowdsale = artifacts.require("./HyperQuantCrowdsale.sol");

module.exports = function(deployer) {
  deployer.deploy(HyperQuantToken).then(function() {
    const rate = process.env.HyperQuantCrowdsaleRate;
    const fund = process.env.HyperQuantCrowdsaleFundAddress;
    const tokensCap = process.env.HyperQuantCrowdsaleTokensCap;
    return deployer.deploy(HyperQuantCrowdsale, rate, fund, HyperQuantToken.address, tokensCap);
  });
};
