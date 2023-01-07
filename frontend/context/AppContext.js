import { ethers } from "ethers";
import React, { createContext, useEffect, useState } from "react";
import {
  cwmAbi,
  cwmContractAddress,
  faucetsAbi,
  faucetsContractAddress,
} from "../utils/constants";

export const AppContext = createContext();

const { ethereum } = typeof window !== "undefined" ? window : {};
const POSSIBLE_ERRORS = [
  "ERC20: insufficient allowance",
  "Your next request time is not reached yet",
  "ERC20: transfer amount exceeds balance",
  "requestTokens(): Failed to Transfer",
];

const createContract = (address, contractName) => {
  console.log(address);
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner(address);
  let contract;
  if (contractName == "coin")
    contract = new ethers.Contract(cwmContractAddress, cwmAbi, signer);
  else
    contract = new ethers.Contract(faucetsContractAddress, faucetsAbi, signer);
  console.log(contract);
  return contract;
};

const AppProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState(0);
  const [nextBuyTime, setNextBuyTime] = useState(0);
  const [cwmContract, setCwmContract] = useState();
  const [faucetContract, setfaucetContract] = useState();

  const checkErrors = (err) => {
    const error = POSSIBLE_ERRORS.find((e) => err.includes(e));
    console.log(error);
    if (error) {
      setMessage({
        title: "error",
        description: error,
      });
    }
  };

  const checkEthereumExists = () => {
    if (!ethereum) {
      return false;
    }
    return true;
  };
  const getConnectedAccounts = async () => {
    try {
      const accounts = await ethereum.request(
        {
          method: "eth_accounts",
        },
        []
      );
      setAccount(accounts[0]);
    } catch (err) {
      setMessage({ title: "error", description: err.message.split("(")[0] });
    }
  };
  const connectWallet = async () => {
    if (checkEthereumExists()) {
      try {
        const accounts = await ethereum.request(
          {
            method: "eth_requestAccounts",
          },
          []
        );
        console.log(accounts);
        setAccount(accounts[0]);
      } catch (err) {
        setMessage({ title: "error", description: err.message.split("(")[0] });
      }
    }
  };

  const callContract = async (cb) => {
    if (checkEthereumExists() && account) {
      try {
        await cb();
      } catch (err) {
        console.log(err);
        checkErrors(err.message);
      }
    }
  };

  const getBalance = () => {
    callContract(async () => {
      console.log(account, cwmContract);
      let bal = await cwmContract.balanceOf(account);
      console.log(balance);
      setBalance(bal);
    });
  };

  const transfer = (address, amount) => {
    callContract(async () => {
      console.log(account, cwmContract, address, amount);
      let tx = await cwmContract.transfer(
        address,
        ethers.utils.parseEther(amount)
      );
      await tx.wait();
      setMessage({ title: "success", description: "Transferred Successfully" });
      setRefresh((prev) => prev + 1);
    });
  };
  const approve = async (address, amount) => {
    callContract(async () => {
      //0xfb..26 approved to take money on my behalf
      let tx = await cwmContract.approve(
        address,
        ethers.utils.parseEther(amount)
      );
      await tx.wait();
      setMessage({
        title: "success",
        description: "Approved tokens successfully",
      });
    });
  };

  const requestTokens = async () => {
    callContract(async () => {
      let tx = await faucetContract.requestTokens();
      await tx.wait();

      setMessage({
        title: "success",
        description: "Tokens Received successfully",
      });
      setRefresh((prev) => prev + 1);
    });
  };

  const getNextBuyTime = async () => {
    callContract(async () => {
      let nextBuyTime = await faucetContract.getNextBuyTime();
      setNextBuyTime(nextBuyTime.toNumber() * 1000);
    });
  };

  const loadContract = async () => {
    let cc = await createContract(account, "coin");
    let fc = await createContract(account);

    setCwmContract(cc);
    setfaucetContract(fc);
  };

  useEffect(() => {
    if (cwmContract) getBalance();
    if (faucetContract) getNextBuyTime();
  }, [refresh, cwmContract]);
  useEffect(() => {
    console.log(account);
    if (account) {
      loadContract();
    }
  }, [account]);

  useEffect(() => {
    if (checkEthereumExists()) {
      ethereum.on("accountsChanged", getConnectedAccounts);
      getConnectedAccounts();
    }
    return () => {
      if (checkEthereumExists()) {
        ethereum.removeListener("accountsChanged", getConnectedAccounts);
      }
    };
  }, []);
  return (
    <AppContext.Provider
      value={{
        account,
        connectWallet,
        balance,
        transfer,
        approve,
        requestTokens,
        nextBuyTime,
        message,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
