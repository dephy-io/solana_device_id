import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Layout } from "antd";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

import MainHeader from "./components/Header/Header";
import MainFooter from "./components/Footer/Footer";

import InitSteps from "./pages/init/InitSteps";
import Account from "./pages/account/Account";
import Device from "./pages/device/Device";
import Did from "./pages/did/Did";
import Event from "./pages/event/Event";
import Activate from "./pages/activate/Activate";

import("@solana/wallet-adapter-react-ui/styles.css");

const DEFAULT_NETWORK = WalletAdapterNetwork.Devnet;

function App() {
  const [network, setNetwork] = useState(DEFAULT_NETWORK);
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <Layout>
              <MainHeader network={network} onChangeNetwork={setNetwork} />
              <div style={{minHeight: `calc(100vh - 130px)`}}>
                <Routes>
                  <Route path="/" element={<InitSteps/>}></Route>
                  <Route path="/steps" element={<InitSteps />}></Route>
                  <Route path="/account" element={<Account />}></Route>
                  <Route path="/device" element={<Device />}></Route>
                  <Route path="/did" element={<Did />}></Route>
                  <Route path="/event" element={<Event />}></Route>
                  <Route path="/activate" element={<Activate />}></Route>
                </Routes>
              </div>
              <MainFooter />
            </Layout>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
