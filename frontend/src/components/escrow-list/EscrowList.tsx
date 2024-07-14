import useEscrowProgram from "@/hooks/escrow";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { shortenAddress } from "@/lib/utils";
import useAnchorProvider from "@/hooks";

type Escrow = {
  id: PublicKey;
  marker: PublicKey;
  mintA: PublicKey;
  mintB: PublicKey;
  amountA: number;
  amountB: number;
};
export function EscrowList() {
  const [escrowList, setEscrowList] = useState<Escrow[]>([]);
  const { getEscrowInfo, takeEscrow } = useEscrowProgram();
  const provider = useAnchorProvider();

  useEffect(() => {
    const init = async () => {
      const storedEscrowList = localStorage.getItem("escrow");
      const escrowList: {
        pubkey: string;
        deposit: number;
      }[] = storedEscrowList ? JSON.parse(storedEscrowList) : [];

      console.log("escrowList", escrowList);

      const escrows: Escrow[] = [];

      for (const escrow of escrowList) {
        try {
          const escrowInfo = await getEscrowInfo(new PublicKey(escrow.pubkey));
          escrows.push({
            id: new PublicKey(escrow.pubkey),
            marker: escrowInfo.maker,
            mintA: escrowInfo.mintA,
            mintB: escrowInfo.mintB,
            amountA: escrow.deposit,
            amountB: Number(escrowInfo.receive) / 10 ** 9,
          });
        } catch (e) {
          console.log(e);
        }
      }

      console.log(escrows);
      setEscrowList(escrows);
    };
    init();
  }, []);

  const handleTake = async (escrow: PublicKey) => {
    try {
      const tx = await takeEscrow(escrow);
      console.log("tx", tx);
      if (tx) {
        const template = `https://explorer.solana.com/transaction/${tx}?cluster=custom&customUrl=${provider.connection.rpcEndpoint}`;
        console.log("tx", template);
      }
    } catch (e) {}
  };

  return (
    <div className="h-screen grid gap-4 grid-cols-6 grid-rows-3">
      {escrowList.map((escrow, index) => {
        return (
          <Card className="shadow-xl border-4 border-indigo-300">
            <CardHeader className="mb-10">
              <CardTitle className="text-3xl text-indigo-500 font-semibold">
                Escrow {index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col font-semibold">
              <div className="text-2xl text-start mb-6">
                Marker:{" "}
                <span className="text-end pl-36 font-normal text-indigo-400">
                  {shortenAddress(escrow.marker.toBase58())}
                </span>
              </div>
              <div className="text-2xl text-start mb-6">
                Token A:
                <span className="text-end pl-36 font-normal text-indigo-400">
                  {shortenAddress(escrow.mintA.toBase58())}
                </span>
              </div>
              <div className="text-2xl text-start mb-6">
                Token B:
                <span className="text-end pl-36 font-normal text-indigo-400">
                  {shortenAddress(escrow.mintB.toBase58())}
                </span>
              </div>
              <div className="text-2xl text-start mb-6">
                Amount A:
                <span className="text-end pl-40 font-normal text-indigo-400">
                  {escrow.amountA}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-center w-full">
                <Button
                  onClick={() => handleTake(escrow.id)}
                  size={"lg"}
                  variant={"default"}
                  className="border-2 border-indigo-500 text-xl hover:bg-indigo-500 hover:text-white"
                >
                  Take with {escrow.amountB} B
                </Button>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
