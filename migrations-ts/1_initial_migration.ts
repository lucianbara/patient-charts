module.exports = (artifacts: Truffle.Artifacts) => {
  return async (
    deployer: Truffle.Deployer,
    network: "development"
  ) => {
    const Migrations = artifacts.require("Migrations");

    await deployer.deploy(Migrations);

    const migrations = await Migrations.deployed();
    console.log(
      `Migrations deployed at ${migrations.address} in network: ${network}.`
    );
  };
};