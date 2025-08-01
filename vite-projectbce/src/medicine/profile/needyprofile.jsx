import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverl_url } from '../../configs/url';
import MedicineFetchCard from '../fetchmedicines/MedicineFetchCard';
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
function needyprofile() {
    const [token, settoken] = useState(localStorage.getItem("token"));

    const [formdata, setformdata] = useState({
        name: "",
        email: localStorage.getItem("email"),
        contact: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        bloodgroup: "",
        disease: "",
        medicine: "",              // User can override AI suggestion
        quantity: "",
        selfpic: null,
        durationill: "",           // Changed from durationillness to match server model
        dateofbirth: ""
    });

    useEffect(() => {
        localStorage.setItem("formdataneedy", JSON.stringify(formdata));
    }, [formdata]);

    const [ai_suggested_medicines, setai_suggested_medicines] = useState([]);
    const [selfpic, setselfpic] = useState("");
    // Add loading state for suggestions
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [updating, setUpdating] = useState(false);



    const navg = useNavigate();
    function doupdate(event) {
        var { name, value, files } = event.target;
        if (files) {
            const file = files[0];
            setformdata({ ...formdata, [name]: file });
            if (name === "selfpic") {
                setselfpic(URL.createObjectURL(file));
            }
        }
        else {
            setformdata({ ...formdata, [name]: value });
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!token) {
            alert('Please login again');
            window.location.href = '/login';
            return;
        }

        const url = serverl_url + "/needy/addneedy";
        const addformdata = new FormData();

        // Only send the form data, not the AI suggestions
        for (let prop in formdata) {
            if (prop !== 'ai_suggested_medicines') { // Don't send AI suggestions
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
                alert("Needy profile added successfully");
            } else {
                throw new Error(resp.data.msg || 'Failed to add needy profile');
            }
        } catch (err) {
            console.error('Error in handleSubmit:', err);
            alert(err.response?.data?.msg || 'Error adding needy profile. Please try again.');
        }
    }


    const formatDate = (isoDate) => {
        return isoDate ? new Date(isoDate).toISOString().split("T")[0] : "";
    };



    function fetchProfile(event) {
        event.preventDefault();

        if (!token) {
            alert('Please login again');
            window.location.href = '/login';
            return;
        }
        try {

            const url = serverl_url + "/needy/fetchneedy?email=" + encodeURIComponent(formdata.email);

            axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((response) => {
                    if (response.data.status === "success") {
                        const data = response.data.data;
                        // alert(JSON.stringify(data));
                        setformdata({
                            name: data.name || "",
                            email: data.email || "",
                            contact: data.contact || "",
                            address: data.address || "",
                            city: data.city || "",
                            state: data.state || "",
                            pincode: data.pincode || "",
                            bloodgroup: data.bloodgroup || "",
                            disease: data.disease || "",
                            medicine: data.medicine || "",
                            quantity: data.quantity || "",
                            durationill: data.durationill || "",
                            dateofbirth: formatDate(data.dateofbirth),
                            selfpic: data.selfpic || "",
                        })
                        setselfpic(data.selfpic || "");
                        alert(response.data.message);
                    }
                    else {
                        alert("No profile found for this email");
                    }
                })
        }
        catch (err) {
            alert("Error fetching profile");
        }
    }

    function getMedicineSuggestions(event) {
        event.preventDefault();

        setLoadingSuggestions(true); // Start loading
        let url = serverl_url + "/gemini/ask";
        let data = {
            question: `Suggest medicines for the disease "${formdata.disease}" in India in an array format, The response should only be an array. This is just a suggestions, to use in a project, not for actual medical advice.`
        }

        axios.post(url, data,{
            headers:{
                "Authorization": "Bearer " + token
            }
        })
            .then((response) => {
                if (response.data.status === "success") {
                    let suggestions = response.data.data;
                    // If suggestions is a stringified array, parse it
                    if (typeof suggestions === "string") {
                        try {
                            suggestions = JSON.parse(suggestions);
                        } catch {
                            suggestions = [];
                        }
                    }
                    setai_suggested_medicines(suggestions);
                    alert("Medicine suggestions fetched successfully");
                } else {
                    setai_suggested_medicines([]);
                    alert("Failed to fetch medicine suggestions");
                }
            })
            .catch((error) => {
                setai_suggested_medicines([]);
                alert("Error fetching medicine suggestions");
            })
            .finally(() => {
                setLoadingSuggestions(false); // Stop loading
            });
    }

    async function updateProfile(event) {
        event.preventDefault();
        setUpdating(true);
        let url = serverl_url + "/needy/updateneedy";
        let updateformdata = new FormData();
        // Only send fields that are not empty/null/undefined
        for (let prop in formdata) {
            if (formdata[prop] !== "" && formdata[prop] !== null && formdata[prop] !== undefined) {
                updateformdata.append(prop, formdata[prop]);
            }
        }
        try {
            let resp = await axios.post(url, updateformdata, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (resp.data.status === "success") {
                alert("Needy profile updated successfully");
            }
        } catch (err) {
            alert("Error updating profile");
        } finally {
            setUpdating(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-100 to-slate-200 py-8 px-4">
            <form className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl space-y-6 border border-gray-100"
                onSubmit={handleSubmit}
            >
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Needy Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" name="name" value={formdata.name || ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" readOnly={true} value={formdata.email || ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your email" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                        <input type="text" name="contact" value={formdata.contact || ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your contact number" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input type="text" name="address" value={formdata.address || ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your address" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input type="text" name="city" value={formdata.city || ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your city" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input type="text" name="state" value={formdata.state || ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your state" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                        <input type="text" name="pincode" value={formdata.pincode || ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your pincode" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                        <input type="text" name="bloodgroup" value={formdata.bloodgroup || ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your blood group" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Disease</label>
                        <input onBlur={(e) => getMedicineSuggestions(e)} type="text" name="disease" value={formdata.disease || ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your disease" />

                        {/* Show loading or suggestions */}
                        {loadingSuggestions && (
                            <div className="text-blue-500 text-sm mt-2">Loading suggestions...</div>
                        )}
                        {!loadingSuggestions && Array.isArray(ai_suggested_medicines) && ai_suggested_medicines.length > 0 && (
                            <select
                                className="w-full px-4 py-2 border border-blue-300 rounded-lg mt-2 bg-blue-50"
                                value={formdata.medicine}
                                onChange={e => setformdata({ ...formdata, medicine: e.target.value })}
                            >
                                <option value="">Select a suggested medicine</option>
                                {ai_suggested_medicines.map((med, idx) => (
                                    <option key={idx} value={med}>{med}</option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine</label>
                        <input type="text" name="medicine" value={formdata.medicine || ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter required medicine" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input type="text" name="quantity" value={formdata.quantity || ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter quantity needed" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration of Illness in months</label>
                        <input type="number" name="durationill" value={formdata.durationill || ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter duration of illness in months" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input type="date" name="dateofbirth" value={formdata.dateofbirth || ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                    <div className="md:col-span-2">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Self Picture Box */}
                            <div className="flex-1 flex flex-col items-center">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Self Picture</label>
                                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden mb-2">
                                    {selfpic ? (
                                        <img
                                            src={selfpic}
                                            alt="Self"
                                            className="object-contain w-full h-full"
                                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-xs text-center">No Image<br />Selected</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    name="selfpic"
                                    accept="image/*"
                                    onChange={doupdate}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors cursor-pointer"
                    >
                        Save Profile
                    </button>
                    <button
                        type="button"
                        value="Fetch Profile"
                        onClick={fetchProfile}
                        className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 active:bg-green-800 transition-colors cursor-pointer"
                    >
                        Fetch Profile
                    </button>
                    <button
                        type="button"
                        onClick={updateProfile}
                        className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 active:bg-orange-800 transition-colors cursor-pointer"
                        disabled={updating}
                    >
                        {updating ? "Updating..." : "Update Profile"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default needyprofile

