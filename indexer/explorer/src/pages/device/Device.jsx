import React from "react";
import { useState, useEffect } from "react";
import { Space, Table } from "antd";
import axios, { isCancel, AxiosError } from "axios";

import "./device.css";

const getDevices = async () => {
  const BASE_URL = process.env.REACT_APP_API_ENDPOINT;

  const headers = {
    "content-type": "application/json",
  };

  const queryStr = `query
  {
    accounts(types: ["Device"]) {
      name
      type
      address
      data {
        __typename
        ... on Device {
          deviceDidAddress
          deviceState
          holder
        }
      }
    }
  }
  `;
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

  const res = resp["data"]["data"]["accounts"];
  return res;
};

export default function Device() {
  console.log(/Device/);

  const [devices, setDevices] = useState([]);

  useEffect(() => {
    getDevices().then((resp) => {
      setDevices(resp);
    });
  }, []);

  const toEthAddr = (val) => {
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "5%",
      sorter: (a, b) => a.id - b.id,
      render: (id, record, index) => {
        ++index;
        return index;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text.slice(0, 5)}</a>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Addr",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "deviceDidAddress",
      dataIndex: ["data", "deviceDidAddress"],
      key: "deviceDidAddress",
    },
    {
      title: "deviceState",
      dataIndex: ["data", "deviceState"],
      key: "deviceState",
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={devices} />
    </>
  );
}
