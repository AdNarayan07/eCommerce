import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchOrder } from "../app/API/ordersApi";
import { setPending } from "../app/slice/transitionSlice";
import { useDispatch, useSelector } from "react-redux";
import nProgress from "nprogress";
import NotAllowedPage from "./Errors/403";
import NotFoundPage from "./Errors/404";
import ISEpage from "./Errors/500";
import { handleError, color } from "../hooks/functions";
import useNavigateTransition from "../hooks/useNavigateTransition";
import Loading from "../components/Loading";
import ImageWithFallback from "../components/ImageWithFallback";

const Order = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigateTransition = useNavigateTransition();

  const [order, setOrder] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await fetchOrder(id, token);
        console.log("meow", data);
        setOrder(data);
        setErr(null);
      } catch (err) {
        handleError(err, navigateTransition, dispatch, false);
        setErr(err);
      } finally {
        dispatch(setPending(false));
        nProgress.done();
      }
    };
    loadOrder();
  }, []);

  const OrderPage = () => {
    const Product = order.Product;
    const buyer = order.User;
    const seller = Product?.User;

    const statusStagesCancelled = ["Placed", order.status];
    const statusStagesNormal = ["Placed", "Shipped", "Out for Delivery", "Delivered"];

    const isCancelled =
      order.status === "Cancelled by Seller" || order.status === "Cancelled by Shopper";

    // Use either the cancelled stages or normal stages based on the order status
    const statusStages = isCancelled ? statusStagesCancelled : statusStagesNormal;

    // Function to calculate the progress bar width based on status
    const calculateProgressWidth = () => {
      const currentIndex = statusStages.indexOf(order.status);
      const totalStages = statusStages.length - 1;
      return (currentIndex / totalStages) * 100;
    };

    const totalPrice = order.price;
    const deliveryCharges = order.deliveryFee;
    const totalAmount = totalPrice + deliveryCharges;

    return (
      <div className="container mx-auto p-6">
        {/* Order Status Progress Bar */}
        <div className="w-full bg-gray-300 rounded-full h-2.5 mb-1">
          <div
            className={`bg-${color(order.status)}-600 h-2.5 rounded-full`}
            style={{ width: `${calculateProgressWidth()}%` }}
          ></div>
        </div>
        {/* Status Names Below Progress Bar */}
        <div className="flex justify-between text-sm text-gray-700 mb-6">
          {statusStages.map((stage, index) => (
            <span
              key={index}
              className={`${stage === order.status ? `font-bold text-${color(stage)}-950` : ""}`}
            >
              {stage}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            {/* Seller Address */}
            <div className="bg-gray-100 p-6 rounded-lg mb-6 border border-gray-300 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">
                Seller Address
              </h3>
              {!seller ? (
                <p className="italic">Product and its Info are Deleted</p>
              ) : (
                <>
                  <p className="text-gray-700 font-bold">{seller.displayname}</p>
                  <pre className="text-gray-700 whitespace-pre-wrap font-[inherit] leading-relaxed mb-2">
                    {seller.address}
                  </pre>
                  <p className="text-gray-700">
                    <span className="font-semibold">Email: </span>
                    {seller.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Phone: </span>
                    {seller.phone}
                  </p>
                </>
              )}
            </div>

            {/* Buyer Address */}
            <div className="bg-gray-100 p-6 rounded-lg border border-gray-300 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-300">
                Buyer Address
              </h3>
              {!buyer ? (
                <p className="italic">Buyer Account Deleted</p>
              ) : (
                <>
                  <p className="text-gray-700 font-bold">{buyer.displayname}</p>
                  <pre className="text-gray-700 whitespace-pre-wrap font-[inherit] leading-relaxed mb-2">
                    {buyer.address}
                  </pre>
                  <p className="text-gray-700">
                    <span className="font-semibold">Email: </span>
                    {buyer.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Phone: </span>
                    {buyer.phone}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Right Column - Product Details and Order Summary */}
          <div className="bg-gray-100 flex flex-wrap p-4 border-2 rounded-lg h-fit">
            <ImageWithFallback
              src={Product.id}
              fallbackSrc="/images/default.jpg"
              className="max-w-64 max-h-96 rounded-lg object-cover mr-4"
            />

            {/* Order Summary */}
            <div className="mt-4">
              <div>
                <h3 className="text-lg font-semibold">{Product?.name || <i>Deleted Product</i>}</h3>
                <hr className="border-gray-400 border-b mb-2" />
                <p className="text-gray-600">{Product?.shortDescription}</p>
                <p className={`text-green-600 font-bold ${!Product?.price && "italic"}`}>₹{Product?.price || totalPrice/order.quantity}</p>
              </div>
              <h3 className="text-lg font-semibold mt-4">Order Summary</h3>
              <hr className="border-gray-400 border-b mb-2" />
              <ul className="space-y-2">
                <li className="flex space-x-4 justify-between">
                  <span>Total Units Ordered</span>
                  <span>{order.quantity}</span>
                </li>
                <li className="flex space-x-4 justify-between">
                  <span>Total Price</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </li>
                <li className="flex space-x-4 justify-between">
                  <span>Delivery Charges</span>
                  <span>₹{deliveryCharges.toFixed(2)}</span>
                </li>
                <li className="flex space-x-4 justify-between font-bold">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (err) {
    switch (err.status) {
      case 403:
        return <NotAllowedPage />;
      case 404:
        return <NotFoundPage />;
      default:
        return <ISEpage />;
    }
  }
  return !order ? <Loading component={"Order"} /> : <OrderPage />;
};

export default Order;
