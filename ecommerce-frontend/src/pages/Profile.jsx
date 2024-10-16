import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FormFields, { validateForm } from "../components/FormFields";
import ChangePasswordDialog from "../components/ChangePwdDialog";
import DeleteAccountDialog from "../components/DeleteAccountDialog"; // Import the new delete dialog
import useAuthRedirect from "../hooks/useAuthRedirect";
import { editMe } from "../app/API/usersApi";
import { fetchUserSuccess } from "../app/slice/authSlice";
import { setPending } from "../app/slice/transitionSlice";
import nprogress from "nprogress";
import { handleError } from "../hooks/functions";
import useNavigateTransition from "../hooks/useNavigateTransition";
import Orders from "../components/Orders";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigateTransition = useNavigateTransition();

  const [form, setForm] = useState(user);
  const [errors, setErrors] = useState({});
  const [isEditable, setIsEditable] = useState(false);
  const [pwdChangeDialog, setPwdChangeDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false); // New state for delete dialog
  const [activeTab, setActiveTab] = useState("account"); // Manage active tab

  const dispatch = useDispatch();
  useAuthRedirect(false, "/login");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    document.getElementsByTagName("input")?.displayname?.focus();
    setIsEditable(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const validationErrors = validateForm(form, false);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      dispatch(setPending(true));
      const data = await editMe(token, form);
      alert("Profile edited successfully!");
      dispatch(fetchUserSuccess(data));
      setIsEditable(false);
    } catch (err) {
      handleError(err, navigateTransition, dispatch);
      setForm(user);
    } finally {
      dispatch(setPending(false));
    }
  };

  const revertChanges = () => {
    setForm(user);
    setIsEditable(false);
    setErrors({});
  };

  nprogress.done();

  return (
    user && (
      <div className="flex flex-col items-center h-full w-full p-4">
        {/* Tab Navigation */}
        <div className="mb-4 flex space-x-4 w-full">
          <button
            className={`px-4 py-2 border rounded ${
              activeTab === "account" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("account")}
          >
            My Account
          </button>
          <button
            className={`px-4 py-2 border rounded ${
              activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            My Orders
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "account" ? (
          <form className="bg-white p-6 rounded shadow-md w-full max-w-3xl" onSubmit={handleSave}>
            <FormFields
              form={form}
              errors={errors}
              handleChange={handleChange}
              isEditable={isEditable}
              isRegistrationForm={false}
            />
            <div className="flex space-x-4">
              {isEditable ? (
                <>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="reset"
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={revertChanges}
                  >
                    Revert
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleEdit}
                    disabled={user.username === "@root"}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => setPwdChangeDialog(true)}
                  >
                    Change Password
                  </button>
                  <button
                    type="button"
                    className="bg-red-700 text-white px-4 py-2 rounded"
                    onClick={() => setDeleteDialog(true)} // Open the delete dialog
                  >
                    Delete Account
                  </button>
                </>
              )}
            </div>
          </form>
        ) : (
          <Orders by={"shopper"} />
        )}

        {pwdChangeDialog && (
          <ChangePasswordDialog onClose={() => setPwdChangeDialog(false)} />
        )}

        {/* Render the Delete Account Dialog */}
        {deleteDialog && (
          <DeleteAccountDialog
            onClose={() => setDeleteDialog(false)}
          />
        )}
      </div>
    )
  );
};

export default Profile;
