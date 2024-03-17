import * as anchor from "@coral-xyz/anchor";
import * as dotenv from "dotenv";
import fs from "fs";
import { PROGRAM_ID, activateDeviceIx, createDeviceAndDidIx, createProductCollectionIx, createVendorIx, initializeAdminIx, initializeGlobalIx, sendLegacyTranction, sendLegacyTranctionProvider } from "./device-did-ft";
import { airdropAndComfirm, loadKeypair, numberToUnit8Array } from "../utils/utils";
import { DeviceDid } from "../target/types/device_did";
import * as ethUtil from "@ethereumjs/util";
import { keccak256 } from "ethereum-cryptography/keccak.js";
dotenv.config();

async function deviceDidRun() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const idl = JSON.parse(fs.readFileSync("./target/idl/device_did.json", "utf-8"));
    let program: anchor.Program<DeviceDid>;
    program = new anchor.Program(idl, PROGRAM_ID);

    const adminKey = loadKeypair("./keypairs/admin.json");
    const treasury = loadKeypair("./keypairs/treasury.json");
    const adminAuthority = loadKeypair("./keypairs/admin-authority.json");
    const vendorAuthority = loadKeypair("./keypairs/vendor-authority.json");
    const device = loadKeypair("./keypairs/device.json");
    const vendorName = "IO Company";
    const productName = "Computer";

    await airdropAndComfirm(provider.connection, vendorAuthority.publicKey, 10);
    console.log(`Vendor airdrop success.`);

    await sendLegacyTranctionProvider(
        provider.connection,
        provider,
        [
            await initializeAdminIx(
                program,
                adminKey.publicKey,
                adminAuthority.publicKey,
                treasury.publicKey,
                provider.publicKey,
            )
        ],
    );
    console.log(`Initialize admin success.`)

    // Assume reg fee is 0.05 SOL
    const regFee = anchor.web3.LAMPORTS_PER_SOL * 0.05;
    await sendLegacyTranctionProvider(
        provider.connection,
        provider,
        [
            await initializeGlobalIx(
                program,
                regFee,
                provider.publicKey,
                adminKey.publicKey,
            )
        ],
        [adminKey],
    );
    console.log(`Initialize global success.`);

    await sendLegacyTranction(
        provider.connection,
        vendorAuthority,
        [
            await createVendorIx(
                program,
                vendorName,
                vendorAuthority.publicKey,
                vendorAuthority.publicKey,
                adminKey.publicKey,
            )
        ],
        [adminKey],
    );
    console.log(`Create vendor success.`);

    await sendLegacyTranction(
        provider.connection,
        vendorAuthority,
        [
            await createProductCollectionIx(
                program,
                productName,
                vendorAuthority.publicKey,
                vendorAuthority.publicKey,
            )
        ],
    );
    console.log(`Create product collection success.`);

    // The info of the device
    const deviceName = "Banana";
    const serialNum = "123456789";
    await sendLegacyTranction(
        provider.connection,
        vendorAuthority,
        [
            await createDeviceAndDidIx(
                program,
                deviceName,
                serialNum,
                vendorAuthority.publicKey,
                vendorAuthority.publicKey,
                productName,
                device.publicKey,
                treasury.publicKey
            )
        ],
        [device]
    );
    console.log(`Create device and did success.`);

    // The info of activation
    const privateKey = ethUtil.hexToBytes("0x1111111111111111111111111111111111111111111111111111111111111111");
    const publicKey = ethUtil.privateToPublic(privateKey);

    const slot = await provider.connection.getSlot();
    const messageTime = await provider.connection.getBlockTime(slot);
    const hashedMessageForActivation = keccak256(numberToUnit8Array(messageTime));

    const { r, s, v } = ethUtil.ecsign(hashedMessageForActivation, privateKey);
    const signature = Uint8Array.from([...r, ...s]);
    const recoveryId = Number(ethUtil.calculateSigRecovery(v));

    await sendLegacyTranctionProvider(
        provider.connection,
        provider,
        [
            await activateDeviceIx(
                program,
                publicKey,
                messageTime,
                signature,
                recoveryId,
                device.publicKey,
            )
        ],
    );
    console.log(`Activate device success.`);
}

deviceDidRun();