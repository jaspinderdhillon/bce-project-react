import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { toFormData } from 'axios';
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


function DonorProfile() {
    // const navg=useNavigate();
    // let token=localStorage.getItem("token");
    const [formdata, setformdta] = useState({
        name: "",
        email: localStorage.getItem("email"),
        contact: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        proofname: "",
        proofnumber: "",
        bloodgroup: "",
        gender: "",
        occupation: "",
        dateofbirth: "",
        proofpic: null,
        selfpic: null,//string "" is replaced by the null
    })

    const [proofpic,setproofpic]=useState("");
    const [selfpic,setselfpic]=useState("");
    const [token,settoken]=useState(localStorage.getItem("token"));
    
    function doupdate(event) {
        var { name, value ,files } = event.target;
        if(files){
            const file=files[0];
          setformdta({...formdata,[name]:file});
          if(name==="proofpic"){
            setproofpic(URL.createObjectURL(file)); 
          }
          if(name==="selfpic"){
            setselfpic(URL.createObjectURL(file));
          }
        }
        else{
            setformdta({...formdata,[name]:value});
        }
    }

    //==============ADD DONOR==============
    async function handleSubmit(event) {
        event.preventDefault();
        
        if (!token) {
            alert('Please login again');
            window.location.href = '/login';
            return;
        }

        const url = serverl_url + "/donor/adddonor";
        const addformdata = new FormData();
        
        for (let prop in formdata) {
            addformdata.append(prop, formdata[prop]);
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
                alert("Donor added successfully");
            } else {
                throw new Error(resp.data.msg || 'Failed to add donor');
            }
        } catch (err) {
            console.error('Error in handleSubmit:', err);
            alert(err.response?.data?.msg || 'Error adding donor. Please try again.');
        }
       setTimeout(() => {
        alert("refreshing after 3 seconds");
        navg("/donor/donordashboard");
       }, 3000);
    }

    // Add this helper before fetchProfile
        const formatDate = (isoDate) => {
        return isoDate ? new Date(isoDate).toISOString().split("T")[0] : "";
        };
  
    //==============FETCH DONOR==============
    function fetchProfile(event) {
        event.preventDefault();
        
        if (!token) {
            alert('Please login again');
            window.location.href = '/login';
            return;
        }

        try{
        const url = serverl_url + "/donor/fetchdonor?email=" + encodeURIComponent(formdata.email);
        
        axios.get(url, { 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if (response.data.status === "success") {
                        const data = response.data.data;
                        alert(JSON.stringify(data));
                        setformdta({
                            name: data.name|| "",
                            email: data.email || "",
                            contact: data.contact || "",
                            address: data.address   || "",
                            city: data.city || "",
                            state: data.state || "",
                            pincode: data.pincode || "",
                            proofname: data.proofname || "",
                            proofnumber: data.proofnumber || "",
                            bloodgroup: data.bloodgroup || "",
                            gender: data.gender || "",
                            occupation: data.occupation || "",
                            dateofbirth: formatDate(data.dateofbirth),
                            proofpic: data.proofpic || "",
                            selfpic: data.selfpic || "",
                        })
                        setproofpic(data.proofpic || "");
                        
                        setselfpic(data.selfpic || "");
                        alert(response.data.message);
                        console.log(response.data.message+" : "+ data);
                    }
                   
                else{
                    alert("No profile found for this email");
                }
            })
            } 
            catch(err){
                console.log(err.message);
                alert("Error fetching profile");
            }   
            // alert("fetch button clicked");
    }


    async function updateProfile(event){
        event.preventDefault();
        // let token=localStorage.getItem("token");
        let url=serverl_url + "/donor/updatedonor";
        let updateformdata=new FormData();
        for(let prop in formdata)
            updateformdata.append(prop,formdata[prop]);
        try{
            let resp=await axios.post(url,updateformdata,{
                headers:{   
                    "Content-Type":"multipart/form-data",
                    "authorization": "Bearer " + token
                }
            });
            console.log(resp.status);
            if(resp.status==="success"){
                alert("Donor profile updated successfully");
            }
        }catch(err){
            console.log(err.message);
            alert("Error updating profile");
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-100 to-slate-200 py-8 px-4">
            
            <form className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl space-y-6 border border-gray-100"
            onSubmit={handleSubmit}
            >
                <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Donor Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" name="name" value={formdata.name|| ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input readOnly type="email" name="email" value={formdata.email|| ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your email" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                        <input type="text" name="contact" value={formdata.contact|| ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your contact number" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input type="text" name="address" value={formdata.address|| ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your address" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input type="text" name="city" value={formdata.city|| ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your city" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input type="text" name="state" value={formdata.state|| ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your state" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label> 
                        <input type="text" name="pincode" value={formdata.pincode|| ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your pincode" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                        <input type="text" name="bloodgroup" value={formdata.bloodgroup|| ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your blood group" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proof Number</label>
                        <input type="text" name="proofnumber" value={formdata.proofnumber|| ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter proof number" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proof Name</label>
                        <select name="proofname" value={formdata.proofname|| ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                            <option value="">Select Proof Type</option>
                            <option value="Aadhar Card">Aadhar Card</option>
                            <option value="PAN Card">PAN Card</option>
                            <option value="Driving License">Driving License</option>
                            <option value="Passport">Passport</option>
                            <option value="Voter ID">Voter ID</option>
                            <option value="Ration Card">Ration Card</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select name="gender" value={formdata.gender|| ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                        <input type="text" name="occupation" value={formdata.occupation|| ""} onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your occupation" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                        <input type="date" name="dateofbirth" value={formdata.dateofbirth|| "" } onChange={doupdate} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>  
                    <div className="md:col-span-2">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Proof Picture Box */}
                            <div className="flex-1 flex flex-col items-center">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Proof Picture</label>
                                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden mb-2">
                                    {proofpic ? (
                                        <img
                                            src={proofpic}
                                            alt="Proof"
                                            className="object-contain w-full h-full"
                                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-xs text-center">No Image<br />Selected</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    name="proofpic"
                                    accept="image/*"
                                    onChange={doupdate}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
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
                        // disabled={!formdata.email}
                        onClick={fetchProfile}
                        className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 active:bg-green-800 transition-colors cursor-pointer"
                    >
                        Fetch Profile
                    </button>
                    <button 
                        type="button" 
                        onClick={updateProfile}
                        className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 active:bg-orange-800 transition-colors cursor-pointer"
                    >
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    )
}

export default DonorProfile;