import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "../store";

const NonAuth = () => {
  const { user } = useAuthState();
  if (user !== null) {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default NonAuth;
