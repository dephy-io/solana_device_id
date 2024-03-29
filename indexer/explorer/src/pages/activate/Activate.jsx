import * as ethUtil from "@ethereumjs/util";
import { randomBytes } from "@ethersproject/random";
import { keccak256 } from "ethereum-cryptography/keccak.js";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Space, Button, Input, theme } from "antd";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { initProgram, useDeviceProgram } from "../../hooks/useDeviceProgram";

function numberToUnit8Array(number) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setBigInt64(0, BigInt(number), false);
  return new Uint8Array(buffer);
}

export default function Activate() {
  const [devicePubKey, setDevicePubKey] = useState("");

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

  const { connection } = useConnection();
  // const program = useDeviceProgram();
  const _program_addr = localStorage.getItem("_program_addr");
  console.log("_program_addr: ", _program_addr);
  const program = initProgram(_program_addr);

  // Activate Device
  async function onActivateDevice() {
    console.log(/Activate/);

    const _priv_key = randomBytes(32);
    const _publicKey = ethUtil.privateToPublic(_priv_key);

    const slot = await connection.getSlot();
    const msgTime = await connection.getBlockTime(slot);

    const hashedMsgForActivation = keccak256(numberToUnit8Array(msgTime));

    const { r, s, v } = ethUtil.ecsign(hashedMsgForActivation, _priv_key);
    const signature = Uint8Array.from([...r, ...s]);
    const recoveryId = Number(ethUtil.calculateSigRecovery(v));

    const devicePk = devicePubKey;

    try {
      await program.methods
        .activateDevice({
          publicKey: Array.from(_publicKey),
          message: Buffer.from(numberToUnit8Array(msgTime)),
          signature: Array.from(signature),
          recoveryId: recoveryId,
        })
        .accounts({
          device: devicePk,
        })
        .rpc();
      toast("activate device successful");
    } catch (error) {
      toast.error("activate device error");
      console.error(error);
    }
  }

  const onChangeHandler = (e) => {
    const val = e.target.value;
    setDevicePubKey(val);
    console.log("Change:", val);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div style={contentStyle}>
        <section style={{ paddingTop: "5px" }}>
          <Toaster position="top-center" />

          <Space.Compact
            style={{
              width: "100%",
              marginTop: "10px",
            }}
          >
            <Input
              type="text"
              placeholder="device public key"
              onChange={onChangeHandler}
            />
          </Space.Compact>

          <Button
            type="primary"
            style={{ marginTop: "10px" }}
            onClick={onActivateDevice}
          >
            Activate Device
          </Button>
        </section>
      </div>
    </div>
  );
}
