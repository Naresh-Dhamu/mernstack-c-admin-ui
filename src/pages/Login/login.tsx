import {
  Alert,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Layout,
  Space,
} from "antd";
import { LockFilled, UserOutlined, LockOutlined } from "@ant-design/icons";
import Logo from "../../components/icons/Logo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Credentials, IError } from "../../types";
import { login, self, logout } from "../../http/api";
import { useAuthState } from "../../store";
import { usePermission } from "../../hooks/usePermission";

const loginUser = async (credentials: Credentials) => {
  try {
    const { data } = await login(credentials);
    return data;
  } catch (error) {
    const err = error as IError;
    throw new Error(err.response.data.errors[0].msg);
  }
};

const getself = async () => {
  const { data } = await self();
  return data;
};
const LoginPage = () => {
  const { isAllowed } = usePermission();
  const { setUser, logout: logoutFormStore } = useAuthState();
  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getself,
    enabled: false,
  });
  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: async () => {
      logoutFormStore();
      return;
    },
  });
  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      const selfData = await refetch();
      if (!isAllowed(selfData.data)) {
        await logoutMutate();
        return;
      }
      setUser(selfData.data);
    },
  });

  return (
    <>
      <Layout
        style={{ height: "100vh", display: "grid", placeItems: "center" }}
      >
        <Space direction="vertical" align="center" size="large">
          <Layout.Content
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Logo />
          </Layout.Content>
          <Card
            style={{ width: 300, fontWeight: "500" }}
            bordered={false}
            title={
              <Space
                style={{
                  width: "100%",
                  fontSize: 16,
                  justifyContent: "center",
                }}
              >
                <LockFilled />
                Sign in
              </Space>
            }
          >
            <Form
              initialValues={{
                remember: true,
              }}
              onFinish={(values) => {
                mutate({ email: values.username, password: values.password });
              }}
            >
              {isError && error?.message && (
                <Alert
                  style={{ marginBottom: 24 }}
                  type="error"
                  message={error.message}
                />
              )}
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your username" },
                  {
                    type: "email",
                    message: "Email is not valid",
                  },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item
                name="remember"
                valuePropName="checked"
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Checkbox>Remember me</Checkbox>
                <a href="#" id="login-form-forget">
                  Forget Password
                </a>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  loading={isPending}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Space>
      </Layout>
    </>
  );
};

export default LoginPage;
