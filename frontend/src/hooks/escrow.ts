import { useWallet } from "@solana/wallet-adapter-react";
import useAnchorProvider from ".";
import { BN, Program } from "@coral-xyz/anchor";
import { Escrow } from "@/artifact/escrow";
import idl from "@/artifact/escrow.json";

import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, getMint } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { randomBytes } from "crypto";
export default function useEscrowProgram() {
    const provider = useAnchorProvider();
    const { publicKey } = useWallet();

    const program = new Program<Escrow>(idl as Escrow, provider);

    const isToken2022 = async (mint: PublicKey) => {
        const mintInfo = await provider.connection.getAccountInfo(mint);
        return mintInfo?.owner.equals(TOKEN_2022_PROGRAM_ID);
    };

    const getMintInfo = async (mint: PublicKey) => {
        const tokenProgram = (await isToken2022(mint))
            ? TOKEN_2022_PROGRAM_ID
            : TOKEN_PROGRAM_ID;

        return getMint(provider.connection, mint, undefined, tokenProgram);
    };

    const getEscrowInfo = async (escrow: PublicKey) => {
        return program.account.escrow.fetch(escrow);
    };

    const getEscrowAccounts = async () => {
        const responces = await program.account.escrow.all();
        return responces.sort((a, b) => a.account.seed.cmp(b.account.seed));
    }

    const makeNewEscrow = async ({
        mint_a,
        mint_b,
        deposit,
        receive,
    }: {
        mint_a: string;
        mint_b: string;
        deposit: number;
        receive: number;
    }, cb?: (pubkey: PublicKey, deposit: number) => void) => {

        if (!publicKey) return;
        const seed = new BN(randomBytes(8));
        const tokenProgram = (await isToken2022(new PublicKey(mint_a)))
            ? TOKEN_2022_PROGRAM_ID
            : TOKEN_PROGRAM_ID;

        const makerAtaA = getAssociatedTokenAddressSync(
            new PublicKey(mint_a),
            publicKey,
            false,
            tokenProgram
        );

        const [escrow] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("escrow"),
                publicKey.toBuffer(),
                seed.toArrayLike(Buffer, "le", 8),
            ],
            program.programId
        );

        if (cb) {
            cb(escrow, deposit);
        }

        const vault = getAssociatedTokenAddressSync(
            new PublicKey(mint_a),
            escrow,
            true,
            tokenProgram
        );

        const mintAInfo = await getMintInfo(new PublicKey(mint_a));
        const mintAAmount = new BN(deposit).mul(
            new BN(10).pow(new BN(mintAInfo.decimals))
        );
        const mintBInfo = await getMintInfo(new PublicKey(mint_b));
        const mintBAmount = new BN(receive).mul(
            new BN(10).pow(new BN(mintBInfo.decimals))
        );

        return program.methods
            .make(seed, mintAAmount, mintBAmount)
            .accounts({
                maker: publicKey,
                mintA: new PublicKey(mint_a),
                mintB: new PublicKey(mint_b),
                makerAtaA,
                vault,
                tokenProgram,
            })
            .rpc();
    }

    const takeEscrow = async (escrow: PublicKey) => {
        if (!publicKey) return;
        const escrowAccount = await getEscrowInfo(escrow);
        const tokenProgram = (await isToken2022(escrowAccount.mintA))
            ? TOKEN_2022_PROGRAM_ID
            : TOKEN_PROGRAM_ID;
        const vault = getAssociatedTokenAddressSync(
            new PublicKey(escrowAccount.mintA),
            escrow,
            true,
            tokenProgram
        );

        const makerAtaB = getAssociatedTokenAddressSync(
            new PublicKey(escrowAccount.mintB),
            escrowAccount.maker,
            false,
            tokenProgram
        );

        const takerAtaA = getAssociatedTokenAddressSync(
            new PublicKey(escrowAccount.mintA),
            publicKey,
            false,
            tokenProgram
        );

        const takerAtaB = getAssociatedTokenAddressSync(
            new PublicKey(escrowAccount.mintB),
            publicKey,
            false,
            tokenProgram
        );

        return program.methods
            .take()
            .accountsPartial({
                maker: escrowAccount.maker,
                taker: publicKey,
                mintA: new PublicKey(escrowAccount.mintA),
                mintB: new PublicKey(escrowAccount.mintB),
                makerAtaB,
                takerAtaA,
                takerAtaB,
                escrow,
                tokenProgram,
                vault,
            })
            .rpc();
    }


    return {
        program,
        makeNewEscrow,
        getEscrowAccounts,
        getEscrowInfo,
        getMintInfo,
        takeEscrow
    };

}