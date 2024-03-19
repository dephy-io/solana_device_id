import crypto from 'crypto';
import { BN } from "bn.js";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { loadKeypair, numberToUnit8Array } from "./utils/utils";
import * as ethUtil from "@ethereumjs/util";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { DeviceDid } from "./target/types/device_did";
import { faker } from '@faker-js/faker';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

// export ANCHOR_WALLET=~/.config/solana/id.json

// Configure the client to use the local cluster.
const provider = anchor.AnchorProvider.local("http://127.0.0.1:8899");
anchor.setProvider(provider);

const program = anchor.workspace.DeviceDid as Program<DeviceDid>;

const adminKey = loadKeypair("./keypairs/admin.json");
const treasury = loadKeypair("./keypairs/treasury.json");
const adminAuthority = loadKeypair("./keypairs/admin-authority.json");
const vendorAuthority = loadKeypair("./keypairs/vendor-authority.json");

const vendorName = "IO Company";
const productName = "Computer";

// Assume reg fee is 0.05 SOL
const regFee = anchor.web3.LAMPORTS_PER_SOL * 0.05;

// PDA for admin
const [adminPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("admin")],
  program.programId,
)

// PDA for global
const [globalPDA, ] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("global")],
  program.programId,
)

// PDA for vendor
const [vendorPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("vendor"), vendorAuthority.publicKey.toBytes()],
  program.programId,
)

// PDA for product
const [productPDA] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("product"), Buffer.from(productName), vendorAuthority.publicKey.toBytes()],
  program.programId,
)

async function airdrop(num) {
  console.log(`airdrop ${num}`);

  await provider.connection.requestAirdrop(
    vendorAuthority.publicKey,
    anchor.web3.LAMPORTS_PER_SOL * num,
  );

}

async function goready() {
  await airdrop(1000);

  const adminPDAAddr = adminPDA.toBase58();
  console.log("adminPDAAddr: ", adminPDAAddr);

  // Initialize Admin
  await program.methods
    .initializeAdmin({
      admin: adminKey.publicKey,
      authority: adminAuthority.publicKey,
      treasury: treasury.publicKey,
    })
    .accounts({
      admin: adminPDA,
    })
    .rpc();
    console.log(/initializeAdmin/);

  // Initialize Global
  console.log(/initializeGlobal/);
  await program.methods.initializeGlobal({
      regFee: new BN(regFee),
    })
    .accounts({
      admin: adminPDA,
      adminKey: adminKey.publicKey,
      global: globalPDA,
    })
    .signers([adminKey])
    .rpc();


  // Create Vendor
  console.log(/createVendor/);
  await program.methods.createVendor({
      name: vendorName,
      authority: vendorAuthority.publicKey,
    })
    .accounts({
      payer: vendorAuthority.publicKey,
      global: globalPDA,
      adminKey: adminKey.publicKey,
      vendor: vendorPDA,
    })
    .signers([vendorAuthority, adminKey])
    .rpc();


  // Create ProductCollection
  console.log(/createProductCollection/);
  await program.methods.createProductCollection({
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
}

// 注册设备
async function enrollDevice() {
  const device = anchor.web3.Keypair.generate();
  const deviceAddr = device.publicKey.toString();

  console.log("deviceAddr: ", deviceAddr);

  // PAD for device did
  const [deviceDidPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("did"), device.publicKey.toBytes()],
    program.programId,
  )

  const deviceName = faker.company.name();
  console.log("deviceName: ", deviceName);

  // faker.string.uuid()
  // faker.number.int()
  const serialNum = faker.number.int().toString();
  console.log("serialNum: ", serialNum);

  const mintAt = Date.now();

  await program.methods.createDeviceAndDid({
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
    .rpc()

  // check treasury add 0.05 sol
  const treasuryInfo = await provider.connection.getAccountInfo(treasury.publicKey);
  console.log(`The lamport amount of treasury is: ${treasuryInfo.lamports}`);

  activate(device)
}

// Activate Device
async function activate(deviceKp) {
  const _priv_key = crypto.randomBytes(32)

  // const privateKey = ethUtil.hexToBytes("0x1111111111111111111111111111111111111111111111111111111111111111");
  const publicKey = ethUtil.privateToPublic(_priv_key);
  const addr = ethUtil.privateToAddress(_priv_key);
  const ethAddr = ethUtil.bytesToHex(addr);

  console.log("ethAddr: ", ethAddr);

  const slot = await provider.connection.getSlot();
  const messageTime = await provider.connection.getBlockTime(slot);

  const hashedMessageForActivation = keccak256(numberToUnit8Array(messageTime));
  const { r,s,v } = ethUtil.ecsign(hashedMessageForActivation, _priv_key);
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
      device: deviceKp.publicKey,
    })
    .rpc();

    console.log(/Activate/);
}

async function main() {
  goready()

  let num = 0

  for (;;) {
    num += 1
    console.log(`num ${num}`);
    enrollDevice()
    await sleep(2000)
    console.log("-".repeat(50));
  }
}

main()
