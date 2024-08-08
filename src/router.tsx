import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/Login/login";
import Dashborad from "./layouts/Dashborad";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Users from "./pages/users/Users";
import HomePage from "./pages/Home/HomePage";
import Tenant from "./pages/Restaurants/Tenant";
import Products from "./pages/products/Products";
import Promos from "./pages/promos/promos";
import Orders from "./pages/orders/Orders";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Dashborad />,
        children: [
          {
            path: "",
            element: <HomePage />,
          },
          {
            path: "/users",
            element: <Users />,
          },
          {
            path: "/restaurants",
            element: <Tenant />,
          },
          {
            path: "/products",
            element: <Products />,
          },

          {
            path: "/promos",
            element: <Promos />,
          },

          {
            path: "/orders",
            element: <Orders />,
          },
        ],
      },
      {
        path: "/auth",
        element: <NonAuth />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);
