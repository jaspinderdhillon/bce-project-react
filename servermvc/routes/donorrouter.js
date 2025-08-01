let express = require("express");
let donorrouter = express.Router();
let donorobj=require("../controller/donorcontroller");
let {ValidateTokenn2}=require("../config/validate");

donorrouter.post("/adddonor",ValidateTokenn2,donorobj.adddonor);    
donorrouter.get("/fetchdonor",ValidateTokenn2,donorobj.fetchdonor);
donorrouter.post("/updatedonor",ValidateTokenn2,donorobj.updatedonor);
donorrouter.post("/addavailmed",ValidateTokenn2,donorobj.addavailmed);
donorrouter.get("/medicinemanager",ValidateTokenn2,donorobj.medicinemanager);
donorrouter.get("/deletemedicine",ValidateTokenn2,donorobj.deletemedicine);
donorrouter.get("/getBuyersForMedicine",ValidateTokenn2,donorobj.getBuyersForMedicine); 


module.exports = donorrouter;