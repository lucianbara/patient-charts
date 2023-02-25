const HealthChart = artifacts.require("HealthChart");

module.exports = function (deployer) {
  deployer.deploy(HealthChart, "Health Chart");
};