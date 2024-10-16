import React from "react";
import { useSelector } from "react-redux";
import SellerDashboard from "./Selller/SellerDashboard";
import AdminDashboard from "./Admin/AdminDashboard";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import nprogress from "nprogress";
import NotAllowedPage from "../Errors/403";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  useAuthRedirect(false, "/login");

  nprogress.done();

  return (
    <>
      {user?.role === "admin" && <AdminDashboard />}
      {user?.role === "seller" && <SellerDashboard />}
      {user?.role === "shopper" && <NotAllowedPage />}
    </>
  );
};

export default Dashboard;
