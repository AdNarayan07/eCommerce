import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../../app/API/productsApi";
import { useState } from "react";
import { handleError } from "../../../hooks/functions";
import useNavigateTransition from "../../../hooks/useNavigateTransition";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    image: null,
    shortDescription: "",
    detailedDescription: "",
  });
  const token = useSelector((state) => state.auth.token);
  const navigateTransition = useNavigateTransition();
  const dispatch = useDispatch()

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

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
        alert(`File size exceeds the limit of ${maxFileSize / (1024 * 1024)} MB`);
        setProduct((prev) => ({ ...prev, image: null }));
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  // Validate form
  const validateForm = () => {
    const { name, price, quantity } = product;
    const errors = {};
    if (!name) errors.name = "Product name is required.";
    if (!price) errors.price = "Price is required.";
    if (!quantity) errors.quantity = "Quantity is required.";
    return errors;
  };

  // Handle product submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors).join(" "));
      return;
    }

    try {
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
      handleError(err, dispatch, navigateTransition)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded">
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
      />
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={product.quantity}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
      />

      <div className="mb-2 flex space-x-2">
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

      <input
        type="text"
        name="shortDescription"
        placeholder="Short Description (Optional)"
        value={product.shortDescription}
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
      />
      <textarea
        name="detailedDescription"
        placeholder="Detailed Description (Optional, in Markdown Format)"
        value={product.detailedDescription}
        onChange={handleChange}
        className="border p-2 mb-4 w-full"
        rows="4"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Product
      </button>
    </form>
  );
};

export default AddProduct;