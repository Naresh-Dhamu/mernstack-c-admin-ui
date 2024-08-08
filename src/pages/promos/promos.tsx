import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import {
  RightOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { createCoupons, getCoupons, updateCoupons } from "../../http/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { FieldData, PromosTypes } from "../../types";
import React, { useEffect, useState } from "react";
import { LIMIT } from "../../constants";
import { useAuthState } from "../../store";
import PromosFilter from "./PromosFilter";
import { debounce } from "lodash";
import PromoForm from "./Forms/PromoForm";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const columns = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
  },

  {
    title: "Code",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Discount",
    dataIndex: "discount",
    key: "discount",
    render: (_text: string, record: PromosTypes) => {
      return <div>{record.discount}</div>;
    },
  },
  {
    title: "TenantId",
    dataIndex: "tenantId",
    key: "tenantId",
    render: (_text: string, record: PromosTypes) => {
      return <div>{record.tenantId}</div>;
    },
  },
  {
    title: "Vality Date",
    dataIndex: "validUpto",
    key: "validUpto",
    render: (_text: string, record: PromosTypes) => {
      const convertToReadableDate = (utcDate: string) => {
        const date = new Date(utcDate);

        const options: Intl.DateTimeFormatOptions = {
          hour: "numeric",
          minute: "numeric",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour12: true,
        };

        let formattedDate = date.toLocaleString("en-GB", options);

        formattedDate = formattedDate.replace(/(am|pm)/gi, (match) =>
          match.toUpperCase()
        );

        return formattedDate;
      };

      return <div>{convertToReadableDate(record.validUpto)}</div>;
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (_text: string, record: PromosTypes) => {
      const convertToReadableDate = (utcDate: string) => {
        const date = new Date(utcDate);

        const options: Intl.DateTimeFormatOptions = {
          hour: "numeric",
          minute: "numeric",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour12: true,
        };

        let formattedDate = date.toLocaleString("en-GB", options);

        formattedDate = formattedDate.replace(/(am|pm)/gi, (match) =>
          match.toUpperCase()
        );

        return formattedDate;
      };

      return <div>{convertToReadableDate(record.createdAt)}</div>;
    },
  },
];
const Promos = () => {
  const { user } = useAuthState();
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const queryClient = useQueryClient();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: LIMIT,
    tenantId: user!.role === "manager" ? user?.tenant?._id : undefined,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentEditPromo, setCurrentEditPromo] = useState<PromosTypes | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    if (currentEditPromo) {
      setDrawerOpen(true);
      console.log(currentEditPromo);
      const dateFromMongoDB = currentEditPromo.validUpto;
      const dateFormat = "YYYY-MM-DDTHH:mm:ssZ";
      const localDateFormat = "YYYY-MM-DD";
      const localDate = dayjs(dateFromMongoDB, dateFormat).format(
        localDateFormat
      );

      console.log(localDate);
      const promes = {
        ...currentEditPromo,
        validUpto: localDate,
      };
      console.log(promes);
      form.setFieldsValue(promes);
    }
  }, [currentEditPromo, form]);
  const {
    data: promos,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["promos", queryParams],
    queryFn: async () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1])
      );
      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      return await getCoupons(queryString).then((res) => res.data);
    },
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

  const { mutate: promosMutate } = useMutation({
    mutationKey: ["promos"],
    mutationFn: async (data: PromosTypes) =>
      createCoupons(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promos"] });

      if (currentEditPromo) {
        setCurrentEditPromo(null);
      }
      form.resetFields();
      setDrawerOpen(false);
      return;
    },
  });
  const { mutate: updatePromosMutate, isPending: isProductPending } =
    useMutation({
      mutationKey: ["promos"],
      mutationFn: async (data: PromosTypes) =>
        updateCoupons(data, currentEditPromo!._id).then((res) => res.data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["promos"] });
        if (currentEditPromo) {
          setCurrentEditPromo(null);
        }
        form.resetFields();
        setDrawerOpen(false);
        return;
      },
    });
  const onHandleSubmit = async () => {
    form.validateFields();
    const allFields = form.getFieldsValue();
    const isEditMode = !!currentEditPromo;
    const date = {
      ...allFields,
      tenantId:
        user!.role === "manager"
          ? user?.tenant?._id
          : form.getFieldValue("tenantId"),
    };
    if (isEditMode) {
      await updatePromosMutate(date);
    } else {
      await promosMutate(date);
    }
  };
  return (
    <>
      <Space size="large" style={{ width: "100%" }} direction="vertical">
        <Flex justify="space-between" align="center">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Promos" },
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
          <PromosFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Add Promo
            </Button>
          </PromosFilter>
        </Form>
        <Table
          columns={[
            ...columns,
            {
              title: "Action",
              render: (_, record: PromosTypes) => {
                return (
                  <div>
                    <Space>
                      <Button
                        type="link"
                        onClick={() => setCurrentEditPromo(record)}
                      >
                        Edit
                      </Button>
                    </Space>
                  </div>
                );
              },
            },
          ]}
          dataSource={promos?.data}
          rowKey={(row) => row._id}
          pagination={{
            current: queryParams.page,
            pageSize: queryParams.limit,
            total: promos?.pagination.total,
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

        <Drawer
          title="Create a new Promo"
          width={720}
          onClose={() => {
            setDrawerOpen(false), setCurrentEditPromo(null);
            form.resetFields();
          }}
          open={drawerOpen}
          extra={
            <Space>
              <Button
                onClick={() => {
                  setDrawerOpen(false), setCurrentEditPromo(null);
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
          <Form form={form} layout="vertical">
            <PromoForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Promos;
