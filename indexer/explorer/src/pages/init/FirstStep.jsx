import { Button, Divider, Input } from "antd";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, Keypair, PublicKey } from "@solana/web3.js";
import useDeviceProgram from "../../hooks/useDeviceProgram";
import * as anchor from "@coral-xyz/anchor";

import adminKey from "../../keypairs/admin.json";
import treasuryKey from "../../keypairs/treasury.json";
import adminAuthorityKey from "../../keypairs/admin-authority.json";

export function loadKeypair(keyData) {
  return Keypair.fromSecretKey(new Uint8Array(keyData));
}

const admin = loadKeypair(adminKey);
const treasury = loadKeypair(treasuryKey);
const adminAuthority = loadKeypair(adminAuthorityKey);

export default function FirstStep() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const program = useDeviceProgram();

  // PDA for admin
  const [adminPDA] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("admin")],
    program.programId
  );

  const initAdmin = async () => {
    try {
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
    } catch (error) {
      console.error("initAdmin error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <section>
        <Button type="primary" onClick={initAdmin}>
          Init Admin
        </Button>
      </section>
    </div>
  );
}
