import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { getCategories, getTenants } from "../../http/api";
import { Categories, TenantTypes } from "../../types";

type ProductsFilterProps = {
  children?: React.ReactNode;
};
const ProductsFilter = ({ children }: ProductsFilterProps) => {
  const { data: restaurant } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => {
      return getTenants(`?page=1&limit=6`).then((res) => res.data.data);
    },
  });
  const { data: categories } = useQuery({
    queryKey: ["catagories"],
    queryFn: () => {
      return getCategories();
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
            <Col span={6}>
              <Form.Item name="categoryId">
                <Select
                  style={{ width: "100%" }}
                  placeholder="Select catagory"
                  allowClear={true}
                >
                  {categories?.data.data.map((item: Categories) => (
                    <Select.Option key={item._id} value={item._id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
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
            <Col span={6}>
              <Space align="center">
                <Form.Item name="isPublish">
                  <Switch defaultChecked={false} />
                </Form.Item>
                <Typography.Text>Show only Published</Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductsFilter;
