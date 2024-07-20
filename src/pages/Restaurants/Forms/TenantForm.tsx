import { Card, Col, Form, Input, Row, Space } from "antd";

const TenantForm = () => {
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Restaurant Info" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Restaurant Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your restaurant name!",
                    },
                  ]}
                >
                  <Input size="large" type="text" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Restaurant Address"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Please input your restaurant address!",
                    },
                  ]}
                >
                  <Input size="large" type="text" />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default TenantForm;
