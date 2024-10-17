import React, { useState } from "react";
import { register } from "../app/API/authApi"; // Import register API function
import { useNavigate } from "react-router-dom"; // Import navigation hook
import FormFields, { validateForm } from "../components/FormFields"; // Import form components and validation
import useAuthRedirect from "../utils/useAuthRedirect"; // Custom hook for redirecting if authenticated
import nprogress from "nprogress"; // Import nprogress for loading indicators
import { useDispatch } from "react-redux"; // Import Redux dispatch hook
import { setPending } from "../app/slice/transitionSlice"; // Import pending state action

const Register = () => {
  // State to manage form data and errors
  const [form, setForm] = useState({
    username: "",
    displayname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    password2: "",
    role: "shopper", // Default role
  });
  const [errors, setErrors] = useState({}); // State to manage form errors
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch(); // Initialize dispatch

  useAuthRedirect(true); // Redirect if already authenticated

  const handleChange = (e) => {
    // Update form data and clear specific errors on change
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate form data
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set errors if validation fails
      return; // Stop form submission
    }

    try {
      dispatch(setPending(true)); // Set loading state
      const res = await register(form); // Attempt to register user
      alert(res.message); // Show success message
      navigate("/login"); // Redirect to login page
    } catch (err) {
      console.error(err);
      // Handle registration errors
      alert(err.response?.data?.message || err.message || err);
    } finally {
      dispatch(setPending(false)); // Reset loading state
    }
  };

  nprogress.done(); // Mark progress as complete

  return (
    <div className="flex justify-center items-center h-full">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full">
        <h1 className="text-xl mb-4">Register</h1>
        <FormFields form={form} errors={errors} handleChange={handleChange} isEditable={true} isRegistrationForm={true} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register; // Export the Register component
