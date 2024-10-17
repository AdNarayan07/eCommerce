import React from "react";
import { useSelector, useDispatch } from "react-redux"; // Redux hooks for accessing state and dispatching actions
import { logout } from "../app/slice/authSlice"; // Action for logging out the user
import useNavigateTransition from "../utils/useNavigateTransition"; // Custom hook for smooth navigation

const Navbar = () => {
  const user = useSelector((state) => state.auth.user); // Get the logged-in user from Redux state
  const dispatch = useDispatch(); // Redux dispatch function
  const navigateTransition = useNavigateTransition(); // Handle navigation with transition effect

  // Handle user logout, then navigate to login page
  const handleLogout = () => {
    navigateTransition("/login"); // Navigate to login page
    dispatch(logout()); // Dispatch logout action
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between w-full">
      <ul className="flex space-x-4">
        <li>
          <button onClick={() => navigateTransition("/")}>Home</button> {/* Navigate to home */}
        </li>
        {!user && (
          <>
            <li>
              <button onClick={() => navigateTransition("/login")}>Login</button> {/* Show login button if no user */}
            </li>
            <li>
              <button onClick={() => navigateTransition("/register")}>Register</button> {/* Show register button if no user */}
            </li>
          </>
        )}
        {(user?.role === "seller" || user?.role === "admin") && (
          <li>
            <button onClick={() => navigateTransition("/dashboard")}>
              Dashboard
            </button> {/* Show dashboard link for sellers or admins */}
          </li>
        )}
      </ul>
      {user && (
        <div className="flex space-x-4">
          <button onClick={handleLogout}>Logout</button> {/* Logout button if user is logged in */}
          <button onClick={() => navigateTransition("/profile")}>Profile</button> {/* Navigate to user profile */}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
