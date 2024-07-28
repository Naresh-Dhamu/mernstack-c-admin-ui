import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { self } from "../http/api";
import { useAuthState } from "../store";
import { LoadingOutlined } from "@ant-design/icons";

import { AxiosError } from "axios";
const getself = async () => {
  const { data } = await self();
  return data;
};
const Root = () => {
  const { setUser } = useAuthState();
  const { data, isLoading } = useQuery({
    queryKey: ["self"],
    queryFn: getself,
    retry: (failureCount: number, error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false;
      }

      return failureCount < 3;
    },
  });
  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);
  if (isLoading) {
    document.title = "Loading...";
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LoadingOutlined style={{ fontSize: 60, color: "#1890ff" }} spin />
      </div>
    );
  }
  document.title = "PIZZ";

  return <Outlet />;
};

export default Root;
