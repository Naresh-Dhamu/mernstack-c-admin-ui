import { Breadcrumb, Flex, Space, Table, Tag, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

import { Order } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../../http/api";
import { format } from "date-fns";
import { colorMapping } from "../../constants";
import { capitalizeFirst } from "../../utils";
import React from "react";
import socket from "../../lib/socket";
import { useAuthState } from "../../store";
const columns = [
  {
    title: "Order Id",
    dataIndex: "_id",
    key: "_id",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record._id}</Typography.Text>;
    },
  },
  {
    title: "Customer",
    dataIndex: "customerId",
    key: "customerId._id",
    render: (_text: string, record: Order) => {
      if (!record.customerId) return "";
      return (
        <Typography.Text>
          {record.customerId.firstName + " " + record.customerId.lastName}
        </Typography.Text>
      );
    },
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record.address}</Typography.Text>;
    },
  },
  {
    title: "Comment",
    dataIndex: "comment",
    key: "comment",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record?.comment}</Typography.Text>;
    },
  },
  {
    title: "Payment Mode",
    dataIndex: "paymentMode",
    key: "paymentMode",
    render: (_text: string, record: Order) => {
      return <Typography.Text>{record.paymentMode}</Typography.Text>;
    },
  },
  {
    title: "Status",
    dataIndex: "orderStatus",
    key: "orderStatus",
    render: (_: boolean, record: Order) => {
      return (
        <Tag bordered={false} color={colorMapping[record.orderStatus]}>
          {capitalizeFirst(record.orderStatus)}
        </Tag>
      );
    },
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (text: string) => {
      return <Typography.Text>₹{text}</Typography.Text>;
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "dd MMMM yyyy hh:mm aa")}
        </Typography.Text>
      );
    },
  },
  {
    title: "Action",
    render: (_: string, record: Order) => {
      return <Link to={`/orders/${record._id}`}>Details</Link>;
    },
  },
];

const TENANT_ID = "66a12a92252e374c63be8165";
const Orders = () => {
  const { user } = useAuthState();
  React.useEffect(() => {
    if (user?.tenant) {
      socket.on("order-update", (data) => {
        console.log("Data received", data);
      });
      socket.on("join", (data) => {
        console.log("User joined in", data.roomId);
      });
      socket.emit("join", {
        tenantId: user.tenant._id,
      });
    }
    return () => {
      socket.off("join");
      socket.off("order-update");
    };
  }, [user?.tenant]);
  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => {
      const queryString = new URLSearchParams({
        tenantId: String(TENANT_ID),
      }).toString();
      return getOrders(queryString).then((res) => res.data);
    },
  });
  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <Flex justify="space-between" align="center">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Orders" },
          ]}
        />
        {/* {isFetching && (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        )}
        {isError && (
          <Typography.Text type="danger">{error.message}</Typography.Text>
        )} */}
      </Flex>
      <Table columns={columns} rowKey={"_id"} dataSource={orders}></Table>
    </Space>
  );
};

export default Orders;
