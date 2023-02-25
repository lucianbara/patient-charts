module.exports = (artifacts: Truffle.Artifacts) => {
  return async (
    deployer: Truffle.Deployer,
    network: "development"
  ) => {
    const HealthChart = artifacts.require("HealthChart");

    await deployer.deploy(HealthChart);

    const healthChart = await HealthChart.deployed();
    console.log(
      `HealthChart deployed at ${healthChart.address} in network: ${network}.`
    );
  };
};