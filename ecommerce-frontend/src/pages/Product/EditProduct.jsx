import { useState } from "react";
import ImageWithFallback from "../../components/ImageWithFallback";
import { useParams } from "react-router-dom";
import { updateProduct } from "../../app/API/productsApi";
import { useDispatch, useSelector } from "react-redux";
import { handleError } from "../../hooks/functions";
import useNavigateTransition from "../../hooks/useNavigateTransition";
import nProgress from "nprogress";

const EditProduct = ({ setIsEditing, product, setProduct }) => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [tempProduct, setTempProduct] = useState(product);
  const navigateTransition = useNavigateTransition();
  const dispatch = useDispatch();

  // Handle image change and convert it to data URI
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const data = reader.result;
      setTempProduct((prev) => ({
        ...prev,
        image: data,
      }));
    };

    const maxFileSize = 5 * 1024 * 1024; // 5 MB
    if (file) {
      if (file.size > maxFileSize) {
        alert(`File size exceeds the limit of ${maxFileSize / (1024 * 1024)} MB`);
        setTempProduct((prev) => ({ ...prev, image: null }));
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  // Handle input changes for editable fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (e.target.tagName === "TEXTAREA") {
      e.target.style.height = "auto";
      e.target.style.height = e.target.scrollHeight + "px";
    }
    setTempProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      nProgress.start()
      let data = await updateProduct(id, tempProduct, token); // API call to update the product
      await fetch(`http://localhost:3000/images/${id}`)
      console.log(data)
      setProduct(data);
      setTempProduct(data);
      setIsEditing(false);
      nProgress.done()
      alert("Product updated successfully!");
    } catch (err) {
      handleError(err, navigateTransition, dispatch)
    }
  };

  const handleRevert = () => {
    setIsEditing(false);
    setTempProduct({});
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
          <label htmlFor="price" className="text-2xl font-bold mb-6 ">Price: ₹ </label>
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
          <label htmlFor="quantity" className="text-2xl font-bold mb-6 ">Stock: </label>
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
              src={tempProduct.image || `http://localhost:3000/images/${id}`}
              fallbackSrc="/images/upload_image_placeholder.png"
              className="w-full h-full rounded-lg shadow-md cursor-pointer"
            />
          </label>
          {tempProduct.image !== "!remove" && (
            <button
              className="border p-2 bg-gray-100 hover:bg-gray-200"
              onClick={() => setTempProduct((prev) => ({ ...prev, image: "!remove" }))}
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
          onClick={handleSaveChanges}
        >
          Save Changes
        </button>
      </div>
    </>
  );
};

export default EditProduct;
