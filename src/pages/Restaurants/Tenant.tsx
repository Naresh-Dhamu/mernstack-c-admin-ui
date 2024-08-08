import { Breadcrumb, Button, Drawer, Form, Space, Table } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { creacteTenants, getTenants, updateTenants } from "../../http/api";
import { FieldData, TenantTypes } from "../../types";
import { PlusOutlined } from "@ant-design/icons";
import TenantFilter from "./TenantFilter";
import React, { useEffect, useState } from "react";
import TenantForm from "./Forms/TenantForm";
import { useAuthState } from "../../store";
import { LIMIT } from "../../constants";
import { debounce } from "lodash";
const columns = [
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
    title: "User Name",
    dataIndex: "userId",
    key: "userId",
    render: (_text: string, record: TenantTypes) => {
      const fullName = `${record.userId.firstName} ${record.userId.lastName}`;
      return <div>{fullName}</div>;
    },
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
  const { user } = useAuthState();
  const [form] = Form.useForm();
  const [fillterForm] = Form.useForm();
  const queryClient = useQueryClient();
  const [currentEditUser, setCurrentEditUser] = useState<TenantTypes | null>();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: LIMIT,
  });

  const { mutate: tenantMutate } = useMutation({
    mutationKey: ["tenants"],
    mutationFn: async (data: TenantTypes) =>
      creacteTenants(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
  });

  const { mutate: updateTenantMutate } = useMutation({
    mutationKey: ["tenants"],
    mutationFn: async (data: TenantTypes) =>
      updateTenants(data, currentEditUser!._id).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    const isEditMode = !!currentEditUser;
    if (isEditMode) {
      await updateTenantMutate(form.getFieldsValue());
    } else {
      await tenantMutate(form.getFieldsValue());
    }
    form.resetFields();
    setCurrentEditUser(null);
    setDrawerOpen(false);
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    if (currentEditUser) {
      setDrawerOpen(true);
      form.setFieldsValue(currentEditUser);
    }
  }, [currentEditUser, form]);
  const {
    data: tenants,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );
      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      return getTenants(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });
  const debouncedQUpadate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, page: 1 }));
    }, 500);
  }, []);
  const onFilterChange = (changeFields: FieldData[]) => {
    const changeFillterFields = changeFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {});
    if ("q" in changeFillterFields) {
      debouncedQUpadate(changeFillterFields.q);
    } else {
      setQueryParams((prev) => ({ ...prev, ...changeFillterFields, page: 1 }));
    }
  };
  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }
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
        <Form form={fillterForm} onFieldsChange={onFilterChange}>
          <TenantFilter>
            <Button
              onClick={() => setDrawerOpen(true)}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add Restaurant
            </Button>
          </TenantFilter>
        </Form>
        <Table
          columns={[
            ...columns,
            {
              title: "Action",
              render: (_: string, record: TenantTypes) => {
                return (
                  <div>
                    <Space>
                      <Button
                        type="link"
                        onClick={() => setCurrentEditUser(record)}
                      >
                        Edit
                      </Button>
                    </Space>
                  </div>
                );
              },
            },
          ]}
          pagination={{
            current: queryParams.page,
            pageSize: queryParams.limit,
            total: tenants?.total,
            onChange: (page, pageSize) => {
              setQueryParams((prev) => ({
                ...prev,
                page,
                limit: pageSize,
              }));
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
          dataSource={tenants?.data}
          rowKey={(row) => row._id}
        />

        <Drawer
          title="Create a new Restaurant"
          width={720}
          destroyOnClose={true}
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setCurrentEditUser(null);
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setCurrentEditUser(null);
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
