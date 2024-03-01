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

  const program = anchor.workspace.DeviceDid as Program<DeviceDid>;

  it.skip("Is initialized!", async () => {
  });

  it("Initialize Admin", async () => {
    const signer = provider.wallet;

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

});
