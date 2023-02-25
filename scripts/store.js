const HealthChart = artifacts.require('HealthChart');

module.exports = async (callback) => {
  try {
    const healthChart = await HealthChart.deployed();
    const reciept = await healthChart.SendRequest("Health Chart");
    console.log(reciept);

  } catch(err) {
    console.log('Oops: ', err.message);
  }
  callback();
};
