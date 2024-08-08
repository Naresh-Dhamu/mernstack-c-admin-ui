import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { useAuthState } from "../../../store";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../../http/api";
import { TenantTypes } from "../../../types";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
dayjs.extend(customParseFormat);

const PromoForm = () => {
  const { user } = useAuthState();
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => getTenants("limit=100").then((res) => res.data.data),
  });
  const currentDate = dayjs().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(currentDate);
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Promo Title"
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your promo title!",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Promo Code"
                  name="code"
                  rules={[
                    {
                      required: true,
                      message: "Please input your promo code!",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Promo Validity Date"
                  name="validUpto"
                  initialValue={currentDate}
                  rules={[
                    {
                      required: true,
                      message: "Please select the promo validity date!",
                    },
                  ]}
                >
                  <Input
                    size="large"
                    type="date"
                    value={selectedDate}
                    min={currentDate}
                    max={dayjs(currentDate).add(30, "d").format("YYYY-MM-DD")}
                    onClick={() =>
                      setSelectedDate(dayjs(currentDate).format("YYYY-MM-DD"))
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Promo Discount (%)"
                  name="discount"
                  rules={[
                    {
                      required: true,
                      message: "Please input your promo discount!",
                    },
                  ]}
                >
                  <Input type="number" size="large" />
                </Form.Item>
              </Col>
              {user?.role !== "manager" && (
                <Col span={12}>
                  <Form.Item
                    label="Promo Tenant ID"
                    name="tenantId"
                    rules={[
                      {
                        required: true,
                        message: "Please select a tenant!",
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="Select tenant"
                      allowClear
                    >
                      {Array.isArray(tenants) &&
                        tenants.map((tenant: TenantTypes) => (
                          <Select.Option value={tenant._id} key={tenant._id}>
                            {tenant.name}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default PromoForm;
