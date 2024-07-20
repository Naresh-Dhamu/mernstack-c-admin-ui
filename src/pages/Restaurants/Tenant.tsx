import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";
import { TenantTypes } from "../../types";
import { PlusOutlined } from "@ant-design/icons";
import TenantFilter from "./TenantFilter";
import { useState } from "react";
const columns = [
  {
    title: "Id",
    dataIndex: "_id",
    key: "_id",
    render: (_text: string, record: TenantTypes) => {
      return <div>{record._id}</div>;
    },
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: TenantTypes) => {
      return <div>{record.name}</div>;
    },
  },

  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "UserId",
    dataIndex: "userId",
    key: "userId",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    key: "updatedAt",
  },
];
const Tenant = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    data: tenants,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants().then((res) => res.data);
    },
  });
  console.log(tenants);
  return (
    <>
      <Space size="large" style={{ width: "100%" }} direction="vertical">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Restaurants" },
          ]}
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}
        <TenantFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(filterName, filterValue);
          }}
        >
          <Button
            onClick={() => setDrawerOpen(true)}
            type="primary"
            icon={<PlusOutlined />}
          >
            Add Restaurant
          </Button>
        </TenantFilter>
        <Table
          columns={columns}
          dataSource={tenants}
          rowKey={(row) => row._id}
        />

        <Drawer
          title="Create a new Restaurant"
          width={720}
          destroyOnClose={true}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button type="primary">Submit</Button>
            </Space>
          }
        >
          fhgfdg
        </Drawer>
      </Space>
    </>
  );
};

export default Tenant;
