import {
  Breadcrumb,
  Button,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import {
  RightOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import ProductsFilter from "./ProductsFilter";
import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts } from "../../http/api";
import { FieldData, Product } from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";
import { LIMIT } from "../../constants";

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: Product) => (
      <div>
        <Space>
          <Image width={50} height={50} src={record.image} preview={false} />
          <Typography.Text>{record.name}</Typography.Text>
        </Space>
      </div>
    ),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "isPublish",
    key: "isPublish",
    render: (_: boolean, record: Product) => {
      return record.isPublish ? (
        <Tag color="green">Publish</Tag>
      ) : (
        <Tag color="red">Draft</Tag>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (_text: string) => {
      return (
        <Typography.Text>
          {format(new Date(_text), "dd MMMM yyyy hh:mm aa")}
        </Typography.Text>
      );
    },
  },
];
const Products = () => {
  const [filterForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: LIMIT,
  });
  const {
    data: product,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams],

    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );
      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      return getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });
  console.log(product?.data);
  const debouncedQUpadate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, page: 1 }));
    }, 500);
  }, []);

  const onFiltreChange = (changeFields: FieldData[]) => {
    const changeFillterFields = changeFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {});
    if ("q" in changeFillterFields) {
      debouncedQUpadate(changeFillterFields.q);
    } else {
      setQueryParams((prev) => ({ ...prev, ...changeFillterFields, page: 1 }));
    }
  };
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
          {isFetching && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>
        <Form form={filterForm} onFieldsChange={onFiltreChange}>
          <ProductsFilter>
            <Button type="primary" icon={<PlusOutlined />}>
              Add Product
            </Button>
          </ProductsFilter>
        </Form>
        <Table
          columns={[
            ...columns,
            {
              title: "Action",
              render: () => {
                return (
                  <div>
                    <Space>
                      <Button
                        type="link"
                        // onClick={() => setCurrentEditUser(record)}
                      >
                        Edit
                      </Button>
                    </Space>
                  </div>
                );
              },
            },
          ]}
          dataSource={product?.data}
          rowKey={(row) => row._id}
          pagination={{
            current: queryParams.page,
            pageSize: queryParams.limit,
            total: product?.pagination.total,
            onChange: (page, pageSize) => {
              setQueryParams((prev) => ({
                ...prev,
                page,
                limit: pageSize,
              }));
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
        />
      </Space>
    </>
  );
};

export default Products;
