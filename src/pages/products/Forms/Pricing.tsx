import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";
import { Categories } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../http/api";

type PricingProps = {
  selectedCategory: string;
};
const Pricing = ({ selectedCategory }: PricingProps) => {
  const { data: fetchedcategory } = useQuery<Categories>({
    queryKey: ["category", selectedCategory],
    queryFn: () => {
      return getCategory(selectedCategory).then((res) => res.data);
    },
    staleTime: 1000 * 60 * 5,
  });
  if (!fetchedcategory) return null;
  return (
    <Card
      title={<Typography.Text>Product Price</Typography.Text>}
      bordered={false}
    >
      {Object.entries(fetchedcategory?.priceConfiguration).map(
        ([configurationKey, configurationValue]) => {
          return (
            <div key={configurationKey}>
              <Space
                direction="vertical"
                size="large"
                style={{
                  width: "100%",
                }}
              >
                <Typography.Text strong>
                  {`${configurationKey} (${configurationValue.priceType})`}
                </Typography.Text>
                <Row gutter={20}>
                  {configurationValue.availableOptions.map((option: string) => {
                    return (
                      <Col span={8} key={option}>
                        <Form.Item
                          label={option}
                          name={[
                            "priceConfiguration",
                            JSON.stringify({
                              configurationKey: configurationKey,
                              priceType: configurationValue.priceType,
                            }),
                            option,
                          ]}
                        >
                          <InputNumber addonAfter="₹" />
                        </Form.Item>
                      </Col>
                    );
                  })}
                </Row>
              </Space>
            </div>
          );
        }
      )}
    </Card>
  );
};

export default Pricing;
