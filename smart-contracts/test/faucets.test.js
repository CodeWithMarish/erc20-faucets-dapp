const { expect, assert } = require("chai");
const { deployments, ethers, network } = require("hardhat");

describe("Faucets", function () {
  let cwm, faucets, accounts, buyTimeLimit;
  beforeEach(async () => {
    await deployments.fixture();
    cwm = await ethers.getContract("CWMToken");
    faucets = await ethers.getContract("Faucets");
    accounts = await ethers.getSigners();
    buyTimeLimit = await faucets.getBuyLimitTime();
    await cwm.transfer(faucets.address, ethers.utils.parseEther("50"));
  });

  describe("Starting Test", () => {
    it("Request Tokens and receive 10 tokens from contract, fails last purchase less buytimeLimit and we can request tokens after buylimit time exceeds", async () => {
      let tx = await faucets.requestTokens();
      await tx.wait();
      assert.equal(
        (await cwm.balanceOf(accounts[0].address)).toString(),
        ethers.utils.parseEther("60").toString()
      );

      await expect(faucets.requestTokens()).to.be.revertedWith(
        "Your next request time is not reached yet"
      );
      //   console.log(buyTimeLimit.toNumber());
      await network.provider.send("evm_increaseTime", [
        buyTimeLimit.toNumber() + 1,
      ]);
      await network.provider.request({ method: "evm_mine", params: [] });

      let tx1 = await faucets.requestTokens();
      await tx1.wait();
      assert.equal(
        (await cwm.balanceOf(accounts[0].address)).toString(),
        ethers.utils.parseEther("70").toString()
      );
    });
  });
});
