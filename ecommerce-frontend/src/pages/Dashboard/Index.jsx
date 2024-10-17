import React from "react";
import { useSelector } from "react-redux";
import SellerDashboard from "./Selller/SellerDashboard"; // Importing SellerDashboard component
import AdminDashboard from "./Admin/AdminDashboard"; // Importing AdminDashboard component
import useAuthRedirect from "../../utils/useAuthRedirect"; // Custom hook for authentication redirection
import nprogress from "nprogress"; // Importing NProgress for loading indicator
import NotAllowedPage from "../Errors/403"; // Importing a component for unauthorized access

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user); // Get user details from Redux store
  useAuthRedirect(false, "/login"); // Redirects to login if not authenticated

  nprogress.done(); // Stops the progress indicator

  return (
    <>
      {/* Render different dashboards based on user role */}
      {user?.role === "admin" && <AdminDashboard />} {/* Admin dashboard for admin users */}
      {user?.role === "seller" && <SellerDashboard />} {/* Seller dashboard for seller users */}
      {user?.role === "shopper" && <NotAllowedPage />} {/* Not allowed page for shoppers */}
    </>
  );
};

export default Dashboard;
