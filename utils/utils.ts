import * as web3 from "@solana/web3.js";
import fs from "fs";

export function loadKeypair(jsonPath: string): web3.Keypair {
    return web3.Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(jsonPath).toString())));
}

export function numberToUnit8Array(number: number): Uint8Array {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setBigInt64(0, BigInt(number), false);
    return new Uint8Array(buffer);
}

export async function airdropAndComfirm(
    connection: web3.Connection,
    user: web3.PublicKey,
    solAmount: number,
) {
    const airdropSignature = await connection.requestAirdrop(
        user,
        web3.LAMPORTS_PER_SOL * solAmount,
    );
    await checkStatus(connection, airdropSignature, "Airdrop")
}

async function checkStatus(
    connection: web3.Connection,
    sig: string,
    action: string,
) {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    const status = await connection.confirmTransaction({
        signature: sig,
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight,
    }, "finalized");
    if (status.value.err) {
        throw new Error(action + "tranction failed: " + status.value.err);
    }
    console.log(action + "success: " + sig);
}