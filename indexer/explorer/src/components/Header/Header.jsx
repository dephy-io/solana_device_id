import React from 'react';
import {
  WalletMultiButton
} from "@solana/wallet-adapter-react-ui";

import { Menu, Layout } from 'antd';

const items = [
  {
    label: (
      <a href="/account">
        All Accounts
      </a>
    ),
    key: 'Account',
  },
  {
    label: (
      <a href="/did">
        Did
      </a>
    ),
    key: 'did',
  },
  {
    label: (
      <a href="/device">
        Devices
      </a>
    ),
    key: 'device',
  },
  {
    label: (
      <a href="/event">
        Event
      </a>
    ),
    key: 'event',
  },
]

export default function MainHeader() {
  const { Header } = Layout;

  return (
    <Header
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="logo">
        </div>

        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />

        <WalletMultiButton />
      </Header>
  );
}
