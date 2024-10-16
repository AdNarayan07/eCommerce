import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import nprogress from "nprogress"; // Import nprogress
import "nprogress/nprogress.css"; // Import nprogress styles

import Navbar from "./components/Navbar";
import { logout, fetchUserSuccess } from "./app/slice/authSlice";
import { fetchMe } from "./app/API/usersApi";
import Loading from "./components/Loading";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard/Index"));
const Profile = lazy(() => import("./pages/Profile"));
const Product = lazy(() => import("./pages/Product/Index"));
const Order = lazy(() => import("./pages/Order"));
const NotFoundPage = lazy(() => import("./pages/Errors/404"));

const App = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const isPending = useSelector((state) => state.transition.isPending);

  nprogress.configure({ showSpinner: false, speed: 400, minimum: 0.1 });
  useLocation();
  nprogress.start();

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!token) throw new Error("No token, pls login!");

        const data = await fetchMe(token);
        dispatch(fetchUserSuccess(data));
      } catch (err) {
        console.error(err);
        dispatch(logout());
      }
    };
    loadUser();
  }, [dispatch, token]);

  return (
    <div className="w-screen h-screen bg-white flex flex-col">
      <Navbar />
      <div
        className={`flex-grow overflow-auto ${isPending ? "opacity-25 pointer-events-none" : ""}`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<Loading component={"Page"} />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<Loading component={"Page"} />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<Loading component={"Page"} />}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<Loading component={"Page"} />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<Loading component={"Page"} />}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/product/:id"
            element={
              <Suspense fallback={<Loading component={"Page"} />}>
                <Product />
              </Suspense>
            }
          />
          <Route
            path="order/:id"
            element={
              <Suspense fallback={<Loading component={"Page"} />}>
                <Order />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<Loading component={"Page"} />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
