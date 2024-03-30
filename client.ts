import crypto from "crypto";
import { BN } from "bn.js";
import * as anchor from "@coral-xyz/anchor";
import { Program, Idl } from "@coral-xyz/anchor";
import { loadKeypair, numberToUnit8Array } from "./utils/utils";
import * as ethUtil from "@ethereumjs/util";
import { keccak256 } from "ethereum-cryptography/keccak.js";
// import { DeviceDid } from "./target/types/device_did";
import { faker } from "@faker-js/faker";
import { PublicKey } from "@solana/web3.js";

import idl from "./target/idl/device_did.json";

const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay));

// export ANCHOR_WALLET=~/.config/solana/id.json

const devrpc =
  "https://devnet.helius-rpc.com/?api-key=f09e577b-9aa2-4c98-9dc4-f118125911a4";

const devshyftrpc = "https://devnet-rpc.shyft.to?api_key=jhm3z5ibTMM0MKQS"

const localrpc = "http://127.0.0.1:8899";

const provider = anchor.AnchorProvider.local(devrpc);
anchor.setProvider(provider);

// const addr = "1234WPYMnkT2bx5MB3uLmixeDuaCHDpd3mXNhZGimKWg";
const addr = "HfGKV9XahQVGGVUcL9aMaUitaC2VEjGeDcdJESnLTjE4";

const programId = new PublicKey(addr);

const program = new Program(idl as Idl, programId, provider);
// const program = anchor.workspace.DeviceDid as Program<DeviceDid>;

const admin = loadKeypair("./keypairs/admin.json");
const treasury = loadKeypair("./keypairs/treasury.json");
const adminAuthority = loadKeypair("./keypairs/admin-authority.json");
const vendorAuthority = loadKeypair("./keypairs/vendor-authority.json");

const vendorName = "IO Company";
// const productName = "Computer";
const productName = "dephy";

// Assume reg fee is 0.05 SOL
const regFee = anchor.web3.LAMPORTS_PER_SOL * 0.05;

// PDA for admin
const [adminPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("admin")],
  program.programId
);

// PDA for global
const [globalPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("global")],
  program.programId
);

// PDA for vendor
const [vendorPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("vendor"), vendorAuthority.publicKey.toBytes()],
  program.programId
);

// PDA for product
const [productPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  [
    Buffer.from("product"),
    Buffer.from(productName),
    vendorAuthority.publicKey.toBytes(),
  ],
  program.programId
);

async function airdrop(num) {
  console.log(`airdrop ${num}`);

  await provider.connection.requestAirdrop(
    vendorAuthority.publicKey,
    anchor.web3.LAMPORTS_PER_SOL * num
  );
}

async function init() {
  // await airdrop(1000);

  const adminPdaAddr = adminPDA.toBase58();
  console.log("adminPdaAddr: ", adminPdaAddr);
  // DuJehRgE69dJ6GDSYWuNKLSDs431R8tBiueyvuFAhs6G

  // Initialize Admin
  await program.methods
    .initializeAdmin({
      admin: admin.publicKey,
      authority: adminAuthority.publicKey,
      treasury: treasury.publicKey,
    })
    .accounts({
      admin: adminPDA,
    })
    .rpc();
  console.log(/initializeAdmin/);

  await sleep(1000 * 5);

  // Initialize Global
  console.log(/initializeGlobal/);
  await program.methods
    .initializeGlobal({
      regFee: new BN(regFee),
    })
    .accounts({
      admin: adminPDA,
      adminKey: admin.publicKey,
      global: globalPDA,
    })
    .signers([admin])
    .rpc();

  await sleep(1000 * 5);

  // Create Vendor
  console.log(/createVendor/);
  await program.methods
    .createVendor({
      name: vendorName,
      authority: vendorAuthority.publicKey,
    })
    .accounts({
      payer: vendorAuthority.publicKey,
      global: globalPDA,
      adminKey: admin.publicKey,
      vendor: vendorPDA,
    })
    .signers([vendorAuthority, admin])
    .rpc();

  await sleep(1000 * 5);

  // Create ProductCollection
  console.log(/createProductCollection/);
  await program.methods
    .createProductCollection({
      name: productName,
    })
    .accounts({
      payer: vendorAuthority.publicKey,
      vendor: vendorPDA,
      vendorAuthority: vendorAuthority.publicKey,
      global: globalPDA,
      product: productPDA,
    })
    .signers([vendorAuthority])
    .rpc();

  await sleep(1000 * 5);
}

// 注册设备
async function registerDevice() {
  console.log(/register Device /);
  const device = anchor.web3.Keypair.generate();
  const deviceAddr = device.publicKey.toString();

  console.log("deviceAddr: ", deviceAddr);

  // PAD for device did
  const [deviceDidPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("did"), device.publicKey.toBytes()],
    program.programId
  );

  const deviceName = faker.company.name();
  console.log("deviceName: ", deviceName);

  // faker.string.uuid()
  // faker.number.int()
  const serialNum = faker.number.int().toString();
  console.log("serialNum: ", serialNum);

  const mintAt = Date.now();

  await program.methods
    .createDeviceAndDid({
      name: deviceName,
      serialNum: serialNum,
      mintAt: new BN(mintAt),
    })
    .accounts({
      payer: vendorAuthority.publicKey,
      vendor: vendorPDA,
      vendorAuthority: vendorAuthority.publicKey,
      product: productPDA,
      device: device.publicKey,
      deviceDid: deviceDidPDA,
      treasury: treasury.publicKey,
      admin: adminPDA,
      global: globalPDA,
    })
    .signers([vendorAuthority, device])
    .rpc();

  // check treasury add 0.05 sol
  const treasuryInfo = await provider.connection.getAccountInfo(
    treasury.publicKey
  );
  console.log(`The lamport amount of treasury is: ${treasuryInfo.lamports}`);

  // activate(device.publicKey);
}

// Activate Device
async function activate(devicePk: PublicKey) {
  const _priv_key = crypto.randomBytes(32);

  // const privateKey = ethUtil.hexToBytes("0x1111111111111111111111111111111111111111111111111111111111111111");
  const publicKey = ethUtil.privateToPublic(_priv_key);
  const addr = ethUtil.privateToAddress(_priv_key);
  const ethAddr = ethUtil.bytesToHex(addr);

  console.log("ethAddr: ", ethAddr);

  const slot = await provider.connection.getSlot();
  const messageTime = await provider.connection.getBlockTime(slot);

  const hashedMessageForActivation = keccak256(numberToUnit8Array(messageTime));
  const { r, s, v } = ethUtil.ecsign(hashedMessageForActivation, _priv_key);
  const signature = Uint8Array.from([...r, ...s]);
  const recoveryId = Number(ethUtil.calculateSigRecovery(v));

  await program.methods
    .activateDevice({
      publicKey: Array.from(publicKey),
      message: Buffer.from(numberToUnit8Array(messageTime)),
      signature: Array.from(signature),
      recoveryId: recoveryId,
    })
    .accounts({
      device: devicePk,
    })
    .rpc();

  console.log(/Activate/);
}

async function main() {
  let num = 0;

  for (;;) {
    num += 1;
    console.log(`num ${num}`);
    registerDevice();
    await sleep(1000 * 10);
    console.log("-".repeat(50));
  }
}

// init();

main();
