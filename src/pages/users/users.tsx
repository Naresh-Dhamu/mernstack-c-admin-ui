import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { creacteUser, getUsers } from "../../http/api";
import { CreacteUserData, User } from "../../types";
import { useAuthState } from "../../store";
import { PlusOutlined } from "@ant-design/icons";
import UsersFilter from "./UsersFilter";
import { useState } from "react";
import UserForm from "./Forms/UserForm";
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
];
const Users = () => {
  const [form] = Form.useForm();
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getUsers().then((res) => res.data);
    },
  });
  const { user } = useAuthState();
  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <>
      <Space size="large" style={{ width: "100%" }} direction="vertical">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]}
        />
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}
        <UsersFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(filterName, filterValue);
          }}
        >
          <Button
            onClick={() => setDrawerOpen(true)}
            type="primary"
            icon={<PlusOutlined />}
          >
            Add User
          </Button>
        </UsersFilter>
        <Table columns={columns} dataSource={users} rowKey={(row) => row.id} />

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
