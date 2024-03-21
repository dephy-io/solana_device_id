import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Layout } from 'antd';

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {ConnectionProvider, WalletProvider} from "@solana/wallet-adapter-react";
import {clusterApiUrl} from "@solana/web3.js";
import {WalletAdapterNetwork} from "@solana/wallet-adapter-base";
import {PhantomWalletAdapter} from "@solana/wallet-adapter-wallets";
import('@solana/wallet-adapter-react-ui/styles.css');

import MainHeader from './components/Header/Header';
import MainFooter from './components/Footer/Footer';

import Account from './pages/account/Account';
import Device from './pages/device/Device';
import Did from './pages/did/Did';
import Event from './pages/event/Event';


const DEFAULT_NETWORK = WalletAdapterNetwork.Mainnet;

function App(props) {
  const [network, setNetwork] = useState(DEFAULT_NETWORK)
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
        ],
        [network]
    );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <Layout>
              <MainHeader />
              <Routes>
                <Route path="/" element={null}></Route>
                <Route path="/account" element={<Account />}></Route>
                <Route path="/device" element={<Device />}></Route>
                <Route path="/did" element={<Did />}></Route>
                <Route path="/event" element={<Event />}></Route>

              </Routes>

              {props.children}

              <MainFooter />
            </Layout>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>

  );
}

export default App;
