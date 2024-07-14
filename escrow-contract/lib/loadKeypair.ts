import fs from 'fs';
import { Keypair } from '@solana/web3.js';

export function loadKeypairFromFile(filePath: string): Keypair {
    const secretKeyString = fs.readFileSync(filePath, 'utf-8');
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
}

export function loadTokenAKeyPair(): Keypair {
    return loadKeypairFromFile('./test_keypair/TokenA.json');
}


export function loadTokenBKeyPair(): Keypair {
    return loadKeypairFromFile('./test_keypair/TokenB.json');
}
