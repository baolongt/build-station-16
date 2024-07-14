import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";

export const MakeEscrowPage = () => {
  const [deposit, setDeposit] = useState("");
  const [depositAddress, setDepositAddress] = useState("");
  const [receive, setReceive] = useState("");
  const [receiveAddress, setReceiveAddress] = useState("");
  const { connected, wallet } = useWallet();

  const handleDepositChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeposit(event.target.value);
  };

  const handleReceiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceive(event.target.value);
  };

  const handleDepositAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepositAddress(event.target.value);
  };

  const handleReceiveAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReceiveAddress(event.target.value);
  };

  const handleCreateMake = async () => {
    if (!wallet) {
      console.log("Wallet is not connected");
      return;
    }

    try {
      const depositAmount = parseFloat(deposit);
      const receiveAmount = parseFloat(receive);

      if (isNaN(depositAmount) || isNaN(receiveAmount)) {
        console.log("Invalid input values");
        return;
      }

      console.log("Make escrow successful");
    } catch (error) {
      console.error("Failed to make escrow", error);
    }
  };

  return (
    <div className="w-2/12 p-8 space-y-4 bg-white rounded shadow-xl">
      <h2 className="text-2xl font-bold text-center">Create Escrow</h2>
      <div className="space-y-2">
        <Input
          id="deposit"
          name="deposit"
          value={depositAddress}
          onChange={handleDepositAddressChange}
          className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
          placeholder="Enter token A address"
        />
      </div>
      <div className="space-y-2">
        <Input
          id="deposit"
          name="deposit"
          value={deposit}
          onChange={handleDepositChange}
          className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
          placeholder="Amount of token A"
        />
      </div>
      <div className="space-y-2 mb-1">
        <Input
          id="receive"
          name="receive"
          value={receiveAddress}
          onChange={handleReceiveAddressChange}
          className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
          placeholder="Enter token B address"
        />
      </div>
      <div className="space-y-2">
        <Input
          id="deposit"
          name="deposit"
          value={deposit}
          onChange={handleReceiveChange}
          className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
          placeholder="Amount of token B"
        />
      </div>
      <Button
        type="submit"
        {...(!connected && { disabled: true })}
        className="w-full px-3 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={handleCreateMake}
      >
        Submit
      </Button>
    </div>
  );
};
