import { Breadcrumb, Button, Flex, Form, Space } from "antd";
import { Link } from "react-router-dom";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import ProductsFilter from "./ProductsFilter";
const Products = () => {
  const [filterForm] = Form.useForm();
  return (
    <>
      <Space style={{ width: "100%" }} direction="vertical">
        <Flex justify="space-between" align="center">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Products" },
            ]}
          />
        </Flex>
        <Form form={filterForm}>
          <ProductsFilter>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Product
            </Button>
          </ProductsFilter>
        </Form>
      </Space>
    </>
  );
};

export default Products;
