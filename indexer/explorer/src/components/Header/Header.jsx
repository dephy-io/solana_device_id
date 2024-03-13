import React from 'react';
import { useRef, useEffect, useState } from 'react';

import { Menu, Layout } from 'antd';
import { Breadcrumb, Space, Table, Tag, theme } from 'antd';

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
      <a href="/device">
        Devices
      </a>
    ),
    key: 'device',
  },
  {
    label: (
      <a href="/did">
        Did
      </a>
    ),
    key: 'did',
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
      </Header>
  );
}
