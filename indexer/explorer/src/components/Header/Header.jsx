import React from "react";
import { Menu, Layout, Select } from "antd";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const items = [
  {
    label: <a href="/">Program</a>,
    key: "program",
  },
  {
    label: <a href="/steps">Initialize</a>,
    key: "init",
  },
  {
    label: <a href="/register">Register Device</a>,
    key: "register",
  },
  {
    label: <a href="/activate">Activate Device</a>,
    key: "activate",
  },
  {
    label: <a href="/account">All Accounts</a>,
    key: "Account",
  },
  {
    label: <a href="/did">Did</a>,
    key: "did",
  },
  {
    label: <a href="/device">Devices</a>,
    key: "device",
  },
  {
    label: <a href="/event">Event</a>,
    key: "event",
  },
];

export default function MainHeader({ network, onChangeNetwork }) {
  const { Header } = Layout;

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="logo"></div>

      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        items={items}
        style={{
          flex: 1,
          minWidth: 0,
        }}
      />
      <Select
        defaultValue={network}
        value={network}
        style={{ width: 120, height: 50, marginRight: 20 }}
        onChange={onChangeNetwork}
        options={[
          { value: WalletAdapterNetwork.Devnet, label: "Devnet" },
          { value: WalletAdapterNetwork.Mainnet, label: "Mainnet" },
          { value: WalletAdapterNetwork.Testnet, label: "Testnet" },
        ]}
      />
      <WalletMultiButton />
    </Header>
  );
}
