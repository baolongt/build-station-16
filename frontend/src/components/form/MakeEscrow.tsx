import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";
import useEscrowProgram from "@/hooks/escrow";
import useAnchorProvider from "@/hooks";
import { PublicKey } from "@solana/web3.js";

export const MakeEscrowForm = () => {
  const { makeNewEscrow } = useEscrowProgram();
  const [deposit, setDeposit] = useState("");
  const [depositAddress, setDepositAddress] = useState("");
  const [receive, setReceive] = useState("");
  const [receiveAddress, setReceiveAddress] = useState("");
  const { connected, publicKey } = useWallet();
  const provider = useAnchorProvider();

  const [result, setResult] = useState<string | null>(null);

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
    if (!publicKey) {
      console.log("Wallet is not connected");
      return;
    }

    try {
      const depositAmount = parseFloat(deposit);
      const receiveAmount = parseFloat(receive);

      const result = await makeNewEscrow(
        {
          mint_a: depositAddress,
          mint_b: receiveAddress,
          deposit: depositAmount,
          receive: receiveAmount,
        },
        (pubkey: PublicKey, deposit: number) => {
          // store in local storage
          console.log("Escrow created");
          const storedEscrowList = localStorage.getItem("escrow");
          const escrowList = storedEscrowList
            ? JSON.parse(storedEscrowList)
            : [];
          escrowList.push({
            pubkey: pubkey.toBase58(),
            deposit,
          });
          localStorage.setItem("escrow", JSON.stringify(escrowList));
        }
      );
      if (result) {
        const template = `https://explorer.solana.com/transaction/${result}?cluster=custom&customUrl=${provider.connection.rpcEndpoint}`;
        setResult(template);
        setDeposit("");
        setReceive("");
        setDepositAddress("");
        setReceiveAddress("");
      }
    } catch (error) {
      console.error("Failed to make escrow", error);
    }
  };

  return (
    <>
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
          id="receive"
          name="receive"
          value={receive}
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
        Make
      </Button>
      <div>
        {result && (
          <a
            className="text-indigo-500"
            href={result}
            target="_blank"
            rel="noreferrer"
          >
            View transaction
          </a>
        )}
      </div>
    </>
  );
};
