import React from "react";
import { useState, useEffect } from "react";
import { Input, Button, theme } from "antd";
import toast, { Toaster } from "react-hot-toast";

import "./program.css";

export default function Program() {
  console.log(/Program/);

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

  const [programAddr, setProgramAddr] = useState("");

  useEffect(() => {}, []);

  const onChangeHandler = (e) => {
    const val = e.target.value;
    setProgramAddr(val);
    console.log("Change:", val);
  };

  const onProgram = async () => {
    localStorage.setItem("_program_addr", programAddr);
    toast("set program address successful");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={contentStyle}>
        <section style={{ paddingTop: "5px" }}>
          <Toaster position="top-center" />
          <Input type="text" placeholder="Program" onChange={onChangeHandler} />

          <Button
            type="primary"
            style={{ marginTop: "10px" }}
            onClick={onProgram}
          >
            Program
          </Button>
        </section>
      </div>
    </div>
  );
}
