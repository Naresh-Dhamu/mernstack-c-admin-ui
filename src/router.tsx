import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/Login/login";
import Dashborad from "./layouts/Dashborad";
import Home from "./pages/HomePage";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import Users from "./pages/users/users";

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
            element: <Home />,
          },
          {
            path: "/users",
            element: <Users />,
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
