import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { serverl_url } from '../../configs/url';
import { useNavigate } from 'react-router-dom';

// Axios interceptor to handle 401 responses
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

function Availmed() {
    const navigate = useNavigate();
    const [token, settoken] = useState(localStorage.getItem("token"));
    const [formdata, setformdata] = useState({
        email: localStorage.getItem("email"),
        medname: "",
        medtype: "",
        medprice: "",
        medquantity: "",
        dateofexpiry: "",
        city: "",
        usedfor: "",
        meddiscription: "",
        medimage: null
    });
    const [loadingDiseases, setLoadingDiseases] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
    const [diseasesEditable, setDiseasesEditable] = useState(false);
    const fileInputRef = useRef(null);

    const initialFormState = {
        email: localStorage.getItem("email"),
        medname: "",
        medtype: "",
        medprice: "",
        medquantity: "",
        dateofexpiry: "",
        city: "",
        usedfor: "",
        meddiscription: "",
        medimage: null
    };

    const handleChange = (e) => {
        if (e.target.name === "medimage") {
            const file = e.target.files[0];
            setformdata({ ...formdata, medimage: file });
            if (file) {
                setImagePreview(URL.createObjectURL(file));
            } else {
                setImagePreview("");
            }
        } else {
            setformdata({ ...formdata, [e.target.name]: e.target.value });
        }
    };

    // Fetch diseases for the given medicine name
    const fetchDiseasesForMedicine = async (e) => {
        if (e) e.preventDefault();
        if (!formdata.medname) return;
        
        if (!token) {
            alert('Please login again');
            navigate('/login');
            return;
        }

        setLoadingDiseases(true);
        const url = serverl_url + "/gemini/askdonor";
        const data = {
            question: `List all diseases name only that can be cured or treated by the medicine named \"${formdata.medname}\" in India, in an array format. The response should only be an array. This is just a suggestion, not for actual medical advice.`
        };
        
        try {
            const response = await axios.post(url, data,{
                headers:{
                    "Authorization": "Bearer " + token
                }
            });
            
            if (response.data.status === "success") {
                let usedfor = response.data.data;
                // If diseases is a stringified array, parse it
                if (typeof usedfor === "string") {
                    try {
                        usedfor = JSON.parse(usedfor);
                    } catch {
                        usedfor = [];   
                    }
                }
                // Join array into a comma-separated string for textarea
                setformdata(prev => ({ ...prev, usedfor: Array.isArray(usedfor) ? usedfor.join(", ") : "" }));
                setDiseasesEditable(true);
            } else {
                throw new Error(response.data.msg || 'Failed to fetch diseases');
            }
        } catch (error) {
            console.error("Error fetching diseases for medicine:", error);
            alert(error.response?.data?.msg || "Error fetching diseases for this medicine. Please try again.");
            setDiseasesEditable(false);
        } finally {
            setLoadingDiseases(false);
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        
        if (!token) {
            alert('Please login again');
            navigate('/login');
            return;
        }

        const url = serverl_url + "/donor/addavailmed";
        const addformdata = new FormData();
        
        // Add all form data to FormData
        for (let prop in formdata) {
            if (formdata[prop] !== null && formdata[prop] !== undefined) {
                addformdata.append(prop, formdata[prop]);
            }
        }

        try {
            const resp = await axios.post(url, addformdata, {
                headers: {  
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (resp.data.status === "success") {
                // Update token if a new one is provided
                if (resp.data.token) {
                    localStorage.setItem("token", resp.data.token);
                    settoken(resp.data.token);
                }
                alert("Medicine Added Successfully");
                // Clear the form after successful submission
                handleClear(e);
            } else {
                throw new Error(resp.data.msg || 'Failed to add medicine');
            }
        } catch (err) {
            console.error('Error in handleSubmit:', err);
            alert(err.response?.data?.msg || "Error adding medicine. Please try again.");
        }
    }

    const handleClear = (e) => {
        e.preventDefault();
        setformdata(initialFormState);
        setImagePreview("");
        setDiseasesEditable(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleImageAreaClick = (e) => {
        e.preventDefault();
        if (fileInputRef.current) fileInputRef.current.click();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-100 to-slate-200 py-8 px-4">
            <form className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl space-y-4 border border-gray-100" onSubmit={handleSubmit}>
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-4">Available Medicines</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                        readOnly
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formdata.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                        <input
                            type="text"
                            name="medname"
                            placeholder="Enter medicine name"
                            value={formdata.medname}
                            onChange={handleChange}
                            onBlur={fetchDiseasesForMedicine}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Type</label>
                        <select
                            name="medtype"
                            value={formdata.medtype}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select type</option>
                            <option value="Tablet">Tablet</option>
                            <option value="Syrup">Syrup</option>
                            <option value="Capsule">Capsule</option>
                            <option value="Injection">Injection</option>
                            <option value="Ointment">Ointment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diseases this medicine is used for</label>
                        <div className="relative">
                            <textarea
                                name="usedfor"
                                placeholder="Enter diseases"
                                value={formdata.usedfor}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[48px]"
                                rows={2}
                                disabled={!diseasesEditable}
                            />
                            {loadingDiseases && (
                                <span className="absolute right-2 top-2 text-xs text-blue-500 animate-pulse">Loading diseases...</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Price in Rupees</label>
                        <input
                            type="number"
                            name="medprice"
                            placeholder="Enter price"
                            value={formdata.medprice}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Quantity</label>
                        <input
                            type="number"
                            name="medquantity"
                            placeholder="Enter medicine quantity"
                            value={formdata.medquantity}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Expiry</label>
                        <input
                            type="date"
                            name="dateofexpiry"
                            value={formdata.dateofexpiry}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            placeholder="Enter city"
                            value={formdata.city}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Discription</label>
                        <textarea
                            name="meddiscription"
                            placeholder="Enter description"
                            value={formdata.meddiscription}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[48px]"
                            rows={2}
                        />
                    </div>
                    <div className="md:col-span-2 flex flex-col items-center">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Image</label>
                        <div
                            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden mb-2 cursor-pointer hover:border-blue-400"
                            onClick={handleImageAreaClick}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Medicine Preview"
                                    className="object-contain w-full h-full"
                                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                                />
                            ) : (
                                <span className="text-gray-400 text-xs text-center">Click to select image</span>
                            )}
                        </div>
                        <input
                            type="file"
                            name="medimage"
                            accept="image/*"
                            onChange={handleChange}
                            ref={fileInputRef}
                            className="hidden"
                        />
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
                    >
                        Add Medicine
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-400 active:bg-gray-500 transition-colors cursor-pointer"
                    >
                        Clear All
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Availmed;