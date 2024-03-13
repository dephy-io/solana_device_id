import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Layout } from 'antd';

import MainHeader from './components/Header/Header';
import MainFooter from './components/Footer/Footer';

import Account from './pages/account/Account';
import Device from './pages/device/Device';
import Did from './pages/did/Did';

function App(props) {
  return (
    <Router>
      <Layout>
        <MainHeader />
        <Routes>
          <Route path="/account" element={<Account />}></Route>
          <Route path="/device" element={<Device />}></Route>
          <Route path="/did" element={<Did />}></Route>
        </Routes>

        {props.children}

        <MainFooter />
      </Layout>
    </Router>
  );
}

export default App;
