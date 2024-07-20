import { Breadcrumb, Button, Drawer, Form, Space, Table } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { creacteTenants, getTenants } from "../../http/api";
import { TenantTypes } from "../../types";
import { PlusOutlined } from "@ant-design/icons";
import TenantFilter from "./TenantFilter";
import { useState } from "react";
import TenantForm from "./Forms/TenantForm";
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
    render: (_text: string, record: TenantTypes) => {
      const convertToReadableDate = (utcDate: string) => {
        const date = new Date(utcDate);

        const options: Intl.DateTimeFormatOptions = {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour12: true,
        };

        let formattedDate = date.toLocaleString("en-GB", options);

        formattedDate = formattedDate.replace(/(am|pm)/gi, (match) =>
          match.toUpperCase()
        );

        return formattedDate;
      };

      return <div>{convertToReadableDate(record.createdAt)}</div>;
    },
  },
  {
    title: "Updated At",
    dataIndex: "updatedAt",
    key: "updatedAt",
    render: (_text: string, record: TenantTypes) => {
      const convertToReadableDate = (utcDate: string) => {
        const date = new Date(utcDate);

        const options: Intl.DateTimeFormatOptions = {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour12: true,
        };

        let formattedDate = date.toLocaleString("en-GB", options);

        formattedDate = formattedDate.replace(/(am|pm)/gi, (match) =>
          match.toUpperCase()
        );

        return formattedDate;
      };

      return <div>{convertToReadableDate(record.updatedAt)}</div>;
    },
  },
];
const Tenant = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { mutate: userMutate } = useMutation({
    mutationKey: ["tenants"],
    mutationFn: async (data: TenantTypes) =>
      creacteTenants(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
  });
  const onHandleSubmit = async () => {
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();
      const currentTime = new Date().toISOString();
      formData.createdAt = formData.createdAt || currentTime;
      formData.updatedAt = currentTime;
      await userMutate(formData);
      form.resetFields();
      setDrawerOpen(false);
    } catch (error) {
      console.error("Failed to submit form", error);
    }
  };
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
            form.resetFields();
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form form={form} layout="vertical">
            <TenantForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Tenant;
