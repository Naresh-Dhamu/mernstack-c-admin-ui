import {
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  List,
  Row,
  Skeleton,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { useAuthState } from "../../store";
import CardTitle from "../../components/CardTitle";
import { Link } from "react-router-dom";
import RecentOrderIcon from "../../components/icons/RecentOrderIcon";
import SaleIcon from "../../components/icons/SaleIcon";

const list = [
  {
    OrderSummary: "Naresh Dhamu",
    address: "mumbai",
    amount: "1,000",
    status: "Pending",
    loading: false,
  },
  {
    OrderSummary: "Jay Patel",
    address: "kolkata",
    amount: "2,000",
    status: "Delivered",
    loading: false,
  },
  {
    OrderSummary: "Ramesh",
    address: "delhi",
    amount: "800",
    status: "On the way",
    loading: false,
  },
  {
    OrderSummary: "Krishna",
    address: "chennai",
    amount: "1,500",
    status: "Delivered",
    loading: false,
  },
  {
    OrderSummary: "Bharath Panchal",
    address: "mumbai",
    amount: "1,000",
    status: "Pending",
    loading: false,
  },
];
const { Title, Text } = Typography;
export default function HomePage() {
  const { user } = useAuthState();
  const name = user?.firstName + " " + user?.lastName;
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "orange";
      case "Delivered":
        return "green";
      case "On the way":
        return "blue";
      default:
        return "default"; // You can set a default color or return null if needed
    }
  };

  return (
    <div>
      <Title style={{ fontWeight: "600" }} level={4}>
        Welcome, {name} 😃
      </Title>
      <Row className="mt-4" gutter={16}>
        <Col span={12}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card bordered={false}>
                <Flex align="start" style={{ borderRadius: "10px" }} gap={11}>
                  <RecentOrderIcon color={"#13C925"} />
                  <Statistic
                    style={{
                      marginTop: "10px",
                      fontWeight: "700",
                    }}
                    title="Total orders"
                    value={52}
                  />
                </Flex>
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  style={{
                    fontWeight: "700",
                  }}
                  title={
                    <CardTitle
                      title="Total sale"
                      icon={
                        <Avatar
                          shape="square"
                          size={38}
                          style={{
                            backgroundColor: "#e2f4ff",
                            padding: "5px",
                            borderRadius: "10px",
                          }}
                          icon={<SaleIcon color={"#14AAFF"} />}
                        />
                      }
                    />
                  }
                  value={70000}
                  precision={2}
                  prefix="₹"
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card
                bordered={false}
                title={
                  <CardTitle
                    title="Sales"
                    icon={
                      <Avatar
                        shape="square"
                        size={38}
                        style={{
                          backgroundColor: "#e2f4ff",
                          padding: "5px",
                          borderRadius: "10px",
                        }}
                        icon={<SaleIcon color={"#14AAFF"} />}
                      />
                    }
                  />
                }
              >
                hi
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Card
            bordered={false}
            style={{ borderRadius: "10px" }}
            title={
              <CardTitle
                title="Recent orders"
                icon={<RecentOrderIcon color={"#F65F42"} />}
              />
            }
          >
            <List
              className="demp-loadmore-list"
              loading={false}
              itemLayout="horizontal"
              loadMore={true}
              dataSource={list}
              renderItem={(item) => (
                <List.Item>
                  <Skeleton
                    avatar
                    title={false}
                    loading={item.loading}
                    active
                  />
                  <List.Item.Meta
                    title={<a href="https://ant.design">{item.OrderSummary}</a>}
                    description={item.address}
                  />
                  <Row style={{ flex: 0.4 }} justify="space-between">
                    <Col>
                      <Text strong>₹{item.amount}</Text>
                    </Col>
                    <Col>
                      <Tag color={getStatusColor(item.status)}>
                        {item.status}
                      </Tag>
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
            <div style={{ marginTop: 20 }}>
              <Button type="link">
                <Link to="/orders">Seen all orders</Link>
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

// import { Card, Col, Row, Statistic, Typography } from "antd";
// import { useAuthState } from "../../store";
// import { BarChartOutlined } from "@ant-design/icons";
// const { Title } = Typography;
// const { CardTitle } = Card;
// export default function HomePage() {
//   const { user } = useAuthState();
//   const name = user?.firstName + " " + user?.lastName;
//   return (
//     <div>
//       <Title style={{ fontWeight: "600" }} level={4}>
//         Welcome, {name} 😃
//       </Title>
//       <Row className="mt-4" gutter={16}>
//         <Col span={12}>
//           <Row gutter={[16, 16]}>
//             <Col span={12}>
//               <Card bordered={false}>
//                 <Statistic title="Total orders" value={52} />
//               </Card>
//             </Col>
//             <Col span={12}>
//               <Card bordered={false}>
//                 <Statistic
//                   title="Total sale"
//                   value={70000}
//                   precision={2}
//                   prefix="₹"
//                 />
//               </Card>
//             </Col>
//             <Col span={24}>
//               <Card
//                 bordered={false}
//                 prefix="sdfhgs"
//                 title={
//                   <CardTitle title="Sales" PrefixIcon={<BarChartOutlined />} />
//                 }
//               />
//             </Col>
//           </Row>
//         </Col>
//       </Row>
//     </div>
//   );
// }
