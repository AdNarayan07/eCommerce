import React from "react";
export const validateForm = (form, hasPassword = true) => {
  const newErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
  const phonePattern = /^\d{10}$/;
  const strongPasswordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/;
    
  if (!form.username) {
    newErrors.username = "Username is required.";
  } else if (/\s/.test(form.username)) {
    newErrors.username = "Username cannot contain any whitespaces.";
  }
  if (!form.displayname) newErrors.displayname = "Display Name is required.";
  if (!form.email) {
    newErrors.email = "Email is required.";
  } else if (!emailPattern.test(form.email)) {
    newErrors.email = "Invalid email format.";
  }
  if (!form.phone) {
    newErrors.phone = "Phone Number is required.";
  } else if (!phonePattern.test(form.phone)) {
    newErrors.phone = "Phone Number must be a 10-digit number.";
  }

  if (hasPassword) {
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (!strongPasswordPattern.test(form.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.";
    }
    if (!form.password2) {
      newErrors.password2 = "Please confirm your password.";
    } else if (form.password !== form.password2) {
      newErrors.password2 = "Passwords do not match.";
    }
  }
  
  if (!form.role) newErrors.role = "Role is required.";

  return newErrors;
};

const FormFields = ({ form, errors, handleChange, isEditable, isRegistrationForm }) => {
  const Star = isEditable ? <span className="text-red-500"> *</span> : null;
  return (
    <>
      <div className="flex items-center">
        <label htmlFor="username" className="w-1/4 text-sm font-medium text-gray-700">
          Username{isRegistrationForm && Star}
        </label>
        <input
          id="username"
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border p-2 w-3/4"
          readOnly={!isRegistrationForm}
        />
      </div>
      <p className="text-red-500 text-xs ml-1/4 mb-2">{errors.username || "ㅤ"}</p>

      <div className="flex items-center">
        <label htmlFor="displayname" className="w-1/4 text-sm font-medium text-gray-700">
          Display Name{Star}
        </label>
        <input
          id="displayname"
          type="text"
          name="displayname"
          placeholder="Display Name"
          value={form.displayname}
          onChange={handleChange}
          className="border p-2 w-3/4"
          readOnly={!isEditable}
        />
      </div>
      <p className="text-red-500 text-xs ml-1/4 mb-2">{errors.displayname || "ㅤ"}</p>

      <div className="flex items-center">
        <label htmlFor="email" className="w-1/4 text-sm font-medium text-gray-700">
          Email{Star}
        </label>
        <input
          id="email"
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-3/4"
          readOnly={!isEditable}
        />
      </div>
      <p className="text-red-500 text-xs ml-1/4 mb-2">{errors.email || "ㅤ"}</p>

      <div className="flex items-center">
        <label htmlFor="phone" className="w-1/4 text-sm font-medium text-gray-700">
          Phone Number{Star}
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 w-3/4"
          readOnly={!isEditable}
        />
      </div>
      <p className="text-red-500 text-xs ml-1/4 mb-2">{errors.phone || "ㅤ"}</p>

      <div className="flex items-center">
        <label htmlFor="address" className="w-1/4 text-sm font-medium text-gray-700">
          Address{Star}
        </label>
        <textarea
          id="address"
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border p-2 w-3/4"
          readOnly={!isEditable}
          rows={2}
        />
      </div>
      <p className="text-red-500 text-xs ml-1/4 mb-2">{errors.address || "ㅤ"}</p>

      {isRegistrationForm && (
        <>
          <div className="flex items-center">
            <label htmlFor="password" className="w-1/4 text-sm font-medium text-gray-700">
              Password{Star}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border p-2 w-3/4"
            />
          </div>
          <p className="text-red-500 text-xs ml-1/4 mb-2">{errors.password || "ㅤ"}</p>

          <div className="flex items-center">
            <label htmlFor="password2" className="w-1/4 text-sm font-medium text-gray-700">
              Confirm Password{Star}
            </label>
            <input
              id="password2"
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={form.password2}
              onChange={handleChange}
              className="border p-2 w-3/4"
            />
          </div>
          <p className="text-red-500 text-xs ml-1/4 mb-2">{errors.password2 || "ㅤ"}</p>
        </>
      )}

      <div className="flex items-center">
        <label htmlFor="role" className="w-1/4 text-sm font-medium text-gray-700">
          Role{isRegistrationForm && Star}
        </label>
        <select
          id="role"
          name="role"
          onChange={handleChange}
          value={form.role}
          className="border p-2 w-3/4"
          disabled={!isRegistrationForm}
        >
          <option value="shopper">Shopper</option>
          <option value="seller">Seller</option>
          {!isRegistrationForm && <option value="admin">Admin</option>}
        </select>
      </div>
      <p className="text-red-500 text-xs ml-1/4 mb-2">{(isRegistrationForm ? errors.role : isEditable && "Contact admin to change your role!") || "ㅤ"}</p>
    </>
  );
};

export default FormFields;
