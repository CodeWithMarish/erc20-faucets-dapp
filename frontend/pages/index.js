import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { ethers, BigNumber } from "ethers";
import Head from "next/head";
export default function Home() {
  const { balance, message, transfer, approve, nextBuyTime, requestTokens } =
    useContext(AppContext);
  const [data, setData] = useState({});

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white-300 flex-1">
      <Head>
        <title>CWM Faucets</title>
      </Head>
      <div className="container max-w-3xl py-10">
        <div className="shadow-border bg-blue-200 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="border-4 bg-yellow-200 flex flex-col p-4 border-black">
              <h2 className="text-4xl md:text-5xl font-bold">{`${ethers.utils.formatEther(
                BigNumber.from(balance)
              )} CWM`}</h2>
              <div className="flex-1" />
              <p className="text-lg font-bold">Balance</p>
            </div>

            <button
              onClick={
                new Date() - new Date(nextBuyTime) > 0 ? requestTokens : null
              }
              className="btn  bg-green-200 md:text-2xl"
            >
              {new Date() - new Date(nextBuyTime) < 0 ? (
                <>{`Next Request at ${new Date(
                  nextBuyTime
                ).toLocaleString()}`}</>
              ) : (
                <>
                  Request <span className="block">Tokens</span>
                </>
              )}
            </button>
            <div className="sm:col-span-2 bg-gray-700 h-0.5" />
            <input
              placeholder="Address"
              className="border-4 border-black p-2"
              type={"text"}
              name="address"
              onChange={handleChange}
            />
            <input
              placeholder="Amount"
              className="border-4 border-black p-2"
              type={"text"}
              name="amount"
              onChange={handleChange}
            />

            <button
              onClick={() => {
                console.log(data);
                transfer(data.address, data.amount);
              }}
              className="btn bg-green-200 border-4 md:text-2xl"
            >
              Transfer <span className="sm:block">Tokens</span>
            </button>

            <button
              onClick={() => approve(data.address, data.amount)}
              className="btn md:text-2xl bg-orange-200 border-4"
            >
              Approve <span className="sm:block">Tokens</span>
            </button>

            <div className="col-span-2 bg-amber-200 border-4 border-black p-4">
              {message.description ? (
                <p className="text-xl capitalize">{`${message.title}: ${message.description}`}</p>
              ) : (
                <p className="text-xl">{`No Message`}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
