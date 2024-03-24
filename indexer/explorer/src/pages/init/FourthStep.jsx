import { Button, Divider, Input } from "antd";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, Keypair, PublicKey } from "@solana/web3.js";
import useDeviceProgram from "../../hooks/useDeviceProgram";
import * as anchor from "@coral-xyz/anchor";

import vendorAuthorityKey from "../../keypairs/vendor-authority.json";

export function loadKeypair(keyData) {
  return Keypair.fromSecretKey(new Uint8Array(keyData));
}

const vendorAuthority = loadKeypair(vendorAuthorityKey);

export default function FourthStep() {
  const program = useDeviceProgram();

  const [productName, setProductName] = useState("");

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

  const onCreateProductCollection = async () => {
    // PDA for product
    const [productPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("product"),
        Buffer.from(productName),
        vendorAuthority.publicKey.toBytes(),
      ],
      program.programId
    );

    try {
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
    } catch (err) {
      console.error("error:", err);
    }
  };

  const onChangeHandler = (e) => {
    const val = e.target.value;
    setProductName(val);
    console.log("Change:", val);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <section style={{ paddingTop: "5px" }}>
        <Input type="text" placeholder="product name" onChange={onChangeHandler} />

        <Button
          type="primary"
          style={{ marginTop: "16px" }}
          onClick={onCreateProductCollection}
        >
          Create ProductCollection
        </Button>
      </section>
    </div>
  );
}
