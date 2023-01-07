import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { account, connectWallet } = useContext(AppContext);

  return (
    <header className=" border-b-2 border-black">
      <div className="container py-4 max-w-3xl flex items-center justify-between">
        <h1 className="font-bold text-3xl">CWM Faucets</h1>

        {account ? (
          <p className="font-semibold text-3xl">{`${account.substring(
            0,
            5
          )}..${account.slice(-3)}`}</p>
        ) : (
          <button className="btn bg-amber-200" onClick={connectWallet}>
            Connect
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
