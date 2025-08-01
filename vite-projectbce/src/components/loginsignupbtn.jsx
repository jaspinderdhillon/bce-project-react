import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function LoginSignupBtn() {
  const navg = useNavigate();

  function navigate(api) {
    navg("/" + api);
    // alert("Navigating to " + api);
  }

  return (
    <div className="flex gap-4 justify-center">
      <button
        onClick={() => navigate('login')}
        className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition"
      >
        Login
      </button>
      <button
        onClick={() => navigate('signup')}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Sign Up
      </button>
      <Outlet></Outlet>
    </div>
  );
}
