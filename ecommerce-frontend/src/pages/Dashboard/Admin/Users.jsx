import React, { useEffect, useState } from "react";
import { fetchAllUsers, editUserRole, deleteUser } from "../../../app/API/usersApi"; // API functions for user management
import { useSelector, useDispatch } from "react-redux";
import { handleError } from "../../../utils/functions"; // Error handling utility
import useNavigateTransition from "../../../utils/useNavigateTransition"; // Custom hook for navigation transitions
import nProgress from "nprogress"; // Progress bar library
import Loading from "../../../components/Loading"; // Loading component

const Users = () => {
  const [users, setUsers] = useState(null); // State to hold user data
  const token = useSelector((state) => state.auth.token); // Token for authentication

  const navigateTransition = useNavigateTransition(); // Hook for navigating between pages
  const dispatch = useDispatch(); // Redux dispatch function

  useEffect(() => {
    const loadUsers = async () => {
      try {
        nProgress.start(); // Start loading progress
        const data = await fetchAllUsers(token); // Fetch all users from the API
        // Sort users in ascending order by username
        const sortedUsers = data.sort((a, b) => a.username.localeCompare(b.username));
        setUsers(sortedUsers); // Update state with sorted users
      } catch (err) {
        handleError(err, navigateTransition, dispatch); // Handle any errors
      } finally {
        nProgress.done(); // End loading progress
      }
    };
    loadUsers(); // Call function to load users
  }, []);

  // Handle changing the user's role
  const handleRoleChange = async (username, role) => {
    try {
      nProgress.start(); // Start loading progress
      const updatedUser = await editUserRole(username, token, { role }); // Update user role in API
      // Update local state with new role
      setUsers((users) =>
        users.map((user) =>
          user.username === username ? { ...user, role: updatedUser.role } : user
        )
      );
      alert(`User ${username}'s role updated to ${role}`); // Notify success
    } catch (err) {
      handleError(err, navigateTransition, dispatch); // Handle any errors
    } finally {
      nProgress.done(); // End loading progress
    }
  };

  // Handle user deletion
  const handleDelete = async (username) => {
    const confirmation = confirm(`Are you sure you want to delete user ${username}?`); // Confirmation dialog
    if (!confirmation) return; // Exit if not confirmed

    try {
      nProgress.start(); // Start loading progress
      await deleteUser(username, token); // Call API to delete user
      setUsers((users) => users.filter((user) => user.username !== username)); // Update state to remove deleted user
      alert(`User ${username} deleted successfully.`); // Notify success
    } catch (err) {
      handleError(err, navigateTransition, dispatch); // Handle any errors
    } finally {
      nProgress.done(); // End loading progress
    }
  };

  if (!users) return <Loading component={"User"} />; // Show loading if users are not yet loaded

  return users.length ? (
    <div className="users">
      <h2 className="text-xl font-semibold mb-4">Manage Users</h2> {/* Section title */}
      <div className="w-fit bg-white p-6 rounded shadow-md"> {/* Table container */}
        <table className="min-w-full bg-gray-100 rounded my-2">
          <thead>
            <tr className="bg-gray-300 text-gray-800 text-left">
              <th className="py-2 px-4">Username</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.username} className="border-b">
                <td className="py-2 px-4">{user.username}</td>
                <td className="py-2 px-4">{user.phone}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">
                  {/* Dropdown for changing user role */}
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.username, e.target.value)}
                    className="border p-1 rounded disabled:cursor-not-allowed"
                    disabled={user.username === "@root"} // Disable if user is @root
                    title={user.username === "@root" ? "Cannot Edit @root User" : ""}
                  >
                    <option value="admin">Admin</option>
                    <option value="seller">Seller</option>
                    <option value="shopper">Shopper</option>
                  </select>
                </td>
                <td className="py-2 px-4">
                  {/* Button to delete user */}
                  <button
                    className="bg-red-500 text-white px-4 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleDelete(user.username)}
                    disabled={user.username === "@root"} // Disable if user is @root
                    title={user.username === "@root" ? "Cannot Delete @root User" : ""}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100 font-semibold text-4xl p-10">
      <p className="text-8xl">:(</p>
      <p className="mt-8">No Users</p>
    </div>
  );
};

export default Users;
