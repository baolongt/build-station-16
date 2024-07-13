import React, { useState } from "react";
import { Input } from "@/components/ui/input";

export const MakeEscrowPage = () => {
  const [deposit, setDeposit] = useState("");
  const [receive, setReceive] = useState("");

  const handleDepositChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeposit(event.target.value);
  };

  const handleReceiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceive(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 space-y-4 bg-white rounded shadow-xl">
        <h2 className="text-2xl font-bold text-center">Make</h2>
        <div className="space-y-2">
          <Input
            id="deposit"
            name="deposit"
            value={deposit}
            onChange={handleDepositChange}
            className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            placeholder="Enter deposit amount"
          />
        </div>
        <div className="space-y-2 mb-1">
          <Input
            id="receive"
            name="receive"
            value={receive}
            onChange={handleReceiveChange}
            className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
            placeholder="Enter receive amount"
          />
        </div>
        <button
          type="submit"
          className="w-full px-3 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
