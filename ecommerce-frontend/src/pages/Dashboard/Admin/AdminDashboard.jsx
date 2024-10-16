import React, { useState } from "react";
import Users from "./Users";
import Orders from "../../../components/Orders";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Users");

  return (
    <div className="p-4 flex flex-col items-center h-full">
      <h1 className="text-2xl font-bold mb-4 w-full">Admin Dashboard</h1>
      <div className="mb-4 flex space-x-4 w-full">
        <button
          className={`px-4 py-2 border rounded ${activeTab === "Users" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("Users")}
        >
          Users
        </button>
        <button
          className={`px-4 py-2 border rounded ${activeTab === "Orders" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("Orders")}
        >
          Orders
        </button>
      </div>

      <div className="tab-content mt-4">
        {activeTab === "Users" && <Users />}
        {activeTab === "Orders" && <Orders by={"admin"}/>}
      </div>
    </div>
  );
};

export default AdminDashboard;
