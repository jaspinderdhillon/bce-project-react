import React, { useState } from "react";
import axios from "axios";
import { serverl_url } from "../../configs/url";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
export default function Login({loginstatusupdate}) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navg = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(serverl_url+"/login", {
        email,
        pwd,
      });
      localStorage.setItem("email", email);
      // localStorage.setItem("role", response.data.role);
      // sessionStorage.setItem("role", response.data.role);
      setMessage(response.data.msg || "Login successful");

      loginstatusupdate(true);  
      console.log("role is "+response.data.user)
      localStorage.setItem("token", response.data.token);
      console.log("token is "+response.data.token)
      setTimeout(() => {
        alert("navigating you to your dashboard"+response.data.user);
        if(response.data.user=="donor"){
          navg("/donor/donordashboard");
        }else{
          navg("/needy/needydashboard");
        }        
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className={
      `min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ` +
      (darkMode
        ? "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800"
        : "bg-gradient-to-br from-slate-100 via-blue-100 to-slate-200")
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
        onSubmit={handleLogin}
        className={
          `rounded-2xl shadow-xl p-8 w-full max-w-md space-y-6 border ` +
          (darkMode
            ? "bg-gray-900 border-gray-800 text-gray-100"
            : "bg-white border-gray-100 text-gray-900")
        }
      >
        <h2 className={
          `text-3xl font-bold text-center mb-2 ` +
          (darkMode ? "text-blue-300" : "text-blue-700")
        }>
          Log in to your account
        </h2>
        <p className={
          `text-center text-base mb-6 ` +
          (darkMode ? "text-gray-400" : "text-gray-500")
        }>
          Welcome back! Please enter your details.
        </p>
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className={
              `block text-sm font-medium mb-1 ` +
              (darkMode ? "text-gray-300" : "text-gray-700")
            }>
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={
                `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ` +
                (darkMode
                  ? "border-gray-700 bg-gray-800 text-gray-100 focus:ring-blue-400 placeholder-gray-500"
                  : "border-gray-300 bg-white text-gray-900 focus:ring-blue-400 placeholder-gray-400")
              }
            />
          </div>
          {/* Password */}
          <div>
            <label className={
              `block text-sm font-medium mb-1 ` +
              (darkMode ? "text-gray-300" : "text-gray-700")
            }>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                required
                className={
                  `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-10 ` +
                  (darkMode
                    ? "border-gray-700 bg-gray-800 text-gray-100 focus:ring-blue-400 placeholder-gray-500"
                    : "border-gray-300 bg-white text-gray-900 focus:ring-blue-400 placeholder-gray-400")
                }
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
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className={
            `w-full py-2 rounded-lg font-semibold transition duration-200 mt-2 ` +
            (darkMode
              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 active:shadow-sm"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 active:shadow-sm")
          }
          style={{ cursor: "pointer" }}
        >
          Sign In
        </button>
        {/* Message after login attempt */}
        {message && (
          <div className={
            `text-center text-sm mt-4 ` +
            (darkMode ? "text-gray-300" : "text-gray-600")
          }>{message}</div>
        )}
        {/* Link to Signup Page */}
        <p className={
          `text-center text-sm mt-4 ` +
          (darkMode ? "text-gray-300" : "text-gray-700")
        }>
          Don't have an account?{" "}
          <span
            className={
              (darkMode
                ? "text-blue-300 underline hover:text-blue-400"
                : "text-blue-700 underline hover:text-blue-900") +
              " cursor-pointer"
            }
            onClick={() => navg("/signup") /* Replace with navigation logic if needed */}
          >
            Sign up here
          </span> 
        </p>
      </form>
    </div>
  );
}
