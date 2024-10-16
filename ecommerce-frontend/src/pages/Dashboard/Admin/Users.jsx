import React, { useEffect, useState } from "react";
import { fetchAllUsers, editUserRole, deleteUser } from "../../../app/API/usersApi";
import { useSelector, useDispatch } from "react-redux";
import { handleError } from "../../../hooks/functions";
import useNavigateTransition from "../../../hooks/useNavigateTransition";
import nProgress from "nprogress";

const Users = () => {
  const [users, setUsers] = useState([]);
  const token = useSelector((state) => state.auth.token);

  const navigateTransition = useNavigateTransition();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        nProgress.start();
        const data = await fetchAllUsers(token);
        // Sorting users in ascending order by username
        const sortedUsers = data.sort((a, b) =>
          a.username.localeCompare(b.username)
        );
        setUsers(sortedUsers);
      } catch (err) {
        handleError(err, navigateTransition, dispatch);
      } finally {
        nProgress.done();
      }
    };
    loadUsers();
  }, []);

  const handleRoleChange = async (username, role) => {
    try {
      nProgress.start();
      const updatedUser = await editUserRole(username, token, { role });
      setUsers((users) =>
        users.map((user) =>
          user.username === username ? { ...user, role: updatedUser.role } : user
        )
      );
      alert(`User ${username}'s role updated to ${role}`);
    } catch (err) {
      handleError(err, navigateTransition, dispatch);
    } finally {
      nProgress.done();
    }
  };

  const handleDelete = async (username) => {
    const confirmation = confirm(`Are you sure you want to delete user ${username}?`);
    if (!confirmation) return;

    try {
      nProgress.start();
      await deleteUser(username, token);
      setUsers((users) => users.filter((user) => user.username !== username));
      alert(`User ${username} deleted successfully.`);
    } catch (err) {
      handleError(err, navigateTransition, dispatch);
    } finally {
      nProgress.done();
    }
  };

  return (
    <div className="users">
      <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
      <div className="w-fit bg-white p-6 rounded shadow-md">
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
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.username, e.target.value)}
                  className="border p-1 rounded"
                  disabled={user.username === "@root"}
                >
                  <option value="admin">Admin</option>
                  <option value="seller">Seller</option>
                  <option value="shopper">Shopper</option>
                </select>
              </td>
              <td className="py-2 px-4">
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded disabled:opacity-50"
                  onClick={() => handleDelete(user.username)}
                  disabled={user.username === "@root"}
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
  );
};

export default Users;
