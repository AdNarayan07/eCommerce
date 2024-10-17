import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchProduct,
  getComments,
} from "../../app/API/productsApi";

import CommentSection from "./CommentSection";
import { useParams } from "react-router-dom";
import nprogress from "nprogress";
import { setPending } from "../../app/slice/transitionSlice";
import Loading from "../../components/Loading";
import NotFoundPage from "../Errors/404";
import EditProduct from "./EditProduct";
import ViewProduct from "./ViewProduct";

const Product = () => {
  const { id } = useParams(); // Get product ID from URL parameters
  const productFromStore = useSelector((state) => state.products.products?.find((p) => p.id == id)); // Select product from Redux store

  const dispatch = useDispatch();

  const [product, setProduct] = useState(productFromStore || {}); // State for product details
  const [comments, setComments] = useState([]); // State for product comments
  const [isEditing, setIsEditing] = useState(false); // State to toggle editing mode

  // Fetch product data and comments
  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!productFromStore) { // If product is not found in store
          console.log("Fetching the product, not found in global storage!");
          const data = await fetchProduct(id); // Fetch product data from API
          setProduct(data); // Update product state
        } else {
          setProduct(productFromStore); // Use product from Redux store
        }
      } catch (err) {
        console.error("Error fetching product:", err); // Log any fetch errors
      }
    };

    const fetchComments = async () => {
      try {
        const data = await getComments(id); // Fetch comments for the product
        console.log(data); // Log comments data
        setComments(data); // Update comments state
      } catch (err) {
        console.error("Error fetching reviews:", err); // Log any fetch errors
      }
    };

    loadProduct().then(() => fetchComments().then(() => nprogress.done())); // Load product and comments
    dispatch(setPending(false)); // Set loading state to false
  }, [productFromStore, id]);

  if (!product) return <NotFoundPage />; // Return 404 if product is not found

  return product.name ? ( // Check if product name exists
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 mb-8 relative">
        {isEditing ? ( // Render EditProduct or ViewProduct based on editing state
          <EditProduct setIsEditing={setIsEditing} product={product} setProduct={setProduct} />
        ) : (
          <ViewProduct product={product} setIsEditing={setIsEditing} />
        )}
      </div>
      <CommentSection comments={comments} product={product} />
    </div>
  ) : (
    <Loading component={"Product"} /> // Show loading component if product is still being fetched
  );
};

export default Product;
