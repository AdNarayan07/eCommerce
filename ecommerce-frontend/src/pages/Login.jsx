import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, fetchUserSuccess, logout } from '../app/slice/authSlice';
import { login } from '../app/API/authApi';
import { fetchMe } from '../app/API/usersApi';
import useAuthRedirect from '../utils/useAuthRedirect';
import nprogress from 'nprogress';
import { setPending } from '../app/slice/transitionSlice';

const Login = () => {
  const [form, setForm] = useState({ identifier: '', password: '' }); // State for form inputs
  const user = useSelector((state) => state.auth.user); // Get user from Redux state
  const dispatch = useDispatch(); // Redux dispatch function
  useAuthRedirect(true); // Redirect if already authenticated

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      dispatch(setPending(true)); // Set loading state
      const res = await login(form); // Call login API
      dispatch(loginSuccess(res)); // Update auth state on successful login
      alert(res.message); // Alert the user of the login result
      const data = await fetchMe(res.token); // Fetch user data with the token
      dispatch(fetchUserSuccess(data)); // Update user state in Redux
    } catch (err) {
      dispatch(logout()); // Logout on error
      console.error(err); // Log the error
      alert(err.response?.data?.message || err.message || err); // Alert the user of the error
    } finally {
      dispatch(setPending(false)); // Reset loading state
    }
  };

  useEffect(() => {
    dispatch(setPending(false)); // Reset pending state on component mount
  }, []);

  nprogress.done(); // Complete progress bar

  return (
    <div className="flex justify-center items-center h-full">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h1 className="text-xl mb-4">Login</h1>
        <input
          type="text"
          name="identifier"
          placeholder="Enter username, email or phone number"
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
