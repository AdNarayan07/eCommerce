import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../../app/API/productsApi";
import { useState } from "react";
import { handleError } from "../../../utils/functions";
import useNavigateTransition from "../../../utils/useNavigateTransition";
import nProgress from "nprogress";

const AddProduct = () => {
  // State to hold product details and validation errors
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    image: null,
    shortDescription: "",
    detailedDescription: "",
  });
  const [errors, setErrors] = useState({}); // New state for errors

  const token = useSelector((state) => state.auth.token);
  const navigateTransition = useNavigateTransition();
  const dispatch = useDispatch();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes for image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const data = reader.result;
      setProduct((prev) => ({
        ...prev,
        image: {
          data,
          name: file.name,
        },
      }));
    };

    const maxFileSize = 5 * 1024 * 1024; // 5 MB
    if (file) {
      if (file.size > maxFileSize) {
        setErrors((prev) => ({ ...prev, image: "File size exceeds the limit of 5 MB." }));
        setProduct((prev) => ({ ...prev, image: null }));
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const { name, price, quantity } = product;
    const newErrors = {};
    if (!name) newErrors.name = "Product name is required.";
    if (!price) newErrors.price = "Price is required.";
    if (!quantity) newErrors.quantity = "Quantity is required.";
    setErrors(newErrors); // Update the errors state
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) return; // Stop submission if there are errors

    try {
      nProgress.start();
      const data = await addProduct(product, token);
      setProduct({
        name: "",
        price: "",
        quantity: "",
        image: null,
        shortDescription: "",
        detailedDescription: "",
      });
      alert("Product created with id: " + data.id);
    } catch (err) {
      handleError(err, dispatch, navigateTransition);
    } finally {
      nProgress.done();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded">
      {/* Input for product name */}
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <p className="text-red-500 text-xs mb-1">{errors.name || "ㅤ"}</p>

      {/* Input for product price */}
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <p className="text-red-500 text-xs mb-1">{errors.price || "ㅤ"}</p>

      {/* Input for product quantity */}
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={product.quantity}
        onChange={handleChange}
        className="border p-2 w-full"
      />
      <p className="text-red-500 text-xs mb-1">{errors.quantity || "ㅤ"}</p>

      {/* Image upload section */}
      <div className="mb-1 flex space-x-2">
        <label
          htmlFor="image-upload"
          className="p-2 block w-full cursor-pointer border focus:border-2 focus:border-black focus:rounded"
          tabIndex={0}
        >
          <span className={!product.image ? "opacity-50" : ""}>
            {product.image ? product.image.name : "Choose product image (Max 5 MB)"}
          </span>
        </label>
        {product.image && (
          <button
            className="border p-2 bg-gray-100 hover:bg-gray-200"
            onClick={() => setProduct((prev) => ({ ...prev, image: null }))}
          >
            Remove
          </button>
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          id="image-upload"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <p className="text-red-500 text-xs">{errors.image || "ㅤ"}</p>

      {/* Optional short description input */}
      <input
        type="text"
        name="shortDescription"
        placeholder="Short Description (Optional)"
        value={product.shortDescription}
        onChange={handleChange}
        className="border p-2 mb-1 w-full"
      />
      {/* Optional detailed description textarea */}
      <textarea
        name="detailedDescription"
        placeholder="Detailed Description (Optional, in Markdown Format)"
        value={product.detailedDescription}
        onChange={handleChange}
        className="border p-2 mb-4 w-full"
        rows="4"
      />
      {/* Submit button */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;
