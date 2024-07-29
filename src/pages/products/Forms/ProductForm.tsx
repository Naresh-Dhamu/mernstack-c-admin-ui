import {
  Card,
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { Categories, TenantTypes } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getTenants } from "../../../http/api";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
import ProductImage from "./ProductImage";
import { useAuthState } from "../../../store";

const ProductForm = ({ form }: { form: FormInstance }) => {
  const { user } = useAuthState();
  const selectedCategory = Form.useWatch("categoryId", Form.useFormInstance());
  const { data: categories } = useQuery({
    queryKey: ["catagories"],
    queryFn: () => {
      return getCategories();
    },
  });
  const { data: tenants } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => {
      return getTenants().then((res) => res.data.data);
    },
  });
  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Product Info" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Product Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your product name!",
                    },
                  ]}
                >
                  <Input size="large" type="text" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Product Category"
                  name="categoryId"
                  rules={[
                    {
                      required: true,
                      message: "Category is required!",
                    },
                  ]}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select Category"
                  >
                    {categories?.data.data.map((category: Categories) => (
                      <Select.Option key={category._id} value={category._id}>
                        {category.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Product Description"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Description is required!",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    maxLength={100}
                    style={{ resize: "none" }}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card title="Product Images" bordered={false}>
            <Row gutter={20}>
              <Col span={24}>
                <ProductImage initialImage={form.getFieldValue("image")} />
              </Col>
            </Row>
          </Card>
          {user?.role !== "manager" && (
            <Card title="Restaurant Info" bordered={false}>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="Restaurant" name="tenantId">
                    <Select
                      id="selectInBoxRole"
                      size="large"
                      style={{ width: "100%" }}
                      placeholder="Select restaurant"
                      allowClear={true}
                    >
                      {Array.isArray(tenants) &&
                        tenants?.map((tenant: TenantTypes) => (
                          <Select.Option value={tenant._id} key={tenant._id}>
                            {tenant.name}
                          </Select.Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}
          {selectedCategory && <Pricing selectedCategory={selectedCategory} />}
          {selectedCategory && (
            <Attributes selectedCategory={selectedCategory} />
          )}
          <Card title="Other properties" bordered={false}>
            <Row gutter={24}>
              <Col span={12}>
                <Space align="center">
                  <Form.Item name="isPublish">
                    <Switch
                      defaultChecked={false}
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                    />
                  </Form.Item>
                  <Typography.Text
                    style={{ marginBottom: 22, display: "block" }}
                  >
                    Published
                  </Typography.Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default ProductForm;
