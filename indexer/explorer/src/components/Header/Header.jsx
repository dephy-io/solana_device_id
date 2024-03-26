import React from "react";
import { Menu, Layout, Select } from "antd";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const items = [
  {
    label: <a href="/">Initialize</a>,
    key: "Init",
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
  {
    label: <a href="/activate">Activate Device</a>,
    key: "activate",
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
