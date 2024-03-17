import * as web3 from "@solana/web3.js";
import { DeviceDid } from "../target/types/device_did";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { BN } from "bn.js";
import { numberToUnit8Array } from "../utils/utils";

export const PROGRAM_ID = new web3.PublicKey(
    "1234WPYMnkT2bx5MB3uLmixeDuaCHDpd3mXNhZGimKWg"
);

const adminPdaAddress = (
    programID: web3.PublicKey = PROGRAM_ID,
) =>
    web3.PublicKey.findProgramAddressSync([Buffer.from("admin")], programID);

const globalPdaAddress = (
    programID: web3.PublicKey = PROGRAM_ID,
) =>
    web3.PublicKey.findProgramAddressSync([Buffer.from("global")], programID);

const vendorPdaAddress = (
    vendorAuthority: web3.PublicKey,
    programID: web3.PublicKey = PROGRAM_ID,
) =>
    web3.PublicKey.findProgramAddressSync([Buffer.from("vendor"), vendorAuthority.toBytes()], programID);

const productPdaAddress = (
    productName: string,
    vendorAuthority: web3.PublicKey,
    programID: web3.PublicKey = PROGRAM_ID,
) =>
    web3.PublicKey.findProgramAddressSync(
        [
            Buffer.from("product"),
            Buffer.from(productName),
            vendorAuthority.toBytes(),
        ], programID)

const deviceDidPdaAddress = (
    device: web3.PublicKey,
    programID: web3.PublicKey = PROGRAM_ID,
) =>
    web3.PublicKey.findProgramAddressSync([Buffer.from("did"), device.toBytes()], programID);

export function initializeAdminIx(
    program: Program<DeviceDid>,
    admin: web3.PublicKey,
    adminAuthority: web3.PublicKey,
    treasury: web3.PublicKey,
    payer: web3.PublicKey,
): Promise<web3.TransactionInstruction> {
    const [adminPDA] = adminPdaAddress();
    return program.methods
        .initializeAdmin({
            admin: admin,
            authority: adminAuthority,
            treasury: treasury,
        })
        .accounts({
            payer: payer,
            admin: adminPDA
        })
        .instruction();
}

export function initializeGlobalIx(
    program: Program<DeviceDid>,
    regFee: number,
    payer: web3.PublicKey,
    admin: web3.PublicKey,
): Promise<web3.TransactionInstruction> {
    const [adminPDA] = adminPdaAddress();
    const [globalPDA] = globalPdaAddress();
    return program.methods
        .initializeGlobal({
            regFee: new BN(regFee),
        })
        .accounts({
            payer: payer,
            admin: adminPDA,
            adminKey: admin,
            global: globalPDA,
        })
        .instruction();
}

export function createVendorIx(
    program: Program<DeviceDid>,
    vendorName: string,
    vendorAuthority: web3.PublicKey,
    payer: web3.PublicKey,
    admin: web3.PublicKey,
): Promise<web3.TransactionInstruction> {
    const [globalPDA] = globalPdaAddress();
    const [vendorPDA] = vendorPdaAddress(vendorAuthority);
    return program.methods
        .createVendor({
            name: vendorName,
            authority: vendorAuthority,
        })
        .accounts({
            payer: payer,
            global: globalPDA,
            adminKey: admin,
            vendor: vendorPDA,
        })
        .instruction();
}

export function createProductCollectionIx(
    program: Program<DeviceDid>,
    productName: string,
    payer: web3.PublicKey,
    vendorAuthority: web3.PublicKey,
): Promise<web3.TransactionInstruction> {
    const [vendorPDA] = vendorPdaAddress(vendorAuthority);
    const [globalPDA] = globalPdaAddress();
    const [productPDA] = productPdaAddress(productName, vendorAuthority);
    return program.methods
        .createProductCollection({
            name: productName,
        })
        .accounts({
            payer: payer,
            vendor: vendorPDA,
            vendorAuthority: vendorAuthority,
            global: globalPDA,
            product: productPDA,
        })
        .instruction();
}

