var model = require("../models/donormodel");
var donorcolref = model.donormodel(); //here was the problem 1 was making a contructor

let config1 = require("../config/configuration");
let path = require("path");

let cloudinary = require("cloudinary").v2;
cloudinary.config(config1.cloudinaryurl);

const availmedmodel = require("../models/availmedmodel");
const medicinebuycollection = require("../models/medicinebuy");



// const DonorModel = require("../models/donormodel");
// const donor = new DonorModel(req.body);//used in the saving of the data
// await donor.save();


async function adddonor(req, resp,next) {

  console.log(req.body)

    try {
      if (req.files) {
        if (req.files.proofpic) {
          let proofpicname = req.files.proofpic.name;
          let locationtosave = path.join(__dirname, "../", "uploads", proofpicname);
          await req.files.proofpic.mv(locationtosave);
          let picurlresult = await cloudinary.uploader.upload(locationtosave);
          console.log(locationtosave);
          req.body.proofpic = picurlresult.secure_url;
        }
  
        if (req.files.selfpic) {
          let selfpicname = req.files.selfpic.name;
          let locationtosave = path.join(__dirname, "../", "uploads", selfpicname);
          await req.files.selfpic.mv(locationtosave);
          let picurlresult = await cloudinary.uploader.upload(locationtosave);
          console.log(locationtosave);
          req.body.selfpic = picurlresult.secure_url;
        }
  
        console.log("Final data to save:", req.body);
      } else {
        return resp.json({ status: "error", message: "No files uploaded" });
      }
  
      var donorobj=new donorcolref(req.body);
      donorobj.save().then((result)=>{
          resp.json({status:"success",message:"Donor added successfully",data:result});
      }).catch((err)=>{
          resp.json({status:"error",message:"Donor not added",data:err});
      });
    } catch (err) {
      console.error("Error in adddonor:", err);
      next(err);
    }
  }
  

function fetchdonor(req,resp,next){

  const  {email} = req.query;
  
  console.log("email is "+email);
  if(!email){
    return resp.json({status:"error",message:"Email is required"});
  } 
  donorcolref.findOne({email:email}).then((result)=>{
    if(result){
    
      resp.json({status:"success",message:"Donor fetched successfully",data:result});

    }else{
      resp.json({status:"error",message:"Donor not found"});
    }
  }).catch((err)=>{
    console.error("Error fetching donor:", err);
    next(err);
  });

}



async function updatedonor(req, resp) {
  try {
    const email = req.body.email;
    if (!email) {
      return resp.status(400).json({ status: "error", message: "Email is required" });
    }

    const existingDonor = await donorcolref.findOne({ email: email });
    if (!existingDonor) {
      return resp.status(404).json({ status: "error", message: "No donor found with this email" });
    }

    let updateObj = { ...req.body };
    delete updateObj._id;

    // Handle selfpic
    if (req.files && req.files.selfpic) {
      const uploadedSelfpicName = req.files.selfpic.name;
      const selfpicAlreadyUploaded = existingDonor.selfpic && existingDonor.selfpic.includes(uploadedSelfpicName);

      if (!selfpicAlreadyUploaded) {
        const selfpicPath = path.join(__dirname, "../", "uploads", uploadedSelfpicName);
        await req.files.selfpic.mv(selfpicPath);
        const uploadedSelfpic = await cloudinary.uploader.upload(selfpicPath);
        updateObj.selfpic = uploadedSelfpic.secure_url;
      } else {
        console.log("Selfpic already uploaded, skipping upload.");
      }
    }

    // Handle proofpic
    if (req.files && req.files.proofpic) {
      const uploadedProofpicName = req.files.proofpic.name;
      const proofpicAlreadyUploaded = existingDonor.proofpic && existingDonor.proofpic.includes(uploadedProofpicName);

      if (!proofpicAlreadyUploaded) {
        const proofpicPath = path.join(__dirname, "../", "uploads", uploadedProofpicName);
        await req.files.proofpic.mv(proofpicPath);
        const uploadedProofpic = await cloudinary.uploader.upload(proofpicPath);
        updateObj.proofpic = uploadedProofpic.secure_url;
      } else {
        console.log("Proofpic already uploaded, skipping upload.");
      }
    }

    // Perform update
    const updatedDonor = await donorcolref.findOneAndUpdate(
      { email: email },
      { $set: updateObj },
      { new: true }
    );

    if (updatedDonor) {
      resp.status(200).json({ status: "success", message: "Donor profile updated successfully", data: updatedDonor });
    } else {
      resp.status(500).json({ status: "error", message: "Update failed" });
    }

  } catch (err) {
    resp.status(500).json({ status: "error", message: "Error updating profile", error: err.message });
  }
}

