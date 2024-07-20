import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getTenants } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";
import { TenantTypes } from "../../../types";

const UserForm = () => {
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants().then((res) => res.data);
    },
  });
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Basic Info" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your first name!",
                    },
                  ]}
                >
                  <Input size="large" type="text" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    { required: true, message: "Please input your last name!" },
                  ]}
                >
                  <Input size="large" type="text" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Please input a valid email!" },
                  ]}
                >
                  <Input size="large" type="email" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Secutrity Info" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input size="large" type="password" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Role" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[{ required: true, message: "Please select role!" }]}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Select role"
                    allowClear={true}
                  >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="manager">Manager</Select.Option>
                    <Select.Option value="customer">Customer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Restaurant"
                  name="tenantId"
                  rules={[
                    { required: true, message: "Please select restaurant!" },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Select restaurant"
                    allowClear={true}
                  >
                    {tenants?.map((tenant: TenantTypes) => (
                      <Select.Option value={tenant._id} key={tenant._id}>
                        {tenant.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default UserForm;
