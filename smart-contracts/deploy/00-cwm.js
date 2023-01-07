const fs = require("fs/promises");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("CWMToken", {
    from: deployer,
    args: [],
    waitConfirmations: 1,
    log: true,
  });
};
