const { expect, assert } = require("chai");
const { deployments, ethers } = require("hardhat");

describe("CWM", function () {
  let cwm, accounts;
  beforeEach(async () => {
    await deployments.fixture();
    cwm = await ethers.getContract("CWMToken");
    accounts = await ethers.getSigners();
  });

  describe("Starting Test", () => {
    describe("Constructor check", () => {
      it("Constructor check for deployer gets 100 token and check the name symbol to be CodeWithMarish and CWM", async () => {
        assert.equal(
          (await cwm.balanceOf(accounts[0].address)).toString(),
          ethers.utils.parseEther("100").toString()
        );

        assert.equal(await cwm.name(), "CodeWithMarish");
        assert.equal(await cwm.symbol(), "CWM");
      });
      it("Transfer 10 token from account 0 to account 1", async () => {
        await cwm.transfer(accounts[1].address, ethers.utils.parseEther("10"));
        assert.equal(
          (await cwm.balanceOf(accounts[0].address)).toString(),
          ethers.utils.parseEther("90").toString()
        );
        assert.equal(
          (await cwm.balanceOf(accounts[1].address)).toString(),
          ethers.utils.parseEther("10").toString()
        );
      });

      it("Approve contract to take tokens from sender account to another account else we will get not enough allowances error", async () => {
        await expect(
          cwm.transferFrom(
            accounts[0].address,
            accounts[1].address,
            ethers.utils.parseEther("10")
          )
        ).to.be.revertedWith("ERC20: insufficient allowance");
        let tx = await cwm.approve(
          accounts[1].address,
          ethers.utils.parseEther("10")
        );
        await tx.wait();
        const cwm1 = await cwm.connect(accounts[1]);
        let tx1 = await cwm1.transferFrom(
          accounts[0].address,
          accounts[1].address,
          ethers.utils.parseEther("10")
        );
        await tx1.wait();
        assert.equal(
          (await cwm.balanceOf(accounts[1].address)).toString(),
          ethers.utils.parseEther("10").toString()
        );
      });
    });
  });
});
