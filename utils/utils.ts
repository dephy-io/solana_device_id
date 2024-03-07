import { Keypair } from "@solana/web3.js";
import fs from "fs"

export function loadKeypair(jsonPath: string): Keypair {
    return Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(jsonPath).toString())));
}

export function numberToUnit8Array(number: number): Uint8Array {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setBigInt64(0, BigInt(number), false);
    return new Uint8Array(buffer);
}