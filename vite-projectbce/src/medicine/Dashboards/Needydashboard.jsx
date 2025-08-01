import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverl_url } from "../../configs/url";

export default function NeedyDashboard() {
  const [email, setEmail] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navg = useNavigate();

  useEffect(() => {
    const fetchNeedyProfile = async () => {
      const storedEmail = localStorage.getItem("email");
      const token = localStorage.getItem("token");

      if (!storedEmail || !token) {
        navg("/login");
        return;
      }

      setEmail(storedEmail);

      try {
        const response = await axios.get(
          `${serverl_url}/needy/fetchneedy?email=${encodeURIComponent(storedEmail)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.status === "success") {
          setProfileData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNeedyProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex flex-col items-center py-10 px-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-4xl mb-8 text-center border border-gray-200">
        <h1 className="text-3xl font-bold text-pink-700">Needy Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome,{" "}
          <span className="font-semibold text-pink-600">{email || "User"}</span> 👋
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Needy Profile */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-all border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Needy Profile</h2>
          <p className="text-gray-500 text-sm mb-4">Create or update your needy profile.</p>
          <button
            onClick={() => navg("/needy/needyprofile")}
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
          >
            Open Profile
          </button>
        </div>

        {/* ✅ Fetch Medicines */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-all border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Fetch Medicines</h2>
          <p className="text-gray-500 text-sm mb-4">
            Search and request medicines available for donation.
          </p>
          <button
            onClick={() => navg("/needy/fetchmedicine", { state: profileData })}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Fetch Medicines
          </button>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition-all border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Logout</h2>
          <p className="text-gray-500 text-sm mb-4">End your session and return to login page.</p>
          <button
            onClick={() => {
              localStorage.clear();
              alert("Logged out successfully!");
              navg("/login");
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
