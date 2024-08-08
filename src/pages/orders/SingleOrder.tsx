/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Avatar,
  Breadcrumb,
  Card,
  Col,
  Flex,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { Link, useParams } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { colorMapping } from "../../constants";
import { capitalizeFirst } from "../../utils";
import { useQuery } from "@tanstack/react-query";
import { getSingle } from "../../http/api";
import { Order } from "../../types";
const SingleOrder = () => {
  const params = useParams();
  const orderId = params.orderId;
  const { data: order } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => {
      const queryString = new URLSearchParams({
        fields:
          "cart,address,paymentMode,total,tenantId,paymentStatus,comment,orderStatus",
      }).toString();
      return getSingle(orderId as string, queryString).then((res) => res.data);
    },
  });

  if (!order) return null;
  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <Flex justify="space-between" align="center">
        <Breadcrumb
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: <Link to="/orders">Orders</Link> },
            { title: `Order #${order?._id}` },
          ]}
        />
      </Flex>
      <Row gutter={24}>
        <Col span={14}>
          <Card
            title="Order Details"
            extra={
              <Tag
                bordered={false}
                color={colorMapping[order.orderStatus] ?? "processing"}
              >
                {capitalizeFirst(order.orderStatus)}
              </Tag>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={order?.cart}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.image} shape="circle" />}
                    title={item.name}
                    description={item.chosenConfiguration.selectedToppings
                      // @ts-ignore
                      .map((topping) => capitalizeFirst(topping.name))}
                  />
                  <Space size={"large"}>
                    <Typography.Text>
                      {Object.values(
                        item.chosenConfiguration.priceConfiguration
                      ).join(", ")}
                    </Typography.Text>
                    <Typography.Text>
                      {item.qty} Item{item.qty > 1 && "s"}
                    </Typography.Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="Customer Details">some content goes here....</Card>
        </Col>
      </Row>
    </Space>
  );
};

export default SingleOrder;
