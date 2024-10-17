import React, { useState } from "react";
import AddProduct from "./AddProduct";
import Products from "./Products";
import Orders from "../../../components/Orders";

const SellerDashboard = () => {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState("addProduct");

  // Render content based on the selected tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "addProduct": return <AddProduct />; // Render AddProduct component
      case "products": return <Products />;     // Render Products component
      case "orders": return <Orders by={"seller"}/>; // Render Orders component for seller
      default: return null;                     // Return null for any unmatched tab
    }
  };

  return (
    <div className="p-4 flex flex-col items-center h-full">
      <h1 className="text-2xl font-bold mb-4 w-full">Seller Dashboard</h1>

      {/* Tab Navigation */}
      <div className="mb-4 flex space-x-4 w-full">
        {/* Button to switch to Add Product tab */}
        <button
          onClick={() => setActiveTab("addProduct")}
          className={`px-4 py-2 border rounded ${
            activeTab === "addProduct" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Add Product
        </button>
        
        {/* Button to switch to My Products tab */}
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 border rounded ${
            activeTab === "products" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          My Products
        </button>
        
        {/* Button to switch to My Orders tab */}
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 border rounded ${
            activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          My Orders
        </button>
      </div>

      {/* Display content for the active tab */}
      {renderTabContent()}
    </div>
  );
};

export default SellerDashboard;
