const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const cwm = await ethers.getContract("CWMToken");
  await deploy("Faucets", {
    from: deployer,
    args: [cwm.address, 1800],
    waitConfirmations: 1,
    log: true,
  });
};
