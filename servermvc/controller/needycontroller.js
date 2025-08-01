// var model = require("../models/needymodel");
// var needycolref = model.needymodel();
const needymodel = require("../models/needymodel");
const availmedmodel = require("../models/availmedmodel");
const medicinebuymodel = require("../models/medicinebuy");

let config1 = require("../config/configuration");
let path = require("path");
let cloudinary = require("cloudinary").v2;
cloudinary.config(config1.cloudinaryurl);

async function addneedy(req,resp){
    try{
        
      if(req.files){
            if(req.files.selfpic){
                let selfpicname = req.files.selfpic.name;
                let locationtosave = path.join(__dirname, "../", "uploads", selfpicname);
                await req.files.selfpic.mv(locationtosave);
                let picurlresult = await cloudinary.uploader.upload(locationtosave);
                req.body.selfpic = picurlresult.secure_url;
            }
            console.log(req.body);
        }
        let needy = new needymodel(req.body);
        await needy.save().then((result)=>{
            resp.status(200).json({status: "success", message:"needy added successfully",data:result});
        }).catch((err)=>{
            resp.status(500).json({status: "error", message:"error in adding needy",error:err});
        });
    }catch(err){
        resp.status(500).json({status: "error", message:"error in adding needy",error:err});
    }
}

async function fetchneedy(req,resp){
    const {email}=req.query;
    console.log("email is "+email);

    if(!email){
        return resp.status(400).json({status: "error", message: "Email is required"});
    }
    needymodel.findOne({email:email}).then((result)=>{
        if(result){
            resp.status(200).json({status: "success", message: "Profile fetched successfully", data: result});
        }else{
            resp.status(404).json({status: "error", message: "No profile found for this email"});
        }
    }).catch((err)=>{
        resp.status(500).json({status: "error", message: "Error fetching profile", error: err.message});
    });

}

async function updateneedy(req, resp) {
    console.log(req.body);
    try {
      const email = req.body.email;
      if (!email) {
        return resp.status(400).json({ status: "error", message: "Email is required" });
      }
  
      let updateObj = { ...req.body };
      delete updateObj._id;
  
      // Fetch current user data
      let existing = await needymodel.findOne({ email: email });
  
      if (!existing) {
        return resp.status(404).json({ status: "error", message: "No profile found" });
      }
  
      // If file is uploaded
      if (req.files && req.files.selfpic) {
        const newFileName = req.files.selfpic.name;
  
        // Check if same file name as existing URL's last part
        let isSameFile = existing.selfpic && existing.selfpic.includes(newFileName);
  
        if (!isSameFile) {
          // Upload only if different
          let locationtosave = path.join(__dirname, "../", "uploads", newFileName);
          await req.files.selfpic.mv(locationtosave);
          let picurlresult = await cloudinary.uploader.upload(locationtosave);
          updateObj.selfpic = picurlresult.secure_url;
        } else {
          console.log("Skipping upload: same file name as existing image");
        }
      }
  
      let updated = await needymodel.findOneAndUpdate(
        { email: email },
        { $set: updateObj },
        { new: true }
      );
  
      if (updated) {
        resp.status(200).json({ status: "success", message: "Profile updated", data: updated });
      } else {
        resp.status(404).json({ status: "error", message: "Update failed" });
      }
  
    } catch (err) {
      resp.status(500).json({ status: "error", message: "Error updating profile", error: err.message });
    }
  }


  async function fetchmedicine(req, resp) {
      try {
          const { city, medname } = req.query;
          let filter = {};
  
          if (city) filter.city = city;
          // this regex makes the case insensitive
           if (medname) filter.medname = { $regex: new RegExp(medname, "i") };

          const medicines = await availmedmodel.find(filter);
          resp.status(200).json({ status: "success", data: medicines });
  
      } catch (err) {
          console.error(err);
          resp.status(500).json({ status: "error", message: "Error fetching medicines", error: err.message });
      }
  }


  async function buynow(req, resp) {
    // console.log("📦 Received Buy Request:", req.body);
    
    try {
      const { emailtosearch } = req.body;
      if (!emailtosearch) {
        return resp.status(400).json({ status: "error", message: "Email to search is required" });
      }
      // Check if a record with the same email already exists
      const existingBuy = await medicinebuymodel.findOne({ 
        email: req.body.email,
        emailtosearch: req.body.emailtosearch,
        medicineself: req.body.medicineself,
        medicinedonor: req.body.medicinedonor,
      });

      if (existingBuy) {
        console.log("⚠️ Medicine already bought by this user");
        return resp.status(400).json({ 
          status: "error", 
          message: "You have already bought this medicine from this donor" 
        });
      }

      // If no existing record, save the new one
      const newBuy = new medicinebuymodel(req.body);
      await newBuy.save().then((result) => {
          console.log("✅ Buy saved:", result);
          resp.status(200).json({ 
            status: "success", 
            message: "Medicine bought successfully" 
          });
        })
        .catch((err) => {
          console.error("❌ Error saving buy:", err.message);
          resp.status(500).json({ 
            status: "error", 
            message: "Error buying medicine", 
            error: err.message 
          });
        });
    } catch (err) {
      console.error("❌ Catch error:", err.message);
      resp.status(500).json({ 
        status: "error", 
        message: "Error processing your request", 
        error: err.message 
      });
    }
  }
  

module.exports = {addneedy,fetchneedy,updateneedy,fetchmedicine,buynow};