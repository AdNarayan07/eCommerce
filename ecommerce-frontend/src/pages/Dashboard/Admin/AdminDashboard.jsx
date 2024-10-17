import React, { useState } from "react";
import Users from "./Users"; // Import Users component
import Orders from "../../../components/Orders"; // Import Orders component

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Users"); // State to manage the active tab

  return (
    <div className="p-4 flex flex-col items-center h-full">
      <h1 className="text-2xl font-bold mb-4 w-full">Admin Dashboard</h1> {/* Dashboard title */}
      <div className="mb-4 flex space-x-4 w-full">
        {/* Button for Users tab */}
        <button
          className={`px-4 py-2 border rounded ${
            activeTab === "Users" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("Users")} // Set active tab to Users
        >
          Users
        </button>
        {/* Button for Orders tab */}
        <button
          className={`px-4 py-2 border rounded ${
            activeTab === "Orders" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("Orders")} // Set active tab to Orders
        >
          Orders
        </button>
      </div>

      {/* Render content based on the active tab */}
      {activeTab === "Users" && <Users />} {/* Display Users component if active tab is Users */}
      {activeTab === "Orders" && <Orders by={"admin"} />} {/* Display Orders component if active tab is Orders */}
    </div>
  );
};

export default AdminDashboard;
