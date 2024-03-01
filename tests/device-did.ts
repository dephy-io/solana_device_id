import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { DeviceDid } from "../target/types/device_did";

// export ANCHOR_PROVIDER_URL="https://api.devnet.solana.com"
// export ANCHOR_WALLET=~/.config/solana/id.json

describe("device-did", () => {
  // Configure the client to use the local cluster.
  const conn = new Connection("http://0.0.0.0:8899")

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const signer = provider.wallet;

  const program = anchor.workspace.DeviceDid as Program<DeviceDid>;

  it.skip("Is initialized!", async () => {
  });

  it("Initialize Admin", async () => {

    const admin = anchor.web3.Keypair.generate();
    const admin_pk = admin.publicKey;

    const authority = anchor.web3.Keypair.generate();
    const authority_pk = authority.publicKey;

    const treasury = anchor.web3.Keypair.generate();
    const treasury_pk = treasury.publicKey;

    interface InitializeAdminArgs {
      admin: PublicKey;
      authority: PublicKey;
      treasury: PublicKey;
    }

    let args: InitializeAdminArgs = {
      admin: admin_pk,
      authority: authority_pk,
      treasury: treasury_pk
    }

    const tx = await program.methods.initializeAdmin(args)
      .accounts({
        payer: signer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
  });

  it("Initialize Global", async () => {

    const authority = anchor.web3.Keypair.generate();
    const authority_pk = authority.publicKey;

    interface InitializeGlobalArgs {
      regFee: number; // u64
      bumpSeed: number;  // u8
      authority: PublicKey;
    }

    let args: InitializeGlobalArgs = {
      regFee: 5,
      bumpSeed: 10,
      authority: authority_pk,
    }

    const tx = await program.methods.initializeGlobal(args)
      .accounts({
        payer: signer.publicKey,
        adminKey: signer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
  });

  it("Create Vendor", async () => {
    const vendor = anchor.web3.Keypair.generate();
    const vendor_pk = vendor.publicKey;

    const service_authority = anchor.web3.Keypair.generate();
    const service_authority_pk = service_authority.publicKey;

    interface CreateVendorArgs {
      name: string;
      authority: PublicKey;
    }

    let args: CreateVendorArgs = {
      name: "benewake",
      authority: vendor_pk,
    }

    const tx = await program.methods.createVendor(args)
    .accounts({
      payer: signer.publicKey,
      serviceAuthority: service_authority_pk,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

  });


  it("Create ProductCollection", async () => {
    const vendor = anchor.web3.Keypair.generate();
    const vendor_pk = vendor.publicKey;

    interface CreateProductCollectionArgs {
      name: string;
    }

    let args: CreateProductCollectionArgs = {
      name: "Smart Agriculture Project"
    }

    const tx = await program.methods.createProductCollection(args).accounts({
      payer: signer.publicKey,
      vendorAuthority: vendor_pk,
      systemProgram: anchor.web3.SystemProgram.programId
    }).rpc();

  });

  it("Create Device", async () => {
    const vendor = anchor.web3.Keypair.generate();
    const vendor_pk = vendor.publicKey;

    const device = anchor.web3.Keypair.generate();
    const device_pk = device.publicKey;

    const tx = await program.methods.createDevice().accounts({
      payer: signer.publicKey,
      vendorAuthority: vendor_pk,
      device: device_pk,
      systemProgram: anchor.web3.SystemProgram.programId
    }).rpc();

  });

  it("Mint DeviceDid", async () => {

    const vendor = anchor.web3.Keypair.generate();
    const vendor_pk = vendor.publicKey;

    const accept_account = anchor.web3.Keypair.generate();
    const accept_account_pk = accept_account.publicKey;

    interface MintDeviceDidArgs {
      name: string;
      serialNum: string;
      mintAt: number; // u32
    }

    const currTime = Math.floor(Date.now() / 1000);

    let args:MintDeviceDidArgs = {
      name: "Mi Temperature and Humidity Monitor",
      serialNum: "11034",
      mintAt: currTime,
    }

    const tx = await program.methods.mintDeviceDid(args).accounts({
      payer: signer.publicKey,
      vendorAuthority: vendor_pk,
      acceptSol: accept_account_pk ,
      systemProgram: anchor.web3.SystemProgram.programId
    }).rpc();

  });

});
