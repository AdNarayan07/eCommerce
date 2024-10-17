import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../app/API/productsApi";
import { setProducts } from "../app/slice/productsSlice";
import nprogress from "nprogress";
import ImageWithFallback from "../components/ImageWithFallback";
import useNavigateTransition from "../hooks/useNavigateTransition";
import Loading from "../components/Loading";
import NoProductsAvailable from "../components/NoProductsAvailable"

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const navigateTransition = useNavigateTransition();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        dispatch(setProducts(data));
        nprogress.done();
      } catch (err) {
        console.log(err);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="p-4 w-full h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      {!products ? (
        <Loading component={"Products"}/>
      ) : (
        products.length ? <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-fit">
          {products?.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-lg shadow-md p-4 transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => navigateTransition(`/product/${product.id}`)}
            >
              <h2 className="font-semibold text-xl mb-2 flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-gray-200 rounded text-sm">#{product.id}</span>
                <span>{product.name}</span>
              </h2>
              <div className="h-60 flex items-center justify-center bg-gray-200 mb-4 rounded p-2">
              <ImageWithFallback
                src={product.id} // Primary image URL
                alt={product.name} // Alt text for accessibility
                fallbackSrc="/images/default.jpg" // Fallback image URL
                className="max-h-[-webkit-fill-available] max-w-[-webkit-fill-available]"
              />
              </div>

              <p className="mb-4">
                {product.shortDescription}
              </p>

              <div className="flex flex-wrap text-gray-600 mb-1">
                <span className="px-2 py-0.5 m-1 bg-green-200 rounded text-sm font-medium">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className={`px-2 py-0.5 m-1 ${product.quantity < 10 ? "bg-red-600 text-white" : "bg-yellow-300"} rounded text-sm font-medium`}>
                  Stock: {product.quantity}
                </span>
                <span className="px-2 py-0.5 m-1 bg-blue-200 rounded text-sm font-medium">
                  Seller: {product.seller || "Unknown"}
                </span>
              </div>
            </div>
          ))}
        </div> : <NoProductsAvailable />
      )}
    </div>
  );
};

export default Home;
