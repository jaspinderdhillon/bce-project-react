import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverl_url } from "../../configs/url";
import MedicineFetchCard from "./MedicineFetchCard";

// Axios interceptor for 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default function FetchMedicines() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formdata, setFormdata] = useState(location.state || {});
  const [city, setCity] = useState("");
  const [medname, setMedname] = useState("");
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    console.log("✅ Profile Data from NeedyDashboard:", formdata);
  }, [formdata]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please login again");
      navigate("/login");
      return;
    }

    try {
      const params = {};
      if (city) params.city = city;
      if (medname) params.medname = medname;

      const res = await axios.get(serverl_url + "/needy/fetchmedicine", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status === "success") {
        setMedicines(res.data.data);
      } else {
        alert(res.data.msg || "No medicines found!");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Error fetching medicines");
    }
  };

  const handleBuyNow = async (selectedMedicine, event) => {
    event.preventDefault();

    if (!formdata?.email) {
      alert("Profile data missing. Please reload dashboard.");
      return;
    }

    const data = {
      name: formdata.name,
      emailtosearch: selectedMedicine.email, // donor email
      email: formdata.email, // needy email
      contact: formdata.contact,
      address: formdata.address,
      city: formdata.city,
      state: formdata.state,
      medicineself: formdata.medicine,
      medicinedonor: selectedMedicine.medname,
      quantity: formdata.quantity,
      durationill: formdata.durationill,
      disease: formdata.disease,
      selfpic: "nopic.jpg",
    };

    try {
      const res = await axios.post(serverl_url + "/needy/buynow", data, {
        headers: { Authorization: "Bearer " + token },
      });

      if (res.data.status === "success") {
        alert("Medicine bought successfully");
      } else {
        alert("Buying failed");
      }
    } catch (err) {
      alert("medicine already bought");
      console.log("Server error: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Search Medicines</h2>

      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter City"
          className="border p-2 rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Medicine Name"
          className="border p-2 rounded"
          value={medname}
          onChange={(e) => setMedname(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded col-span-1 md:col-span-2 hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medicines.length > 0 ? (
          medicines.map((med, idx) => (
            <MedicineFetchCard
              key={idx}
              {...med}
              onBuyNow={(event) => handleBuyNow(med, event)}
            />
          ))
        ) : (
          <p className="text-gray-600">No medicines found</p>
        )}
      </div>
    </div>
  );
}
