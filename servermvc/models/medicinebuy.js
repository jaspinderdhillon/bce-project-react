const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  emailtosearch: { type: String, required: true, index: true },//email of the needy
  email: { type: String, required: true, index: true },//email of the donor
  contact: { type: String, required: true, index: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  medicineself: { type: String, required: true },//medicine of the needy
  medicinedonor:{type:String,required:true},//medicine of the donor
  quantity: { type: String, required: true },
  durationill: { type: Number, required: true },
  disease: { type: String, required: true },
  selfpic: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model("medicinebuycollection", userSchema);