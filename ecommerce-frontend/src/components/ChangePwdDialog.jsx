import React, { useState } from "react";
import { changePassword } from "../app/API/usersApi";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../app/slice/authSlice";
import { setPending } from "../app/slice/transitionSlice";
import useNavigateTransition from "../hooks/useNavigateTransition";
const ChangePasswordDialog = ({ onClose }) => {
  const { username } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigateTransition = useNavigateTransition();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const validateForm = () => {
    const newErrors = {};
    const strongPasswordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!form.currentPassword) newErrors.currentPassword = "Current Password is required.";
    if (!form.newPassword) {
      newErrors.newPassword = "New Password is required.";
    } else if (!strongPasswordPattern.test(form.newPassword)) {
      newErrors.newPassword =
        "New Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.";
    } else if (form.newPassword === form.currentPassword) {
      newErrors.newPassword = "New password can't be same as current password.";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password.";
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "New Passwords do not match.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Validate form
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return; // Stop form submission if there are errors
      }
      dispatch(setPending(true));
      const res = await changePassword(token, { ...form, username });
      navigateTransition("/login");
      alert(res.message);
      dispatch(logout());
      onClose();
    } catch (err) {
      if(err.status === 498){
        alert("Token Expired or Invalid, Login Again!")
        navigateTransition("/login")
      }
      console.error(err);
      alert(err.response?.data?.message || err.message || err);
      onClose();
    } finally {
      dispatch(setPending(false));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Change Password</h2>
        <form onSubmit={handleSubmit}>
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

          <div className="flex justify-end space-x-4 mt-4">
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 rounded"
              onClick={onClose}
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
