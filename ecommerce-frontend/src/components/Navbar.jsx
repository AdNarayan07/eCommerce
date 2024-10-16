import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../app/slice/authSlice";
import useNavigateTransition from "../hooks/useNavigateTransition";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigateTransition = useNavigateTransition();

  const handleLogout = () => {
    navigateTransition("/login");
    dispatch(logout());
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between w-full">
      <ul className="flex space-x-4">
        <li>
          <button onClick={() => navigateTransition("/")}>Home</button>
        </li>
        {!user && (
          <>
            <li>
              <button onClick={() => navigateTransition("/login")}>Login</button>
            </li>
            <li>
              <button onClick={() => navigateTransition("/register")}>Register</button>
            </li>
          </>
        )}
        {(user?.role === "seller" || user?.role === "admin") && (
          <li>
            <button onClick={() => navigateTransition("/dashboard")}>
              Dashboard
            </button>
          </li>
        )}
      </ul>
      {user && (
        <div className="flex space-x-4">
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => navigateTransition("/profile")}>Profile</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