async function addavailmed(req,resp){

  try{    
      if(req.files.medimage){
        let medimagename = req.files.medimage.name;
        let locationtosave = path.join(__dirname, "../", "uploads", medimagename);
        await req.files.medimage.mv(locationtosave);
        let picurlresult = await cloudinary.uploader.upload(locationtosave);
        req.body.medimage = picurlresult.secure_url;
      }
      
      console.log("hiii1")
    
    let availmedobj=new availmedmodel(req.body);
    console.log(req.body);
   await availmedobj.save().then((result)=>{
    console.log("hiii3")
      resp.json({status:"success",message:"Availmed added successfully",data:result});
    }).catch((err)=>{
      console.log("hiii4")
      resp.json({status:"error",message:"Availmed not added",data:err});
    });
  }catch(err){
    resp.status(500).json({status:"error",message:"Error adding availmed",error:err.message});
  }
} 


async function medicinemanager(req,resp){
  console.log("request received for medicine manager" );
  const {email} = req.query;
  console.log(email);
  if(!email){
    return resp.json({status:"error",message:"Email is required"});
  }
  const medicinemanagerobj=await availmedmodel.find({email});
  resp.json({status:"success",message:"Medicine manager request received",data:medicinemanagerobj});  
} 


async function deletemedicine(req, resp) {
  const { email} = req.query;
  console.log("Delete request received for medicine:", email);

  if (!email) {
    return resp.json({ status: "error", message: "Email is required" });
  }

  try {
    const result = await availmedmodel.deleteOne({ email: email });
    if (result.deletedCount > 0) {
      resp.json({ status: "success", message: "Medicine deleted successfully" });
    } else {
      resp.json({ status: "error", message: "Medicine not found or already deleted" });
    }
  } catch (err) {
    console.error("Error deleting medicine:", err);
    resp.status(500).json({ status: "error", message: "Internal server error", error: err.message });
  }
}



async function getBuyersForMedicine(req, resp) {
  try {
    console.log("request received for buyers for medicine", req.query);

    const { email, medname } = req.query;

    if (!email || !medname) {
      return resp.status(400).json({ status: "error", message: "Email and medicine name are required" });
    }

    // Find buyers where donor email matches `emailtosearch` and donor medicine matches `medicinedonor`
    const buyers = await medicinebuycollection.find({
      emailtosearch: email,       // donor's email
      medicinedonor: medname      // donor's medicine name
    });

    if (!buyers.length) {
      return resp.json({ status: "error", message: "No buyers found for this medicine" });
    }

    resp.json({
      status: "success",
      message: "Buyers fetched successfully",
      data: buyers
    });

  } catch (err) {
    console.error("Error fetching buyers:", err);
    resp.status(500).json({
      status: "error",
      message: "Internal server error",
      error: err.message
    });
  }
}

module.exports = {adddonor,fetchdonor,updatedonor,addavailmed,medicinemanager,deletemedicine,getBuyersForMedicine};

// let donorobj=new donorcolref(req.body);
// donorobj.save().then((result)=>{
//   resp.json({status:"success",message:"Donor added successfully",data:result});
// }).catch((err)=>{
//   resp.json({status:"error",message:"Donor not added",data:err});
// });