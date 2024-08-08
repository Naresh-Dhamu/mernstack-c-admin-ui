import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import {
  RightOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import ProductsFilter from "./ProductsFilter";
import React, { useEffect, useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createProduct, getProducts, updateProduct } from "../../http/api";
import { FieldData, Product } from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";
import { LIMIT } from "../../constants";
import { useAuthState } from "../../store";
import ProductForm from "./Forms/ProductForm";
import { makeFormData } from "./helpers";

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: Product) => (
      <div>
        <Space>
          <Image width={50} height={50} src={record.image} preview={false} />
          <Typography.Text>{record.name.slice(0, 20) + "..."}</Typography.Text>
        </Space>
      </div>
    ),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    render: (_text: string, record: Product) => (
      <Typography.Text>
        {record.description.slice(0, 30) + "..."}
      </Typography.Text>
    ),
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
  const [form] = Form.useForm();
  const { user } = useAuthState();
  const [filterForm] = Form.useForm();
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentEditProduct, setCurrentEditProduct] = useState<Product | null>(
    null
  );
  useEffect(() => {
    if (currentEditProduct) {
      setDrawerOpen(true);

      const priceConfiguration = Object.entries(
        currentEditProduct.priceConfiguration
      ).reduce((acc, [key, value]) => {
        const stringifiedKey = JSON.stringify({
          configurationKey: key,
          priceType: value.priceType,
        });
        return {
          ...acc,
          [stringifiedKey]: value.availableOptions,
        };
      }, {});
      const attributes = currentEditProduct.attributes.reduce((acc, item) => {
        return {
          ...acc,
          [item.name]: item.value,
        };
      }, {});
      form.setFieldsValue({
        ...currentEditProduct,
        priceConfiguration,
        attributes,
        categoryId: currentEditProduct.category._id,
      });
    }
  }, [currentEditProduct, form]);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: LIMIT,
    tenantId: user!.role === "manager" ? user?.tenant?._id : undefined,
  });
  const { mutate: productMutate, isPending: isProductPending } = useMutation({
    mutationKey: ["products"],
    mutationFn: async (data: FormData) => {
      if (currentEditProduct) {
        return updateProduct(data, currentEditProduct._id).then(
          (res) => res.data
        );
      } else {
        return createProduct(data).then((res) => res.data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      form.resetFields();
      setDrawerOpen(false);

      if (currentEditProduct) {
        setCurrentEditProduct(null);
      }

      return;
    },
  });
  const {
    token: { colorBgLayout },
  } = theme.useToken();
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

  const onHandleSubmit = async () => {
    form.validateFields();
    const allFields = form.getFieldsValue();
    const priceConfiguration = allFields.priceConfiguration;

    const pricing = Object.entries(priceConfiguration).reduce(
      (acc, [key, value]) => {
        const parsedKey = JSON.parse(key);
        return {
          ...acc,
          [parsedKey.configurationKey]: {
            priceType: parsedKey.priceType,
            availableOptions: value,
          },
        };
      },
      {}
    );
    const categoryId = form.getFieldValue("categoryId");
    const attributes = Object.entries(allFields.attributes).map(
      ([key, value]) => {
        return {
          name: key,
          value: value,
        };
      }
    );
    const postData = {
      ...allFields,
      tenantId:
        user!.role === "manager"
          ? user?.tenant?._id
          : form.getFieldValue("tenantId"),
      isPublish: allFields.isPublish ? true : false,
      image: allFields.image,
      categoryId,
      priceConfiguration: pricing,
      attributes,
    };

    const formData = makeFormData(postData);
    await productMutate(formData);
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
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Add Product
            </Button>
          </ProductsFilter>
        </Form>
        <Table
          columns={[
            ...columns,
            {
              title: "Action",
              render: (_, record: Product) => {
                return (
                  <div>
                    <Space>
                      <Button
                        type="link"
                        onClick={() => setCurrentEditProduct(record)}
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
        />{" "}
        <Drawer
          title={currentEditProduct ? "Update Product" : "Add Product"}
          width={720}
          destroyOnClose={true}
          style={{ backgroundColor: colorBgLayout }}
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setCurrentEditProduct(null);
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setDrawerOpen(false), setCurrentEditProduct(null);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={onHandleSubmit}
                loading={isProductPending}
              >
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <ProductForm form={form} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Products;
