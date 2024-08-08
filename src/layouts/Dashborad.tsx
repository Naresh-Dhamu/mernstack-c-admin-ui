import { Outlet, Navigate, NavLink, useLocation } from "react-router-dom";
import { useAuthState } from "../store";
import Icon, { BellFilled } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import { useState } from "react";
import Logo from "../components/icons/Logo";

import UserIcon from "../components/icons/UserIcon";
import FoodIcon from "../components/icons/FoodIcon";
import BasketIcon from "../components/icons/BasketIcon";
import PromoIcon from "../components/icons/PromoIcon";
import DashboardIcon from "../components/icons/DashboardIcon";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";
const { Sider, Header, Footer, Content } = Layout;
const getMenuItems = (role: string) => {
  const baseItems = [
    {
      key: "/",
      icon: <Icon component={DashboardIcon} />,
      label: <NavLink to="/">Home</NavLink>,
    },
    {
      key: "/products",
      icon: <Icon component={FoodIcon} />,
      label: <NavLink to="/products">Products</NavLink>,
    },
    {
      key: "/orders",
      icon: <Icon component={BasketIcon} />,
      label: <NavLink to="/orders">Orders</NavLink>,
    },
    {
      key: "/promos",
      icon: <Icon component={PromoIcon} />,
      label: <NavLink to="/promos">Promos</NavLink>,
    },
  ];
  if (role === "admin") {
    const menus = [...baseItems];
    menus.splice(1, 0, {
      key: "/users",
      icon: <Icon component={UserIcon} />,
      label: <NavLink to="/users">Users</NavLink>,
    });
    menus.splice(2, 0, {
      key: "/restaurants",
      icon: <Icon component={FoodIcon} />,
      label: <NavLink to="/restaurants">Restaurants</NavLink>,
    });
    return menus;
  }
  return baseItems;
};

// const items = [
//   {
//     key: "/",
//     icon: <Icon component={DashboardIcon} />,
//     label: <NavLink to="/">Home</NavLink>,
//   },
//   {
//     key: "/users",
//     icon: <Icon component={UserIcon} />,
//     label: <NavLink to="/users">Users</NavLink>,
//   },
//   {
//     key: "/restaurants",
//     icon: <Icon component={FoodIcon} />,
//     label: <NavLink to="/users">Restaurants</NavLink>,
//   },
//   {
//     key: "/products",
//     icon: <Icon component={BasketIcon} />,
//     label: <NavLink to="/users">Products</NavLink>,
//   },
//   {
//     key: "/promos",
//     icon: <Icon component={PromoIcon} />,
//     label: <NavLink to="/users">Promos</NavLink>,
//   },
// ];

const Dashborad = () => {
  const location = useLocation();
  const { user, logout: logoutFormStore } = useAuthState();
  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout,
    onSuccess: async () => {
      logoutFormStore();
      return;
    },
  });
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (user === null) {
    return (
      <Navigate
        to={`/auth/login?returnTo=${location.pathname}`}
        replace={true}
      />
    );
  }
  const items = getMenuItems(user?.role);
  return (
    <div>
      <Layout style={{ minHeight: "100vh", background: colorBgContainer }}>
        <Sider
          style={{ position: "sticky", top: 0, zIndex: 1, height: "100vh" }}
          collapsible
          theme="light"
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo">
            <Logo />
          </div>

          <Menu
            theme="light"
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              paddingLeft: "16px",
              paddingRight: "16px",
              background: colorBgContainer,
            }}
          >
            <Flex gap="middle" align="start" justify="space-between">
              <div>
                <Badge
                  style={{ color: "#F65F42" }}
                  color="#F65F42"
                  text={user.role === "admin" ? "admin" : user.tenant?.name}
                  status="success"
                />
              </div>
              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled />
                </Badge>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: () => logoutMutate(),
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Avatar
                    style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                  >
                    {user.firstName.slice(0, 1).toUpperCase()}
                  </Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "24px" }}>
            {/* <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb> */}
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            MernSpace pizza shop ©2024
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashborad;
