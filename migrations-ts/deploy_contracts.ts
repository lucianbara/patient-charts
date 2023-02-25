const HealthChart = artifacts.require('HealthChart')

const healthChart: Truffle.Migration = function (deployer) {
  deployer.deploy(HealthChart)
}

module.exports = healthChart

export {}