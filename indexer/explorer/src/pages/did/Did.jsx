import React from "react";
import { useState, useEffect } from 'react';
import { Space, Table } from 'antd';
import axios from 'axios';
import { DateTime } from 'luxon'

import "./did.css";

const getDids = async () => {
  const BASE_URL = process.env.REACT_APP_API_ENDPOINT

  const headers = {
    "content-type": "application/json",
  };

  const queryStr = `query
  {
    accounts(types: ["Did"]) {
      name
      type
      address
      data {
        __typename
        ... on Did {
          name
          serialNum
          mintAt
          owner
        }
      }
    }
  }`

  const graphqlQuery = {
    // "operationName": "",
    "query": queryStr,
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
  console.log(/Did/)

  const [dids, setDids] = useState([])

  useEffect(() => {
    getDids().then((resp)=>{
      setDids(resp)
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
      title: 'Did Name',
      dataIndex: ["data", "name"],
    },
    {
      title: 'Serial Num',
      dataIndex: ["data", "serialNum"],
    },
    {
      title: 'Time',
      dataIndex: ["data", "mintAt"],
      render: (text) =><span>{ DateTime.fromMillis(parseInt(text)).toFormat("yyyy-MM-dd HH:mm:ss") }</span> ,
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
    <Table columns={columns} dataSource={dids} />
    </>
  )
}
