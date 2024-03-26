import toast, { Toaster } from 'react-hot-toast';
import { BN } from "bn.js";
import { Button, Divider, Input, Alert } from "antd";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, Keypair, PublicKey } from "@solana/web3.js";
import useDeviceProgram from "../../hooks/useDeviceProgram";
import * as anchor from "@coral-xyz/anchor";

import adminKey from "../../keypairs/admin.json";

export function loadKeypair(keyData) {
  return Keypair.fromSecretKey(new Uint8Array(keyData));
}

const admin = loadKeypair(adminKey);

export default function SecondStep() {
  const program = useDeviceProgram();

  const [fee, setFee] = useState(0.0);

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

  const initGlobal = async () => {
    const regFee = LAMPORTS_PER_SOL * parseFloat(fee);

    console.log("regFee ", regFee);
    try {
      await program.methods
        .initializeGlobal({
          regFee: new BN(regFee),
        })
        .accounts({
          admin: adminPDA,
          adminKey: admin.publicKey,
          global: globalPDA,
        })
        .rpc();

        toast('initGlobal success');

    } catch (err) {
      toast.error('initGlobal erros');
      console.error("initGlobal error:", err);
    }
  };

  const onChangeHandler = (e) => {
    const val = e.target.value;
    setFee(val);
    console.log("Change:", e.target.value);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <section style={{ paddingTop: "5px" }}>
        <Toaster position="top-center" />
        <Input type="number" suffix="Sol" placeholder="Fee" onChange={onChangeHandler} />

        <Button
          type="primary"
          onClick={initGlobal}
          style={{ marginTop: "10px" }}
        >
          Init Global
        </Button>
      </section>
    </div>
  );
}
