import { Keypair } from "@solana/web3.js";
import fs from "fs"

export function loadKeypair(jsonPath: string): Keypair {
    return Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(jsonPath).toString())));
}