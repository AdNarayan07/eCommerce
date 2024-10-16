import React, { useState } from "react";
import { register } from "../app/API/authApi";
import { useNavigate } from "react-router-dom";
import FormFields, { validateForm } from "../components/FormFields";
import useAuthRedirect from "../hooks/useAuthRedirect";
import nprogress from "nprogress";
import { useDispatch } from "react-redux";
import { setPending } from "../app/slice/transitionSlice";
const Register = () => {
  const [form, setForm] = useState({
    username: "",
    displayname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    password2: "",
    role: "shopper",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useAuthRedirect(true)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop form submission if there are errors
    }

    try {
      dispatch(setPending(true))
      const res = await register(form);
      alert(res.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message || err);
    } finally {
      dispatch(setPending(false))
    }
  };

  nprogress.done()

  return (
    <div className="flex justify-center items-center h-full">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full">
        <h1 className="text-xl mb-4">Register</h1>
        <FormFields form={form} errors={errors} handleChange={handleChange} isEditable={true} isRegistrationForm={true}/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
