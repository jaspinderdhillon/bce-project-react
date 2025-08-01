const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true, index: true },
  contact: { type: String, required: true, index: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  bloodgroup: { type: String, required: true },
  disease: { type: String, required: true },
  medicine: { type: String, required: true },
  quantity: { type: String, required: true },
  dateofbirth: { type: Date, required: true },
  selfpic: { type: String, required: true },
  durationill: { type: Number, required: true },
}, { versionKey: false });

module.exports = mongoose.model("needyprofilecollection", userSchema);