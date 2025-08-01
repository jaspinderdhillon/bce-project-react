import React from "react";
import { useNavigate } from "react-router-dom";

function Topbar({ isuserloggedin, loginstatusupdate }) {
    const navg = useNavigate();

    function donavigate(url) {
        navg("/" + url);
    }

    function logout() {
        loginstatusupdate(false);
        navg("/login");
    }
    function goToParams(){
        navg("/params/jaspinder/9876543210");
    }
    function goToSearchParams(){
        navg("/search?name=jaspinder&mobile=9988767382");
    }
    return (
        <div className="flex space-x-2 flex-wrap">
            <div className="bg-blue-500 px-4 py-2" onClick={() => donavigate("signup")}>signup</div>

            {isuserloggedin ? (
                <div className="bg-blue-500 px-4 py-2" onClick={logout}>logout</div>
            ) : (
                <div className="bg-blue-500 px-4 py-2" onClick={() => donavigate("login")}>login</div>
            )}
            
            
            {/* <div className="bg-blue-500 px-4 py-2" onClick={() => donavigate("donor/donorprofile")}>donorprofile</div>
            <div className="bg-blue-500 px-4 py-2" onClick={() => donavigate("needy/needyprofile")}>needyprofile</div>
            <div className="bg-blue-500 px-4 py-2" onClick={() => donavigate("needy/availmedicine")}>availmed</div>
            <div className="bg-blue-500 px-4 py-2" onClick={() => donavigate("needy/medicinemanager")}>medicinemanager</div>
            <div className="bg-blue-500 px-4 py-2" onClick={() => donavigate("needy/medicinebuyer")}>medicinebuyer</div>
             */}
            {/* New buttons */}
            <div className="bg-green-600 px-4 py-2" onClick={goToParams}>UseParams Button</div>
            <div className="bg-green-600 px-4 py-2" onClick={goToSearchParams}>UseSearchParams Button</div>
        </div>
    );
}

export default Topbar;
