import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FormFields, { validateForm } from "../components/FormFields"; // Import form components and validation
import ChangePasswordDialog from "../components/ChangePwdDialog"; // Import password change dialog
import DeleteAccountDialog from "../components/DeleteAccountDialog"; // Import delete account dialog
import useAuthRedirect from "../utils/useAuthRedirect"; // Hook for handling authentication redirect
import { editMe } from "../app/API/usersApi"; // API function to edit user data
import { fetchUserSuccess } from "../app/slice/authSlice"; // Action to update user data in store
import { setPending } from "../app/slice/transitionSlice"; // Action to manage loading state
import nprogress from "nprogress"; // Import nprogress for loading indicators
import { handleError } from "../utils/functions"; // Utility for error handling
import useNavigateTransition from "../utils/useNavigateTransition"; // Custom hook for navigation with transition
import Orders from "../components/Orders"; // Import Orders component for displaying user orders

const Profile = () => {
  // Redux state selectors
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigateTransition = useNavigateTransition(); // Initialize navigate transition

  // Local state management
  const [form, setForm] = useState(user); // Form data
  const [errors, setErrors] = useState({}); // Form validation errors
  const [isEditable, setIsEditable] = useState(false); // Edit mode flag
  const [pwdChangeDialog, setPwdChangeDialog] = useState(false); // Password change dialog state
  const [deleteDialog, setDeleteDialog] = useState(false); // Delete account dialog state
  const [activeTab, setActiveTab] = useState("account"); // Manage active tab state

  const dispatch = useDispatch(); // Initialize dispatch for Redux actions
  useAuthRedirect(false, "/login"); // Redirect to login if not authenticated

  const handleChange = (e) => {
    // Update form data and clear specific errors
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleEdit = (e) => {
    e.preventDefault(); // Prevent default form submission
    document.getElementsByTagName("input")?.displayname?.focus(); // Focus on displayname input
    setIsEditable(true); // Enable edit mode
  };

  const handleSave = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      const validationErrors = validateForm(form, false); // Validate form data
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors); // Set validation errors if any
        return; // Stop submission if errors exist
      }
      dispatch(setPending(true)); // Set loading state
      const data = await editMe(token, form); // Update user profile
      alert("Profile edited successfully!"); // Show success message
      dispatch(fetchUserSuccess(data)); // Update user data in Redux store
      setIsEditable(false); // Exit edit mode
    } catch (err) {
      handleError(err, navigateTransition, dispatch); // Handle errors
      setForm(user); // Reset form to initial user data
    } finally {
      dispatch(setPending(false)); // Reset loading state
    }
  };

  const revertChanges = () => {
    setForm(user); // Reset form to user data
    setIsEditable(false); // Exit edit mode
    setErrors({}); // Clear errors
  };

  nprogress.done(); // Complete nprogress loading

  return (
    user && ( // Render component if user data is available
      <div className="flex flex-col items-center h-full w-full p-4">
        {/* Tab Navigation */}
        <div className="mb-4 flex space-x-4 w-full">
          <button
            className={`px-4 py-2 border rounded ${
              activeTab === "account" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("account")} // Switch to account tab
          >
            My Account
          </button>
          <button
            className={`px-4 py-2 border rounded ${
              activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("orders")} // Switch to orders tab
          >
            My Orders
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "account" ? (
          <form className="bg-white p-6 rounded shadow-md w-full max-w-3xl" onSubmit={handleSave}>
            <FormFields
              form={form} // Pass form data
              errors={errors} // Pass validation errors
              handleChange={handleChange} // Pass change handler
              isEditable={isEditable} // Pass edit state
              isRegistrationForm={false} // Set registration form flag to false
            />
            <div className="flex space-x-4">
              {isEditable ? (
                <>
                  <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Save
                  </button>
                  <button
                    type="reset"
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={revertChanges} // Reset form changes
                  >
                    Revert
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleEdit} // Enable edit mode
                    disabled={user.username === "@root"} // Disable for @root user
                    title={user.username === "@root" ? "Cannot Edit @root User" : ""}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setPwdChangeDialog(true)} // Open password change dialog
                    disabled={user.username === "@root"} // Disable for @root user
                    title={user.username === "@root" ? "Cannot Edit @root User" : ""}
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    className="bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setDeleteDialog(true)} // Open delete account dialog
                    disabled={user.username === "@root"} // Disable for @root user
                    title={user.username === "@root" ? "Cannot Delete @root User" : ""}
                  >
                    Delete Account
                  </button>
                </>
              )}
            </div>
          </form>
        ) : (
          <Orders by={"shopper"} /> // Render Orders component
        )}

        {pwdChangeDialog && <ChangePasswordDialog onClose={() => setPwdChangeDialog(false)} />}

        {/* Render the Delete Account Dialog */}
        {deleteDialog && <DeleteAccountDialog onClose={() => setDeleteDialog(false)} />}
      </div>
    )
  );
};

export default Profile; // Export Profile component
