import { useEffect, useState } from "react";
import { fetchProductsBySeller, removeProduct } from "../../../app/API/productsApi";
import { useDispatch, useSelector } from "react-redux";
import useNavigateTransition from "../../../utils/useNavigateTransition";
import nProgress from "nprogress";
import NoProductsAvailable from "../../../components/NoProductsAvailable";
import { handleError } from "../../../utils/functions";
import Loading from "../../../components/Loading";

const Products = () => {
  const user = useSelector((state) => state.auth.user); // Get the logged-in user
  const token = useSelector((state) => state.auth.token); // Get the authentication token
  const [products, setProducts] = useState(null); // State to hold the products
  const navigateTransition = useNavigateTransition(); // Custom hook for navigation transitions

  useEffect(() => {
    const loadProducts = async () => {
      try {
        nProgress.start(); // Start loading progress
        const data = await fetchProductsBySeller(token, user.username); // Fetch products for the seller
        console.log(data); // Log fetched data
        setProducts(data); // Update state with fetched products
      } catch (err) {
        handleError(err, navigateTransition, useDispatch, false); // Handle errors
      } finally {
        nProgress.done(); // End loading progress
      }
    };
    loadProducts(); // Call function to load products
  }, []); // Empty dependency array to run only once on mount

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent click event from bubbling
    try {
      const pakka = confirm(`Do you want to delete product ${id}?`); // Confirm deletion
      if (pakka) {
        nProgress.start(); // Start loading progress
        await removeProduct(id, token); // Delete the product
        setProducts((products) => products.filter((p) => p.id !== id)); // Update state to remove deleted product
        alert(`Product ${id} deleted`); // Notify user of successful deletion
      }
    } catch (err) {
      handleError(err, navigateTransition, useDispatch); // Handle errors
    } finally {
      nProgress.done(); // End loading progress
    }
  };

  return (
    <div className="w-full h-full flex-grow">
      {/* Show loading component if products are not yet loaded */}
      {!products ? (
        <Loading component={"Products"} />
      ) : products.length ? (
        <ul>
          {/* Map through products and display each one */}
          {products?.map?.((p) => {
            return (
              <li
                key={p.id}
                onClick={() => navigateTransition(`/product/${p.id}`)} // Navigate to product details on click
                className="flex items-center justify-between space-x-4 p-4 rounded bg-gray-100 my-2 cursor-pointer"
              >
                <div className="flex space-x-4">
                  {/* Display product ID and details */}
                  <div className="px-2 py-0.5 h-fit rounded bg-gray-300">#{p.id}</div>
                  <div className="flex flex-col space-y-1">
                    <div className="font-bold">{p.name}</div>
                    <div className="text-sm">{p.shortDescription}</div>
                  </div>
                </div>
                {/* Button to delete the product */}
                <button
                  className="bg-red-600 px-2 py-0.5 rounded text-white"
                  onClick={(e) => handleDelete(e, p.id)} // Call handleDelete on click
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        // Show message if no products are available
        <NoProductsAvailable />
      )}
    </div>
  );
};

export default Products;
