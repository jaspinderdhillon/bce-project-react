import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DonorDashboard() {
  const [email, setEmail] = useState("");
  const navg=useNavigate();
  useEffect(() => {
    
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center py-10 px-6">
      
      {/* Header */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl mb-8 text-center border border-gray-200">
        <h1 className="text-3xl font-bold text-blue-700">Donor Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome, <span className="font-semibold text-blue-600">{email || "User"}</span> 👋
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        
        {/* Donor Profile */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-all border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Profile</h2>
          <p className="text-gray-500 text-sm mb-4">Create or update your donor profile.</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => navg("/donor/donorprofile")}
          >
            Open Profile
          </button>
        </div>

        {/* Manage Medicines */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-all border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Manage Medicines</h2>
          <p className="text-gray-500 text-sm mb-4">View, edit or delete the medicines you have uploaded.</p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            onClick={() => navg("/donor/medicinemanager")}
          >
            Manage Medicines
          </button>
        </div>

        {/* Avail Medicines */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-all border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Avail Medicines</h2>
          <p className="text-gray-500 text-sm mb-4">Add new medicines available for donation.</p>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            onClick={() => navg("/donor/availmedicine")}
          >
            Avail Medicines
          </button>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-all border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Logout</h2>
          <p className="text-gray-500 text-sm mb-4">End your session and return to login page.</p>
          <button
            onClick={() => {
              sessionStorage.clear();
              alert("Logged out successfully!");
              navg("/login");
              // After routing setup, replace with navigation
            }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
