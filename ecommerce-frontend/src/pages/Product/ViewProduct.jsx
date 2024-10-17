import { useParams } from "react-router-dom";
import ImageWithFallback from "../../components/ImageWithFallback";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useNavigateTransition from "../../utils/useNavigateTransition";
import { buyProduct } from "../../app/API/productsApi";
import { handleError } from "../../utils/functions";

const ViewProduct = ({ product, setIsEditing }) => {
  const { id } = useParams(); // Get product ID from URL parameters
  const navigateTransition = useNavigateTransition();

  const user = useSelector((state) => state.auth.user); // Get user from Redux store
  const token = useSelector((state) => state.auth.token); // Get token from Redux store
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1); // State for quantity of the product
  const [price, setPrice] = useState(0); // State for calculated price
  const [deliveryFee, setDeliveryFee] = useState(40); // Default delivery fee
  const [totalAmount, setTotalAmount] = useState(0); // State for total amount

  useEffect(() => {
    // Calculate price and delivery fee based on quantity
    const price = quantity * product?.price || 0;
    setPrice(price);
    if (price >= 1000) setDeliveryFee(0); // Free delivery for orders above ₹1000
    else setDeliveryFee(40); // Standard delivery fee
  }, [quantity, product]);

  useEffect(() => {
    // Update total amount when price or delivery fee changes
    setTotalAmount(price + deliveryFee);
  }, [price, deliveryFee]);

  // Handle quantity change
  const handleQuantityChange = (event) => {
    const qty = parseInt(event.target.value);
    setQuantity(qty);
  };

  const handleBuy = async () => {
    // Handle product purchase
    try {
      const data = await buyProduct(id, { quantity, price, deliveryFee }, token); // Purchase product
      alert("Order placed with id: " + data.id); // Notify user of successful order
    } catch (err) {
      handleError(err, navigateTransition, dispatch); // Handle error during purchase
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mb-6">{product.name}</h1>
      <ImageWithFallback
        src={id}
        fallbackSrc="/images/default.jpg"
        className="float-right w-1/3 h-auto rounded-lg shadow-md ml-6 mb-4"
      />
      <p className="text-lg text-gray-700 mb-4">{product.shortDescription}</p>
      <div className="prose mb-6">
        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{product.detailedDescription}</ReactMarkdown>
      </div>
      <p className="text-2xl font-bold text-green-600 mb-6">₹{product.price?.toFixed?.(2)}</p>
      <hr className="mb-4 border-2 w-full" />
      {user?.username === product.seller ? ( // If the logged-in user is the seller
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => setIsEditing(true)} // Set editing mode
          >
            Edit Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto p-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg h-fit">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-blue-600">Limited Time Offer!</h3>
              <p className="text-gray-700">Get free delivery on orders over ₹1000!</p>
            </div>
          </div>
          <div className="flex flex-col items-end w-full text-right">
            <div className="clear-both flex items-center justify-end space-x-4 mb-6">
              <label htmlFor="quantity" className="font-medium text-lg">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="border border-gray-300 rounded-lg px-4 py-2 w-20 text-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-lg font-semibold text-gray-800 mb-6 space-y-2">
              <p className="text-xl">
                Price ({quantity || 0} items):{" "}
                <span className="font-bold text-green-600">₹{price.toFixed(2)}</span>
              </p>
              <p className="text-xl">
                Delivery Fee:{" "}
                <span className="font-bold text-red-500">₹{deliveryFee.toFixed(2)}</span>
              </p>
              <hr className="my-2 border-black" />
              <p className="text-2xl font-bold">
                Total Price: <span className="text-blue-600">₹{totalAmount.toFixed(2)}</span>
              </p>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105 disabled:opacity-85 disabled:cursor-not-allowed"
              onClick={handleBuy}
            >
              {token ? "Buy Now" : "Login to Buy"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewProduct;
