import React, { useState } from "react";
import useNavigateTransition from "../hooks/useNavigateTransition";
import { deleteAccount } from "../app/API/usersApi";
import { useDispatch, useSelector } from "react-redux";
import { setPending } from "../app/slice/transitionSlice";
import { logout } from "../app/slice/authSlice";
import { handleError } from "../hooks/functions";

const DeleteAccountDialog = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigateTransition = useNavigateTransition();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  
  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    try {
      dispatch(setPending(true));
      await deleteAccount(token, { username, password });
      alert("Account deleted successfully!");
      dispatch(logout());
      navigateTransition("/login");
    } catch (err) {
      handleError(err, navigateTransition, dispatch);
    } finally {
      dispatch(setPending(false));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Delete Account</h2>
        <form onSubmit={handleDeleteAccount}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded"
              onClick={onClose}
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
