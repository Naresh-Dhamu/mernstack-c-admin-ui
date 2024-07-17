import { Outlet, Navigate } from "react-router-dom";
import { useAuthState } from "../store";

const Dashborad = () => {
  const { user } = useAuthState();
  if (user === null) {
    return <Navigate to="/auth/login" replace={true} />;
  }
  return (
    <div>
      Dashborad Components
      <Outlet />
    </div>
  );
};

export default Dashborad;
