import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverl_url } from '../../configs/url';
import MedicineManagerCard from './MedicineManagerCard';
import MedicineBuyerCard from './MedicineBuyerCard';

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
function Medicinemanager() {
    // const navigate = useNavigate();
    const [email, setemail] = useState(localStorage.getItem("email"));
    const [medicines, setMedicines] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const token=localStorage.getItem("token");

    async function fetchMedicines() {
        if (!email) {
            alert("Please enter an email address");
            return;
        }
        
        let url = serverl_url + "/donor/medicinemanager?email=" +email;
        console.log("Fetching medicines from:", url);
        
        try {
            let resp = await axios.get(url,{
                headers:{
                    "Authorization": "Bearer " + token
                }
            });
            if (resp.data.status === "success") {
                
                setMedicines(resp.data.data);
                alert("Medicine Fetched Successfully");
                // console.log(JSON.stringify(resp.data.data));
            }
        } catch (err) {
            console.log(err.message);
            alert("Medicine Not Fetched");
        }
    }

    const handleDelete = async () => {
        if (!email) {
            alert("Please login again");
            window.location.href = '/login';
            return;
        }
        if(!confirm("Are you sure you want to delete this medicine?")){
            return;
        }
        let url = serverl_url + "/donor/deletemedicine?email=" + email;
        try {
            let resp = await axios.get(url,{
                headers:{
                    "Authorization": "Bearer " + token
                }
            });
            if (resp.data.status === "success") {
                fetchMedicines();
                alert("Medicine Deleted Successfully");
            }
        } catch (err) {
            console.log(err.message);
            alert("Medicine Not Deleted");
        }
    }



    const onViewBuyers = async (donorEmail, medname) => {
        if (!email) {
            alert("Please login again");
            window.location.href = '/login';
            return;
        }
        console.log("onViewBuyers called for donorEmail: ", donorEmail, " and medname: ", medname);
        
        try {
          const res = await axios.get(`${serverl_url}/donor/getbuyersformedicine`, {
            params: { 
              email: donorEmail, 
              medname: medname 
            },
            headers: {
              "Authorization": "Bearer " + token
            }
          });
      
          if (res.data.status === "success") {
            setBuyers(res.data.data);
            console.log("✅ Buyers fetched:", res.data.data);
          } else {
            alert(res.data.message || "No buyers found");
          }
        } catch (err) {
          console.error("❌ Error fetching buyers:", err);
          alert("Server error while fetching buyers");
        }
      };
      
      
      

    const handleChange = (e) => {
        setemail(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-10 px-2">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-8 tracking-tight drop-shadow">Medicine Manager</h1>
            
            {/* Changed from <form> to <div> */}
            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center gap-4 w-full max-w-md mb-10">
                <label htmlFor="email" className="text-lg font-medium text-gray-700 w-full text-left">
                    Email
                </label>
                <input
                readOnly
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-md px-4 py-2 w-full transition"
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                />
                <button
                    onClick={fetchMedicines}  // Use onClick instead of onSubmit
                    className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded-md px-6 py-2 shadow w-full mt-2"
                >
                    Fetch/Manage Medicine
                </button>
            </div>

            <div className="w-full flex flex-wrap justify-center gap-6">
                {
                   
                        medicines.map((med, idx) => (
                            <MedicineManagerCard
                                key={idx}
                                {...med}
                            onDelete={handleDelete} 
                            onViewBuyers={()=>onViewBuyers(med.email,med.medname)} 
                        />
                    ))
                }
            </div>

            {buyers.length > 0 && (
                <div className="w-full max-w-4xl mx-auto mt-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Buyers for Selected Medicine</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                        {buyers.map((buyer, idx) => (
                            <MedicineBuyerCard
                                key={idx}
                                {...buyer}
                                onClose={() => setBuyers(buyers.filter((_, i) => i !== idx))}
                            />
                        ))}
                    </div>
                </div>
            )}
          
        </div>
    );
}

export default Medicinemanager;