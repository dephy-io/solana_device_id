// import crypto from "crypto";
// import * as ethUtil from "@ethereumjs/util";
// import { ethers, utils } from "ethers";

// import { keccak256 } from "ethereum-cryptography/keccak.js";

import { BN } from "bn.js";
import toast, { Toaster } from "react-hot-toast";
import { Space, Button, Divider, Input, theme } from "antd";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, Keypair, PublicKey } from "@solana/web3.js";
import { initProgram, useDeviceProgram } from "../../hooks/useDeviceProgram";

import * as anchor from "@coral-xyz/anchor";
import { faker } from "@faker-js/faker";

import adminKey from "../../keypairs/admin.json";
import treasuryKey from "../../keypairs/treasury.json";
import adminAuthorityKey from "../../keypairs/admin-authority.json";
import vendorAuthorityKey from "../../keypairs/vendor-authority.json";

import "./activate.css";

export function loadKeypair(keyData) {
  return Keypair.fromSecretKey(new Uint8Array(keyData));
}

// export function numberToUnit8Array(number: number): Uint8Array {
//   const buffer = new ArrayBuffer(8);
//   const view = new DataView(buffer);
//   view.setBigInt64(0, BigInt(number), false);
//   return new Uint8Array(buffer);
// }

// const admin = loadKeypair(adminKey);
const treasury = loadKeypair(treasuryKey);
const vendorAuthority = loadKeypair(vendorAuthorityKey);

export default function Activate() {
  const { token } = theme.useToken();

  const contentStyle = {
    minHeight: "300px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  };

  const [deviceName, setDeviceName] = useState("");
  const [serialNum, setSerialNum] = useState("");
  const [productName, setProductName] = useState("");

  const { connection } = useConnection();
  const { publicKey } = useWallet();

  // const program = useDeviceProgram();
  const _program_addr = localStorage.getItem("_program_addr")

  console.log("_program_addr: ", _program_addr)

  const program = initProgram(_program_addr);

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

  // // Activate Device
  // async function activate(deviceKp) {
  //   const _priv_key = crypto.randomBytes(32);

  //   const publicKey = ethUtil.privateToPublic(_priv_key);
  //   const addr = ethUtil.privateToAddress(_priv_key);
  //   const ethAddr = ethUtil.bytesToHex(addr);

  //   console.log("ethAddr: ", ethAddr);

  //   const slot = await connection.getSlot();
  //   const messageTime = await connection.getBlockTime(slot);

  //   // const msgForActivation = new TextEncoder().encode(messageTime);

  //   const hashedMessageForActivation = utils.keccak256(Uint8Array.from(messageTime));

  //   const { r, s, v } = ethUtil.ecsign(hashedMessageForActivation, _priv_key);
  //   const signature = Uint8Array.from([...r, ...s]);
  //   const recoveryId = Number(ethUtil.calculateSigRecovery(v));

  //   await program.methods
  //     .activateDevice({
  //       publicKey: Array.from(publicKey),
  //       message: Buffer.from(Uint8Array.from(messageTime)),
  //       signature: Array.from(signature),
  //       recoveryId: recoveryId,
  //     })
  //     .accounts({
  //       device: deviceKp.publicKey,
  //     })
  //     .rpc();

  //   console.log(/Activate/);
  // }

  // 注册设备
  async function onRegistDevice() {
    const device = anchor.web3.Keypair.generate();
    const deviceAddr = device.publicKey.toString();

    console.log("deviceAddr: ", deviceAddr);

    // PDA for product
    const [productPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("product"),
        Buffer.from(productName),
        vendorAuthority.publicKey.toBytes(),
      ],
      program.programId
    );

    // PAD for device did
    const [deviceDidPDA] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("did"), device.publicKey.toBytes()],
      program.programId
    );

    const mintAt = Date.now();

    try {
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

      toast("regist device success");
    } catch (err) {
      toast.error("regist device error");
    }

    // check treasury add 0.05 sol
    const treasuryInfo = await connection.getAccountInfo(treasury.publicKey);
    console.log(`The lamport amount of treasury is: ${treasuryInfo.lamports}`);

    // await activate(device);
  }

  const onProductNameHandler = (e) => {
    const val = e.target.value;
    setProductName(val);
    console.log("Change:", val);
  };

  const onDeviceNameChangeHandler = (e) => {
    const val = e.target.value;

    setDeviceName(val);
    console.log("Change:", val);
  };

  const onChangeHandler = (e) => {
    const val = e.target.value;
    setSerialNum(val);
    console.log("Change:", val);
  };

  const dummyDeviceName = () => {
    const _deviceName = faker.company.name();
    setDeviceName(_deviceName);
  };

  const dummySerialNum = () => {
    const _serialNum = faker.number.int().toString();

    setSerialNum(_serialNum);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div style={contentStyle}>
        <section style={{ paddingTop: "5px" }}>
          <Toaster position="top-center" />

          <Input
            type="text"
            placeholder="productName"
            onChange={onProductNameHandler}
          />

          <Space.Compact
            style={{
              width: "100%",
              marginTop: "10px",
            }}
          >
            <Input
              type="text"
              value={deviceName}
              placeholder="deviceName"
              onChange={onDeviceNameChangeHandler}
            />

            <Button type="primary" onClick={dummyDeviceName}>
              Dummy Device Name
            </Button>
          </Space.Compact>

          <Space.Compact
            style={{
              width: "100%",
              marginTop: "10px",
            }}
          >
            <Input
              type="text"
              value={serialNum}
              placeholder="serialNum"
              onChange={onChangeHandler}
            />

            <Button type="primary" onClick={dummySerialNum}>
              Dummy Serial Num
            </Button>
          </Space.Compact>

          <Button
            type="primary"
            style={{ marginTop: "10px" }}
            onClick={onRegistDevice}
          >
            Regist Device
          </Button>
        </section>
      </div>
    </div>
  );
}
