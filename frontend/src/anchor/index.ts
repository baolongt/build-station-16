import { TransactionInstruction, PublicKey, Transaction } from '@solana/web3.js';
import { Program } from "@coral-xyz/anchor";
import { IDL, Escrow } from "./idl";
import { Connection } from "@solana/web3.js";

const programId = new PublicKey("C7TEHSq3mBUoXNiYAeboHor8W3XfJ4SrbkQaoFnTZ5Uc");
const connection = new Connection("http://localhost:8899", "confirmed");

export const program = new Program<Escrow>(IDL, programId, {
    connection,
});
