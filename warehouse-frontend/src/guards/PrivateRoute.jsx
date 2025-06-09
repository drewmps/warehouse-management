import { Link, Navigate, Outlet, useNavigate } from "react-router";

export default function PrivateRoute() {
  const access_token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("access_token");
    navigate("/");
  }
  return access_token ? (
    <>
      <div className="navbar bg-base-100 shadow-sm flex justify-between">
        <Link to={"/"} className="btn btn-ghost text-xl">
          Warehouse
        </Link>
        <button className="btn" onClick={handleLogout}>
          Log out
        </button>
      </div>
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
}
