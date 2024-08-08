import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select } from "antd";
import { getTenants } from "../../http/api";
import { TenantTypes } from "../../types";
import { useAuthState } from "../../store";

type PromosFilterProps = {
  children?: React.ReactNode;
};
const PromosFilter = ({ children }: PromosFilterProps) => {
  const { user } = useAuthState();
  const { data: restaurant } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => {
      return getTenants(`?page=1&limit=100`).then((res) => res.data.data);
    },
  });
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={6}>
              <Form.Item name="q">
                <Input.Search allowClear={true} placeholder="Search" />
              </Form.Item>
            </Col>
            {user!.role === "admin" && (
              <Col span={6}>
                <Form.Item name="tenantId">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select restaurant"
                    allowClear={true}
                  >
                    {restaurant?.map((item: TenantTypes) => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default PromosFilter;
