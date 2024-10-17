import { useState } from "react";
import ImageWithFallback from "../../components/ImageWithFallback";
import { useParams } from "react-router-dom";
import { updateProduct } from "../../app/API/productsApi";
import { useDispatch, useSelector } from "react-redux";
import { handleError } from "../../utils/functions";
import useNavigateTransition from "../../utils/useNavigateTransition";
import nProgress from "nprogress";

const EditProduct = ({ setIsEditing, product, setProduct }) => {
  const { id } = useParams(); // Get product ID from URL parameters
  const token = useSelector((state) => state.auth.token); // Get authentication token from Redux store
  const [tempProduct, setTempProduct] = useState(product); // State for temporary product details
  const navigateTransition = useNavigateTransition();
  const dispatch = useDispatch();

  // Handle image change and convert it to data URI
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const data = reader.result; // Set image data when loaded
      setTempProduct((prev) => ({
        ...prev,
        image: data, // Update product image state
      }));
    };

    const maxFileSize = 5 * 1024 * 1024; // 5 MB
    if (file) {
      if (file.size > maxFileSize) {
        alert(`File size exceeds the limit of ${maxFileSize / (1024 * 1024)} MB`); // Alert if file size exceeds limit
        setTempProduct((prev) => ({ ...prev, image: null })); // Reset image state
      } else {
        reader.readAsDataURL(file); // Read file as data URL
      }
    }
  };

  // Handle input changes for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto"; // Reset height to auto for dynamic resizing
      e.target.style.height = e.target.scrollHeight + "px"; // Set height based on content
    }
    setTempProduct((prev) => ({ ...prev, [name]: value })); // Update temporary product state
  };

  const handleSaveChanges = async () => {
    // Handle saving changes to the product
    try {
      nProgress.start(); // Start loading progress
      let data = await updateProduct(id, tempProduct, token); // API call to update the product
      await fetch(import.meta.env.VITE_API_URL + "/images/" + id).catch((e) => console.log(e));
      console.log(data);
      setProduct(data); // Update product in parent component
      setTempProduct(data); // Update temporary product state
      setIsEditing(false); // Exit editing mode
      nProgress.done(); // End loading progress
      alert("Product updated successfully!"); // Notify user of successful update
    } catch (err) {
      handleError(err, navigateTransition, dispatch); // Handle errors during update
    }
  };

  const handleRevert = () => {
    setIsEditing(false); // Exit editing mode
    setTempProduct({}); // Reset temporary product state
  };

  return (
    <>
      <div className="flex space-x-4">
        <div>
          <input
            type="text"
            name="name"
            value={tempProduct.name}
            onChange={handleInputChange}
            className="text-4xl font-bold text-gray-800 mb-6 border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="text"
            name="shortDescription"
            value={tempProduct.shortDescription}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          />
          <textarea
            name="detailedDescription"
            value={tempProduct.detailedDescription}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
          />
          <div className="flex justify-between items-center">
            <label htmlFor="price" className="text-2xl font-bold mb-6 ">
              Price: ₹{" "}
            </label>
            <input
              id="price"
              type="number"
              name="price"
              value={tempProduct.price}
              onChange={handleInputChange}
              className="text-2xl font-bold text-green-600 mb-6 border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex justify-between items-center">
            <label htmlFor="quantity" className="text-2xl font-bold mb-6 ">
              Stock:{" "}
            </label>
            <input
              id="quantity"
              type="number"
              name="quantity"
              value={tempProduct.quantity}
              onChange={handleInputChange}
              className="text-2xl font-bold text-green-600 mb-6 border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>
        <div className="mb-4 ml-6 w-128 flex flex-col space-y-4 items-center">
          <label htmlFor="image-upload" className="w-full block">
            <ImageWithFallback
              src={tempProduct.image || id}
              fallbackSrc="/images/upload_image_placeholder.png"
              className="w-full h-full rounded-lg shadow-md cursor-pointer"
              prefixAPI_URL={!tempProduct.image}
            />
          </label>
          {tempProduct.image !== "!remove" && (
            <button
              className="border p-2 bg-gray-100 hover:bg-gray-200"
              onClick={() => setTempProduct((prev) => ({ ...prev, image: "!remove" }))} // Mark image for removal
            >
              Remove
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
        </div>
      </div>
      <hr className="mb-4 border-2 w-full" />
      <div className="flex justify-end">
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2" onClick={handleRevert}>
          Revert
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
          onClick={handleSaveChanges} // Save changes button
        >
          Save Changes
        </button>
      </div>
    </>
  );
};

export default EditProduct;
