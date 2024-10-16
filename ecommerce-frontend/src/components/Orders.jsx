import { useEffect, useState } from "react";
import {
  cancel,
  updateOrderStatus,
  fetchAllOrders,
  fetchOrdersBySeller,
  fetchOrdersByShopper,
} from "../app/API/ordersApi";
import { useDispatch, useSelector } from "react-redux";
import useNavigateTransition from "../hooks/useNavigateTransition";
import { handleError, color } from "../hooks/functions";
import Loading from "./Loading";
import nProgress from "nprogress";

const Orders = ({ by }) => {
  const token = useSelector((state) => state.auth.token);
  const [orders, setOrders] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const navigateTransition = useNavigateTransition();
  const dispatch = useDispatch();

  const disabled = (status) => {
    return by === "seller"
      ? status !== "Placed"
      : status === "Delivered" || status.startsWith("Cancelled");
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        nProgress.start();
        let fetchOrder;
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
        const data = await fetchOrder(token);
        setOrders(data);
      } catch (err) {
        handleError(err, navigateTransition, dispatch, false);
      } finally {
        nProgress.done();
      }
    };
    loadOrders();
  }, []);

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

  const handleCancel = async (id) => {
    try {
      const pakka = confirm(`Do you want to cancel the order?`);
      if (pakka) {
        nProgress.start()
        const data = await cancel(id, token);
        setOrders((orders) => orders.map((o) => (o.id === id ? data : o)));
        alert(`Order ${id} cancelled`);
      }
    } catch (err) {
      handleError(err, navigateTransition, dispatch);
    } finally {
      nProgress.done()
    }
  };

  const handleStatusUpdate = async (id) => {
    try {
      nProgress.start()
      const data = await updateOrderStatus(id, token, {status: selectedStatus[id]});
      setOrders((orders) => orders.map((o) => (o.id === id ? data : o)));
      alert(`Order ${id} status updated to ${selectedStatus[id]}`);
    } catch (err) {
      handleError(err, navigateTransition, dispatch);
    } finally {
      nProgress.done()
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setSelectedStatus((prev) => ({ ...prev, [id]: newStatus }));
  };

  return !orders ? (
    <Loading component={"Orders"} />
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
              {by === "admin" ? "Update Status" : "Cancel Order"}
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.map?.((o) => (
            <tr key={o.id} className="border-b">
              <td
                className="py-2 px-4 cursor-pointer hover:underline"
                onClick={() => navigateTransition(`/order/${o.id}`)}
              >
                #{o.id}
              </td>
              <td
                className="py-2 px-4 font-bold text-red-950 cursor-pointer hover:underline"
                onClick={() => navigateTransition(`/product/${o.Product?.id}`)}
              >
                <div className="flex items-center">
                  <span className="px-2 py-0.5 rounded bg-red-100 text-xs mr-2">
                    #{o.Product?.id || 0}
                  </span>
                  {o.Product?.name || "Deleted Product"}
                </div>
              </td>
              <td className="py-2 px-4 text-center">
                <span
                  className={`px-2 py-0.5 rounded bg-${color(
                    o.status
                  )}-50 text-sm border border-${color(o.status)}-950 text-${color(
                    o.status
                  )}-950 font-semibold`}
                >
                  {o.status}
                </span>
              </td>
              <td className="py-2 px-4 text-right">{FormattedDate(o.createdAt)}</td>
              <td className="py-2 px-4 text-right">{FormattedDate(o.updatedAt)}</td>
              {by !== "admin" ? (
                <td className="py-2 px-4 text-center">
                  <button
                    className="bg-red-600 px-2 py-0.5 rounded text-white disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => handleCancel(o.id)}
                    disabled={disabled(o.status)}
                  >
                    Cancel
                  </button>
                </td>
              ) : (
                <td className="py-2 px-4 text-center">
                  <select
                    value={selectedStatus[o.id] || o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="bg-gray-100 px-2 py-0.5 rounded border border-gray-300"
                    disabled={o.status.startsWith("Cancelled")}
                  >
                    <option value="Placed">Placed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    {o.status.startsWith("Cancelled") && <>
                      <option value="Cancelled by Seller">Cancelled by Seller</option>
                      <option value="Cancelled by Shopper">Cancelled by Shopper</option></>}
                  </select>
                  <button
                    className="ml-2 bg-blue-600 px-2 py-0.5 rounded text-white"
                    onClick={() => handleStatusUpdate(o.id)}
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
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100 font-semibold text-4xl p-10">
      <p className="text-8xl">:(</p>
      <p className="mt-8">No Orders</p>
    </div>
  );
};

export default Orders;
