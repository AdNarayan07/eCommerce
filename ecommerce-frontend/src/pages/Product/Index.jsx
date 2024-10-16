import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchProduct,
  getComments,
} from "../../app/API/productsApi";

import CommentSection from "./CommentSection";
import { useParams } from "react-router-dom";
import nprogress, { set } from "nprogress";
import { setPending } from "../../app/slice/transitionSlice";
import Loading from "../../components/Loading";
import NotFoundPage from "../Errors/404";
import EditProduct from "./EditProduct";
import ViewProduct from "./ViewProduct";

const Product = () => {
  const { id } = useParams();
  const productFromStore = useSelector((state) => state.products.products?.find((p) => p.id == id));

  const dispatch = useDispatch();

  const [product, setProduct] = useState(productFromStore || {});
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch product data if not in Redux store
  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!productFromStore) {
          console.log("Fetching the product, not found in global storage!");
          const data = await fetchProduct(id);
          setProduct(data);
        } else setProduct(productFromStore);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    const fetchComments = async () => {
      try {
        const data = await getComments(id);
        console.log(data);
        setComments(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    loadProduct().then(() => fetchComments().then(() => nprogress.done()));
    dispatch(setPending(false));
  }, [productFromStore, id]);

  if (!product) return <NotFoundPage />;

  return product.name ? (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 mb-8 relative">
        {isEditing ? (
          <EditProduct setIsEditing={setIsEditing} product={product} setProduct={setProduct} />
        ) : (
          <ViewProduct product={product} setIsEditing={setIsEditing} />
        )}
      </div>
      <CommentSection comments={comments} product={product} />
    </div>
  ) : (
    <Loading component={"Product"} />
  );
};

export default Product;
