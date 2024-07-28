import { Breadcrumb, Flex, Space} from "antd"
import { Link } from "react-router-dom"
import { RightOutlined} from "@ant-design/icons"
const Products = () => {
  return (
    <>
    <Space size="large" style={{ width: "100%" }} >
    <Flex justify="space-between" align="center">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Products" },
            ]}
          />
        </Flex>
    </Space>
    </>
  )
}

export default Products