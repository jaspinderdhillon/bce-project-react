import React, { useState } from "react";
import axios from "axios";
import { serverl_url } from "../../configs/url";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navg=useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pwd: "",
    user: "", // donor or needy
  });
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(serverl_url+"/signup", formData);
      setMessage(response.data.msg);
      alert(response.data.msg + "\n\nRedirecting to homepage...");
      setTimeout(() => {
        navg("/")
      }, 2000);
    } catch (err) {
      // alert(err.message)
      setMessage(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className={
      `min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ` +
      (darkMode
        ? "bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800"
        : "bg-gradient-to-r from-slate-100 via-blue-100 to-slate-200")
    }>
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode((d) => !d)}
          className={
            `px-4 py-2 rounded-lg font-semibold shadow ` +
            (darkMode
              ? "bg-gray-800 text-gray-200 border border-gray-700 hover:bg-gray-700"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100")
          }
        >
          {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
      <form
        onSubmit={handleSignup}
        className={
          `rounded-2xl shadow-2xl w-full max-w-md space-y-6 border p-10 ` +
          (darkMode
            ? "bg-gray-900 border-gray-800 text-gray-100"
            : "bg-white border-gray-100 text-gray-900")
        }
      >
        <h2 className={
          `text-3xl font-bold text-center mb-2 ` +
          (darkMode ? "text-blue-300" : "text-blue-700")
        }>
          Create your account
        </h2>
        <p className={
          `text-center text-base mb-6 ` +
          (darkMode ? "text-gray-400" : "text-gray-500")
        }>
          Please fill in your details to sign up.
        </p>
        {/* Name Field */}
        <div>
          <label htmlFor="name" className={
            `block text-sm font-medium mb-1 ` +
            (darkMode ? "text-gray-300" : "text-gray-700")
          }>
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your name"
            onChange={handleChange}
            value={formData.name}
            className={
              `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ` +
              (darkMode
                ? "border-gray-700 bg-gray-800 text-gray-100 focus:ring-blue-400 placeholder-gray-500"
                : "border-gray-300 bg-white text-gray-900 focus:ring-blue-400 placeholder-gray-400")
            }
            required
          />
        </div>
        {/* Email Field */}
        <div>
          <label htmlFor="email" className={
            `block text-sm font-medium mb-1 ` +
            (darkMode ? "text-gray-300" : "text-gray-700")
          }>
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="example@mail.com"
            onChange={handleChange}
            value={formData.email}
            className={
              `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ` +
              (darkMode
                ? "border-gray-700 bg-gray-800 text-gray-100 focus:ring-blue-400 placeholder-gray-500"
                : "border-gray-300 bg-white text-gray-900 focus:ring-blue-400 placeholder-gray-400")
            }
            required
          />
        </div>
        {/* Password Field */}
        <div>
          <label htmlFor="pwd" className={
            `block text-sm font-medium mb-1 ` +
            (darkMode ? "text-gray-300" : "text-gray-700")
          }>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="pwd"
              id="pwd"
              placeholder="Enter your password"
              onChange={handleChange}
              value={formData.pwd}
              className={
                `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ` +
                (darkMode
                  ? "border-gray-700 bg-gray-800 text-gray-100 focus:ring-blue-400 placeholder-gray-500"
                  : "border-gray-300 bg-white text-gray-900 focus:ring-blue-400 placeholder-gray-400")
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>
        {/* Role Selection */}
        <div>
          <label htmlFor="user" className={
            `block text-sm font-medium mb-1 ` +
            (darkMode ? "text-gray-300" : "text-gray-700")
          }>
            Role
          </label>
          <select
            name="user"
            id="user"
            onChange={handleChange}
            value={formData.user}
            className={
              `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ` +
              (darkMode
                ? "border-gray-700 bg-gray-800 text-gray-100 focus:ring-blue-400"
                : "border-gray-300 bg-white focus:ring-blue-400 text-gray-700")
            }
            required
          >
            <option value="">Select your role</option>
            <option value="donor">Donor</option>
            <option value="needy">Needy</option>
          </select>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className={
            `w-full py-2 rounded-md font-semibold transition duration-300 mt-2 ` +
            (darkMode
              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 active:shadow-sm"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 active:shadow-sm")
          }
          style={{ cursor: "pointer" }}
        >
          Sign Up
        </button>
        {/* Response Message */}
        {message && (
          <p className={
            `text-center text-sm font-medium mt-2 pointer` +
            (darkMode ? "text-blue-200" : "text-blue-700")
          }>
            {message}
          </p>
        )}
        {/* Link to Login Page */}
        <p className={
          `text-center text-sm mt-4 ` +
          (darkMode ? "text-gray-300" : "text-gray-700")
        }>
          Already have an account?{" "}
          <span
            className={
              (darkMode
                ? "text-blue-300 underline hover:text-blue-400"
                : "text-blue-700 underline hover:text-blue-900") +
              " cursor-pointer"
            }
            onClick={() => navg("/login") /* Replace with navigation logic if needed */}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}
