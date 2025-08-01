import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure this path is correct
import App from './App.jsx';
import Login from './medicine/login-signup/login.jsx';
import Signup from './medicine/login-signup/signup.jsx';
import DonorProfile from './medicine/profile/donorprofile.jsx';
import NeedyProfile from './medicine/profile/needyprofile.jsx';
import Availmed from './medicine/profile/availmed.jsx';
import Medicinemanager from './medicine/manager/medicinemanager.jsx';
// import Topbar from './medicine/params/topbar.jsx';
import FetchMedicine from './medicine/fetchmedicines/FetchMedicine.jsx';
import MedicineCard from './medicine/manager/MedicineManagerCard.jsx';
import MedicineBuyerCard from './medicine/manager/MedicineBuyerCard.jsx';
import Donordashboard from './medicine/Dashboards/Donordashboard.jsx';
// import LoginSignupBtn from './components/loginsignupbtn.jsx';
// import MainPage from './mainpage/MainPage.jsx';
import MainPage from './components/MainPage.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
  <App/>
  {/* <LoginSignupBtn/> */}
  {/* {<MainPage/>} */}
  {/* <Login/> */}  
  {/* <Signup></Signup> */}
  {/* <DonorProfile></DonorProfile> */}
  {/* <Donordashboard></Donordashboard> */}
  {/* <NeedyProfile></NeedyProfile> */}
  {/* <Availmed></Availmed> */}
  {/* <Medicinemanager></Medicinemanager> */}
  {/* <Topbar></Topbar> */}
  {/* <FetchMedicine/>   */}
  {/* <MedicineBuyerCard/> */}
  {/* <Medicinemanager/> */}
  {/* {MedicineCard} */}
  </>,
) 