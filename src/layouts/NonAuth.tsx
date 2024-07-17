import { Outlet } from "react-router-dom";

const NonAuth = () => {
  return (
    <div>
      Non Auth Componets
      <Outlet />
    </div>
  );
};

export default NonAuth;
