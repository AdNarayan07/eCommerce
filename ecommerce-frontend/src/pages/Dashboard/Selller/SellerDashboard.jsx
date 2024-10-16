import React, { useState } from "react";
import AddProduct from "./AddProduct";
import Products from "./Products";
import Orders from "../../../components/Orders";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("addProduct"); // Tab state

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "addProduct": return <AddProduct />;
      case "products": return <Products />;
      case "orders": return <Orders by={"seller"}/>;
      default: return null;
    }
  };

  return (
    <div className="p-4 flex flex-col items-center h-full">
      <h1 className="text-2xl font-bold mb-4 w-full">Seller Dashboard</h1>

      {/* Tab Navigation */}
      <div className="mb-4 flex space-x-4 w-full">
        <button
          onClick={() => setActiveTab("addProduct")}
          className={`px-4 py-2 border rounded ${
            activeTab === "addProduct" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Add Product
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 border rounded ${
            activeTab === "products" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          My Products
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 border rounded ${
            activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          My Orders
        </button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default SellerDashboard;
