import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  theme,
  Typography,
} from "antd";
import { RightOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { creacteUser, getUsers } from "../../http/api";
import { CreacteUserData, FieldData, User } from "../../types";
import { useAuthState } from "../../store";
import { PlusOutlined } from "@ant-design/icons";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
import UserForm from "./Forms/UserForm";
import { LIMIT } from "../../constants";
const columns = [
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },

  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.role.slice(0, 1).toUpperCase() + record.role.slice(1)}
        </div>
      );
    },
  },
  {
    title: "ID",
    dataIndex: "_id",
    key: "_id",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (_text: string, record: User) => {
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
    render: (_text: string, record: User) => {
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
const Users = () => {
  const [form] = Form.useForm();
  const [fillterForm] = Form.useForm();
  const queryClient = useQueryClient();

  const { mutate: userMutate } = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: CreacteUserData) =>
      creacteUser(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: LIMIT,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    data: users,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );
      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      return getUsers(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const onFilterChange = (changeFields: FieldData[]) => {
    const changeFillterFields = changeFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {});
    setQueryParams((prev) => ({ ...prev, ...changeFillterFields }));
  };
  const { user } = useAuthState();
  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <>
      <Space size="large" style={{ width: "100%" }} direction="vertical">
        <Flex justify="space-between" align="center">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Users" },
            ]}
          />
          {isFetching && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>
        <Form form={fillterForm} onFieldsChange={onFilterChange}>
          <UsersFilter>
            <Button
              onClick={() => setDrawerOpen(true)}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add User
            </Button>
          </UsersFilter>
        </Form>
        <Table
          columns={columns}
          dataSource={users?.data}
          rowKey={(row) => row.id || row._id}
          pagination={{
            current: queryParams.page,
            pageSize: queryParams.limit,
            total: users?.total,
            onChange: (page, pageSize) => {
              setQueryParams({ page, limit: pageSize });
            },
          }}
        />

        <Drawer
          title="Create User"
          width={720}
          destroyOnClose={true}
          style={{ backgroundColor: colorBgLayout }}
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setDrawerOpen(false), form.resetFields();
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
          <Form layout="vertical" form={form}>
            <UserForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Users;
