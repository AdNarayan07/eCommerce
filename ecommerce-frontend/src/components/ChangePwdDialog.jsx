import React, { useState } from "react";
import { changePassword } from "../app/API/usersApi";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../app/slice/authSlice";
import { setPending } from "../app/slice/transitionSlice";
import useNavigateTransition from "../utils/useNavigateTransition";

// Component for changing password with form validation
const ChangePasswordDialog = ({ onClose }) => {
  const { username } = useSelector((state) => state.auth.user); // Fetch username from Redux state
  const token = useSelector((state) => state.auth.token); // Fetch token from Redux state
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }); // State for form inputs
  const [errors, setErrors] = useState({}); // State for form validation errors
  const dispatch = useDispatch(); // Dispatch for Redux actions
  const navigateTransition = useNavigateTransition(); // Custom hook for page transitions

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  // Form validation logic
  const validateForm = () => {
    const newErrors = {};
    const strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/;

    if (!form.currentPassword) newErrors.currentPassword = "Current Password is required.";
    if (!form.newPassword) {
      newErrors.newPassword = "New Password is required.";
    } else if (!strongPasswordPattern.test(form.newPassword)) {
      newErrors.newPassword =
        "New Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.";
    } else if (form.newPassword === form.currentPassword) {
      newErrors.newPassword = "New password can't be the same as current password.";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "New passwords do not match.";
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    const validationErrors = validateForm(); // Validate the form inputs
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set errors if validation fails
      return;
    }
    try {
      dispatch(setPending(true)); // Set loading state
      const res = await changePassword(token, { ...form, username }); // Call the API to change password
      alert(res.message); // Notify user of success
      dispatch(logout()); // Logout user after password change
      navigateTransition("/login"); // Redirect to login page
      onClose(); // Close the dialog
    } catch (err) {
      if (err.status === 498) {
        alert("Token Expired or Invalid, Login Again!");
        navigateTransition("/login"); // Redirect to login on token error
      }
      console.error(err);
      alert(err.response?.data?.message || err.message || err); // Notify user of any error
      onClose();
    } finally {
      dispatch(setPending(false)); // Clear loading state
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
          {/* Current Password Field */}
          <div>
            <label className="block">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleChange}
              className="border p-2 mt-2 w-full"
            />
            <p className="text-red-500 text-xs mb-2">{errors.currentPassword || "ㅤ"}</p>
          </div>

          {/* New Password Field */}
          <div>
            <label className="block">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="border p-2 mt-2 w-full"
            />
            <p className="text-red-500 text-xs mb-2">{errors.newPassword || "ㅤ"}</p>
          </div>

          {/* Confirm New Password Field */}
          <div>
            <label className="block">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="border p-2 mt-2 w-full"
            />
            <p className="text-red-500 text-xs mb-2">{errors.confirmPassword || "ㅤ"}</p>
          </div>

          {/* Buttons for Cancel and Change Password */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded"
              onClick={onClose} // Close the dialog
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordDialog;
