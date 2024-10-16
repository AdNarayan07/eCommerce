import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, fetchUserSuccess, logout } from '../app/slice/authSlice';
import { login } from '../app/API/authApi';
import { fetchMe } from '../app/API/usersApi';
import useAuthRedirect from '../hooks/useAuthRedirect';
import nprogress from 'nprogress';
import { setPending } from '../app/slice/transitionSlice';

const Login = () => {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  useAuthRedirect(true)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setPending(true))
      const res = await login(form)
      dispatch(loginSuccess(res));
      alert(res.message);
      const data = await fetchMe(res.token)
      dispatch(fetchUserSuccess(data));
    } catch(err) {
      dispatch(logout())
      console.error(err)
      alert(err.response?.data?.message || err.message || err)
    } finally {
      dispatch(setPending(false))
    }
  };

  useEffect(()=>{
    dispatch(setPending(false))
  },[])

  nprogress.done()

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