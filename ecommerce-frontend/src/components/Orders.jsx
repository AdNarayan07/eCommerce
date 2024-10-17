import { useEffect, useState } from "react";
import {
  cancel,
  updateOrderStatus,
  fetchAllOrders,
  fetchOrdersBySeller,
  fetchOrdersByShopper,
} from "../app/API/ordersApi"; // API functions for fetching and managing orders
import { useDispatch, useSelector } from "react-redux"; // Redux hooks for dispatch and accessing state
import useNavigateTransition from "../utils/useNavigateTransition"; // Custom navigation hook
import { handleError, color } from "../utils/functions"; // Utility functions (error handling, color mapping)
import Loading from "./Loading"; // Loading component
import nProgress from "nprogress"; // Library for displaying progress bar

const Orders = ({ by }) => {
  const token = useSelector((state) => state.auth.token); // Get token from Redux state
  const [orders, setOrders] = useState(null); // Store orders
  const [selectedStatus, setSelectedStatus] = useState({}); // Track status changes for orders
  const navigateTransition = useNavigateTransition(); // Handle navigation with transition effect
  const dispatch = useDispatch(); // Redux dispatch function

  // Disable "Cancel" or "Update" buttons based on order status and user type
  const disabled = (status) => {
    return by === "seller"
      ? status !== "Placed" // Sellers can only cancel "Placed" orders
      : status === "Delivered" || status.startsWith("Cancelled"); // Shoppers can't cancel delivered or canceled orders
  };

  // Fetch orders based on user role (admin, seller, shopper) on component mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        nProgress.start(); // Start progress bar
        let fetchOrder;
        // Determine which fetch function to use based on 'by' prop
        switch (by) {
          case "seller":
            fetchOrder = fetchOrdersBySeller;
            break;
          case "shopper":
            fetchOrder = fetchOrdersByShopper;
            break;
          default:
            fetchOrder = fetchAllOrders;
        }
        const data = await fetchOrder(token); // Fetch orders using the appropriate API
        setOrders(data); // Set fetched orders in state
      } catch (err) {
        handleError(err, navigateTransition, dispatch, false); // Handle errors
      } finally {
        nProgress.done(); // Stop progress bar
      }
    };
    loadOrders();
  }, []);

  // Format and display date and time
  function FormattedDate(date) {
    const dateStr = new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
    });
    const timeStr = new Date(date).toLocaleString("en-IN", {
      timeStyle: "short",
    });
    return (
      <>
        <div className="font-bold text-blue-950">{dateStr}</div>
        <div className="text-xs font-semibold">{timeStr}</div>
      </>
    );
  }

  // Handle order cancellation
  const handleCancel = async (id) => {
    try {
      const pakka = confirm(`Do you want to cancel the order?`); // Confirm cancellation
      if (pakka) {
        nProgress.start(); // Start progress bar
        const data = await cancel(id, token); // Call API to cancel order
        setOrders((orders) => orders.map((o) => (o.id === id ? data : o))); // Update order in state
        alert(`Order ${id} cancelled`); // Show success message
      }
    } catch (err) {
      handleError(err, navigateTransition, dispatch); // Handle errors
    } finally {
      nProgress.done(); // Stop progress bar
    }
  };

  // Handle status update for orders
  const handleStatusUpdate = async (id) => {
    try {
      nProgress.start(); // Start progress bar
      const data = await updateOrderStatus(id, token, { status: selectedStatus[id] }); // Call API to update status
      setOrders((orders) => orders.map((o) => (o.id === id ? data : o))); // Update order in state
      alert(`Order ${id} status updated to ${selectedStatus[id]}`); // Show success message
    } catch (err) {
      handleError(err, navigateTransition, dispatch); // Handle errors
    } finally {
      nProgress.done(); // Stop progress bar
    }
  };

  // Update selected status when dropdown changes
  const handleStatusChange = (id, newStatus) => {
    setSelectedStatus((prev) => ({ ...prev, [id]: newStatus }));
  };

  // Render loading spinner or orders table based on state
  return !orders ? (
    <Loading component={"Orders"} /> // Show loading spinner if orders not fetched yet
  ) : orders.length ? (
    <div className="w-fit bg-white p-6 rounded shadow-md">
      <table className="min-w-full bg-gray-100 rounded my-2">
        <thead>
          <tr className="bg-gray-300 text-gray-800 text-left">
            <th className="py-2 px-4">Order ID</th>
            <th className="py-2 px-4">Product</th>
            <th className="py-2 px-4 text-center">Status</th>
            <th className="py-2 px-4 text-right">Order Placed</th>
            <th className="py-2 px-4 text-right">Last Update</th>
            <th className="py-2 px-4 text-center">
              {by === "admin" ? "Update Status" : "Cancel Order"} {/* Display appropriate action */}
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.map?.((o) => (
            <tr key={o.id} className="border-b">
              <td
                className="py-2 px-4 cursor-pointer hover:underline"
                onClick={() => navigateTransition(`/order/${o.id}`)} // Navigate to order details
              >
                #{o.id}
              </td>
              <td
                className="py-2 px-4 font-bold text-red-950 cursor-pointer hover:underline"
                onClick={() => navigateTransition(`/product/${o.Product?.id}`)} // Navigate to product details
              >
                <div className="flex items-center">
                  <span className="px-2 py-0.5 rounded bg-red-100 text-xs mr-2">
                    #{o.Product?.id || 0}
                  </span>
                  {o.Product?.name || "Deleted Product"} {/* Handle deleted product */}
                </div>
              </td>
              <td className="py-2 px-4 text-center">
                <span
                  className={`px-2 py-0.5 rounded bg-${color(
                    o.status
                  )}-50 text-sm border border-${color(o.status)}-950 text-${color(
                    o.status
                  )}-950 font-semibold`} // Apply dynamic color styling based on status
                >
                  {o.status}
                </span>
              </td>
              <td className="py-2 px-4 text-right">{FormattedDate(o.createdAt)}</td> {/* Order date */}
              <td className="py-2 px-4 text-right">{FormattedDate(o.updatedAt)}</td> {/* Last update date */}
              {by !== "admin" ? (
                <td className="py-2 px-4 text-center">
                  <button
                    className="bg-red-600 px-2 py-0.5 rounded text-white disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => handleCancel(o.id)} // Cancel order
                    disabled={disabled(o.status)} // Disable button if conditions met
                  >
                    Cancel
                  </button>
                </td>
              ) : (
                <td className="py-2 px-4 flex justify-between">
                  <select
                    value={selectedStatus[o.id] || o.status} // Show current or updated status
                    onChange={(e) => handleStatusChange(o.id, e.target.value)} // Update selected status
                    className="bg-gray-100 px-2 py-0.5 rounded border border-gray-300 disabled:cursor-not-allowed"
                    disabled={o.status.startsWith("Cancelled")} // Disable if order is cancelled
                  >
                    <option value="Placed">Placed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    {o.status.startsWith("Cancelled") && ( // Display cancellation options for cancelled orders
                      <>
                        <option value="Cancelled by Seller">Cancelled by Seller</option>
                        <option value="Cancelled by Shopper">Cancelled by Shopper</option>
                      </>
                    )}
                  </select>
                  <button
                    className="ml-2 bg-blue-600 px-2 py-0.5 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleStatusUpdate(o.id)} // Update order status
                    disabled={o.status.startsWith("Cancelled")} // Disable if order is cancelled
                  >
                    Update
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    // Show empty state if no orders are found
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100 font-semibold text-4xl p-10">
      <p className="text-8xl">:(</p>
      <p className="mt-8">No Orders</p>
    </div>
  );
};

export default Orders;
