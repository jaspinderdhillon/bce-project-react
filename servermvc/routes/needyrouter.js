let express = require("express");
let needyrouter = express.Router();
let needyobj=require("../controller/needycontroller");
let {ValidateTokenn2}=require("../config/validate");


needyrouter.post("/addneedy",ValidateTokenn2,needyobj.addneedy);
needyrouter.get("/fetchneedy",ValidateTokenn2,needyobj.fetchneedy);
needyrouter.post("/updateneedy",ValidateTokenn2,needyobj.updateneedy);
needyrouter.get("/fetchmedicine",ValidateTokenn2,needyobj.fetchmedicine);
needyrouter.post("/buynow",ValidateTokenn2,needyobj.buynow);
// needyrouter.post("/askdonor",needyobj.askdonor);
module.exports = needyrouter;   