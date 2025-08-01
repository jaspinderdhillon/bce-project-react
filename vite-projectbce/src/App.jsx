import React, { useState } from "react";
import Login from "./medicine/login-signup/login";
import Signup from "./medicine/login-signup/signup";
import DonorProfile from "./medicine/profile/donorprofile";
import NeedyProfile from "./medicine/profile/needyprofile";
import Availmed from "./medicine/profile/availmed";
import Medicinemanager from "./medicine/manager/medicinemanager";
import Topbar from "./medicine/params/topbar";
import Params from "./medicine/params/Params";
import Search from "./medicine/params/Search";
import MedicineBuyerCard from "./medicine/manager/MedicineBuyerCard";
import MedicineFetchCard from "./medicine/fetchmedicines/MedicineFetchCard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FetchMedicines from "./medicine/fetchmedicines/FetchMedicine";
import Donordashboard from "./medicine/Dashboards/Donordashboard";
import Needydashboard from "./medicine/Dashboards/Needydashboard";
import MainPage from './components/MainPage.jsx';
import LoginSignupBtn from './components/loginsignupbtn.jsx';
export default function App() {
  const [isuserloggedin, setloginstatus] = useState(false);
  const updateloginstatus = (status) => {
    setloginstatus(status);
  };

  return (
    <BrowserRouter>
      {/* <Topbar isuserloggedin={isuserloggedin} loginstatusupdate={updateloginstatus} /> */}
      {/* <LoginSignupBtn/> */}
      <Routes>  
        <Route path="/" index element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login loginstatusupdate={updateloginstatus} />} />
        <Route path="/donor/donordashboard" element={<Donordashboard />} />
        <Route path="/needy/needydashboard" element={<Needydashboard />} />
        <Route path="/donor/availmedicine" element={<Availmed />} />

        <Route path="/donor/medicinemanager" element={<Medicinemanager />} />
        <Route path="/needy/fetchmedicine" element={<FetchMedicines />} />
        <Route path="/donor/needyprofile" element={<NeedyProfile />} />
        <Route path="/donor/donorprofile" element={<DonorProfile />} />
        <Route path="/donor/medicinebuyer" element={<MedicineBuyerCard />} />
        <Route path="/needy/needyprofile" element={<NeedyProfile />} />
        <Route path="/needy/availmedicine" element={<Availmed />} />
        <Route path="/needy/medicinemanager" element={<Medicinemanager />} />
        <Route path="/needy/medicinebuyer" element={<MedicineBuyerCard />} />
        <Route path="/params/:name/:mobile" element={<Params />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}
