import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/Login/login";
import Dashborad from "./layouts/Dashborad";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Users from "./pages/users/Users";
import HomePage from "./pages/Home/HomePage";
import Tenant from "./pages/Restaurants/Tenant";

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
