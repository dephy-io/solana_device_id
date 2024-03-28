import toast, { Toaster } from 'react-hot-toast';
import { Button, Divider, Input, Alert } from "antd";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, Keypair, PublicKey } from "@solana/web3.js";
import { initProgram, useDeviceProgram } from "../../hooks/useDeviceProgram";
import * as anchor from "@coral-xyz/anchor";

import adminKey from "../../keypairs/admin.json";
import treasuryKey from "../../keypairs/treasury.json";
import adminAuthorityKey from "../../keypairs/admin-authority.json";
import vendorAuthorityKey from "../../keypairs/vendor-authority.json";

export function loadKeypair(keyData) {
  return Keypair.fromSecretKey(new Uint8Array(keyData));
}

const admin = loadKeypair(adminKey);
// const treasury = loadKeypair(treasuryKey);
// const adminAuthority = loadKeypair(adminAuthorityKey);
const vendorAuthority = loadKeypair(vendorAuthorityKey);

export default function ThirdStep() {
 const _program_addr = localStorage.getItem("_program_addr")
 const program = initProgram(_program_addr);

  const [vendorName, setVendorName] = useState("");

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

  const onCreateVendor = async () => {
    try {
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

      toast('CreateVendor success');
    } catch (err) {
      toast.error('CreateVendor error');
      console.error("CreateVendor error:", err);
    }
  };

  const onChangeHandler = (e) => {
    const val = e.target.value;
    setVendorName(val);
    console.log("Change:", val);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <section style={{ paddingTop: "5px" }}>
        <Toaster position="top-center" />

        <Input type="text" onChange={onChangeHandler} placeholder="vendor name"/>

        <Button
          type="primary"
          style={{ marginTop: "16px" }}
          onClick={onCreateVendor}
        >
          Create Vendor
        </Button>
      </section>
    </div>
  );
}
