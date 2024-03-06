import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DeviceDid } from "../target/types/device_did";
import { loadKeypair } from "../utils/utils";
import { BN } from "bn.js";

// export ANCHOR_PROVIDER_URL="https://api.devnet.solana.com"
// export ANCHOR_WALLET=~/.config/solana/id.json

describe("device-did", () => {
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
  const [globalPDA] = anchor.web3.PublicKey.findProgramAddressSync(
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

  before(async () => {

  });

  it("Initialize Admin", async () => {
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
  });

  it("Initialize Global", async () => {
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
  });

  it("Create Vendor", async () => {
    await program.methods.createVendor({
      name: vendorName,
      authority: vendorAuthority.publicKey,
    })
      .accounts({
        global: globalPDA,
        adminKey: adminKey.publicKey,
        vendor: vendorPDA,
      })
      .signers([adminKey])
      .rpc();
  });

  it("Create ProductCollection", async () => {
    await program.methods.createProductCollection({
      name: productName,
    }).accounts({
      vendor: vendorPDA,
      vendorAuthority: vendorAuthority.publicKey,
      global: globalPDA,
      product: productPDA,
    })
      .signers([vendorAuthority])
      .rpc();
  });

  // it("Create Device", async () => {
  //   const vendor = anchor.web3.Keypair.generate();
  //   const vendor_pk = vendor.publicKey;

  //   const device = anchor.web3.Keypair.generate();
  //   const device_pk = device.publicKey;

  //   const tx = await program.methods.createDevice().accounts({
  //     payer: signer.publicKey,
  //     vendorAuthority: vendor_pk,
  //     device: device_pk,
  //     systemProgram: anchor.web3.SystemProgram.programId
  //   }).rpc();

  // });

  // it("Mint DeviceDid", async () => {

  //   const vendor = anchor.web3.Keypair.generate();
  //   const vendor_pk = vendor.publicKey;

  //   const accept_account = anchor.web3.Keypair.generate();
  //   const accept_account_pk = accept_account.publicKey;

  //   interface MintDeviceDidArgs {
  //     name: string;
  //     serialNum: string;
  //     mintAt: number; // u32
  //   }

  //   const currTime = Math.floor(Date.now() / 1000);

  //   let args: MintDeviceDidArgs = {
  //     name: "Mi Temperature and Humidity Monitor",
  //     serialNum: "11034",
  //     mintAt: currTime,
  //   }

  //   const tx = await program.methods.mintDeviceDid(args).accounts({
  //     payer: signer.publicKey,
  //     vendorAuthority: vendor_pk,
  //     acceptSol: accept_account_pk,
  //     systemProgram: anchor.web3.SystemProgram.programId
  //   }).rpc();

  // });

  // it("Activate Device", async () => {
  //   const device = anchor.web3.Keypair.generate();
  //   const device_pk = device.publicKey;

  //   const vendor = anchor.web3.Keypair.generate();
  //   const vendor_pk = vendor.publicKey;

  //   const holder = anchor.web3.Keypair.generate();
  //   const holder_pk = holder.publicKey;

  //   const tx = await program.methods.activateDevice().accounts({
  //     payer: signer.publicKey,
  //     device: device_pk ,
  //     vendorAuthority: vendor_pk,
  //     newHolder: holder_pk,
  //   }).rpc();

  // });

});