export function createDeviceAndDidIx(
    program: Program<DeviceDid>,
    deviceName: string,
    serialNum: string,
    payer: web3.PublicKey,
    vendorAuthority: web3.PublicKey,
    productName: string,
    device: web3.PublicKey,
    treasury: web3.PublicKey,
): Promise<web3.TransactionInstruction> {
    const [vendorPDA] = vendorPdaAddress(vendorAuthority);
    const [productPDA] = productPdaAddress(productName, vendorAuthority);
    const [deviceDidPDA] = deviceDidPdaAddress(device);
    const [adminPDA] = adminPdaAddress();
    const [globalPDA] = globalPdaAddress();
    return program.methods
        .createDeviceAndDid({
            name: deviceName,
            serialNum: serialNum,
            mintAt: new BN(Date.now()),
        })
        .accounts({
            payer: payer,
            vendor: vendorPDA,
            vendorAuthority: vendorAuthority,
            product: productPDA,
            device: device,
            deviceDid: deviceDidPDA,
            treasury: treasury,
            admin: adminPDA,
            global: globalPDA,
        })
        .instruction();
}

export function activateDeviceIx(
    program: Program<DeviceDid>,
    publicKey: Uint8Array,
    messageTime: number,
    signature: Uint8Array,
    recoveryId: number,
    device: web3.PublicKey,
): Promise<web3.TransactionInstruction> {
    return program.methods
        .activateDevice({
            publicKey: Array.from(publicKey),
            message: Buffer.from(numberToUnit8Array(messageTime)),
            signature: Array.from(signature),
            recoveryId: recoveryId,
        })
        .accounts({
            device: device,
        })
        .instruction();
}

async function sendV0Transaction(
    connection: web3.Connection,
    user: web3.Keypair,
    instructions: web3.TransactionInstruction[],
    lookupTableAccounts?: web3.AddressLookupTableAccount[],
) {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    const messageV0 = new web3.TransactionMessage({
        payerKey: user.publicKey,
        recentBlockhash: blockhash,
        instructions,
    }).compileToV0Message(lookupTableAccounts ? lookupTableAccounts : undefined);
    const tranction = new web3.VersionedTransaction(messageV0);
    tranction.sign([user]);
    const txid = await connection.sendTransaction(tranction);
    await connection.confirmTransaction(
        {
            blockhash: blockhash,
            lastValidBlockHeight: lastValidBlockHeight,
            signature: txid,
        },
        "finalized"
    );
    console.log(`https://explorer.solana.com/tx/${txid}?cluster=devnet`);
}

export async function sendLegacyTranctionProvider(
    connection: web3.Connection,
    provider: AnchorProvider,
    instructions: web3.TransactionInstruction[],
    otherSigner?: web3.Keypair[],
) {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    const message = new web3.TransactionMessage({
        payerKey: provider.publicKey,
        recentBlockhash: blockhash,
        instructions,
    }).compileToLegacyMessage();
    let tranction = new web3.VersionedTransaction(message);
    tranction = await provider.wallet.signTransaction(tranction);
    if (otherSigner) {
        tranction.sign(otherSigner);
    }
    const txid = await connection.sendTransaction(tranction);
    await connection.confirmTransaction(
        {
            blockhash: blockhash,
            lastValidBlockHeight: lastValidBlockHeight,
            signature: txid,
        },
        "finalized"
    );
}

export async function sendLegacyTranction(
    connection: web3.Connection,
    payer: web3.Keypair,
    instructions: web3.TransactionInstruction[],
    otherSigner?: web3.Keypair[],
) {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    const message = new web3.TransactionMessage({
        payerKey: payer.publicKey,
        recentBlockhash: blockhash,
        instructions,
    }).compileToLegacyMessage();
    const tranction = new web3.VersionedTransaction(message);
    const signers = otherSigner ? [payer, ...otherSigner] : [payer];
    tranction.sign(signers);
    const txid = await connection.sendTransaction(tranction);
    await connection.confirmTransaction(
        {
            blockhash: blockhash,
            lastValidBlockHeight: lastValidBlockHeight,
            signature: txid,
        },
        "finalized"
    );
}