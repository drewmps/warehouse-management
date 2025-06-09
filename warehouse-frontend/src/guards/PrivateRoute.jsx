import { Navigate, Outlet } from "react-router";

export default function PrivateRoute() {
  const access_token = localStorage.getItem("access_token");
  return access_token ? <Outlet /> : <Navigate to="/login" />;
}
