import React, { useState } from "react";
import useNavigateTransition from "../utils/useNavigateTransition";
import { deleteAccount } from "../app/API/usersApi";
import { useDispatch, useSelector } from "react-redux";
import { setPending } from "../app/slice/transitionSlice";
import { logout } from "../app/slice/authSlice";
import { handleError } from "../utils/functions";

// Modal component for deleting an account
const DeleteAccountDialog = ({ onClose }) => {
  const [username, setUsername] = useState(""); // State for username
  const [password, setPassword] = useState(""); // State for password
  const navigateTransition = useNavigateTransition(); // Custom hook for page transitions
  const dispatch = useDispatch(); // Dispatch for Redux actions
  const token = useSelector((state) => state.auth.token); // Fetch token from Redux state
  
  // Handle the deletion of the account
  const handleDeleteAccount = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      dispatch(setPending(true)); // Set loading state
      await deleteAccount(token, { username, password }); // Call the API to delete the account
      alert("Account deleted successfully!"); // Notify user
      dispatch(logout()); // Logout user
      navigateTransition("/login"); // Redirect to login page
    } catch (err) {
      handleError(err, navigateTransition, dispatch); // Handle error if any
    } finally {
      dispatch(setPending(false)); // Clear loading state
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Delete Account</h2>
        <form onSubmit={handleDeleteAccount}>
          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username state
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          
          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          
          {/* Buttons for cancel and delete */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={onClose} // Close the modal
            >
              Cancel
            </button>
            <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountDialog;
