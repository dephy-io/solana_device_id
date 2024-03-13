import React from "react";
import { useState, useEffect } from 'react';
import { Space, Table } from 'antd';
import axios, {isCancel, AxiosError} from 'axios';

import "./device.css";

const getDevices = async () => {
  const BASE_URL = "http://localhost:8080"

  const headers = {
    "content-type": "application/json",
  };

  const graphqlQuery = {
    // "operationName": "",
    "query": `query {accounts(types: ["Device"]) { name type address }}`,
    "variables": {},
  };

  const resp = await axios({
    url: BASE_URL,
    method: 'post',
    headers: headers,
    data: graphqlQuery
  });

  const res = resp["data"]["data"]["accounts"]
  return res
}

export default function Device() {
  console.log(/Device/)

  const [devices, setDevices] = useState([])

  useEffect(() => {
    getDevices().then((resp)=>{
      setDevices(resp)
    })
  },[]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%',
      sorter: (a, b) => a.id - b.id,
      render: (id, record, index) => { ++index; return index; },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text.slice(0, 5)}</a>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Addr',
      dataIndex: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>View {record.name.slice(0,5)}</a>
        </Space>
      ),
    },
  ];

  return (
    <>
    <Table columns={columns} dataSource={devices} />
    </>
  )
}
