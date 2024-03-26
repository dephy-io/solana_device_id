import React from "react";
import { useState, useEffect } from "react";
import { Space, Table } from "antd";
import axios from "axios";

import "./event.css";

const getEvents = async () => {
  const BASE_URL = process.env.REACT_APP_API_ENDPOINT;

  const headers = {
    "content-type": "application/json",
  };

  const adminPdaAddr = "DuJehRgE69dJ6GDSYWuNKLSDs431R8tBiueyvuFAhs6G";

  const queryStr = `query {
    events(account: "${adminPdaAddr}") {
      id
      timestamp
      type
      account
      signer
    }
  }`;

  const graphqlQuery = {
    // "operationName": "",
    query: queryStr,
    variables: {},
  };

  const resp = await axios({
    url: BASE_URL,
    method: "post",
    headers: headers,
    data: graphqlQuery,
  });

  const res = resp["data"]["data"]["events"];
  return res;
};

export default function Event() {
  console.log(/Event/);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then((resp) => {
      setEvents(resp);
    });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "",
      key: "id",
      width: "5%",
      sorter: (a, b) => a.id - b.id,
      render: (id, record, index) => {
        ++index;
        return index;
      },
    },
    {
      title: "Hash",
      dataIndex: "id",
      key: "hash",
      render: (text) => (
        <a
          href={`https://explorer.solana.com/tx/${text}?cluster=devnet`}
          target="_blank"
        >
          {text.slice(0, 5)}
        </a>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Time",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "Account",
      dataIndex: "account",
    },
    {
      title: "Signer",
      dataIndex: "signer",
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={events} />
    </>
  );
}
