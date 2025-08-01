var mongoose = require('mongoose');

function donormodel() {
  var userschema = mongoose.Schema;
  
  var usercolschema = {
    name: String,
    email: { type: String, required: true, unique: true, index: true },
    contact: { type: String, required: true, index: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    bloodgroup: { type: String, required: true },
    proofname: { type: String, required: true },
    proofnumber: { type: String, required: true },
    gender: { type: String, required: true },
    occupation: { type: String, required: true },
    dateofbirth: { type: Date, required: true },
    proofpic: { type: String, required: true },
    selfpic: { type: String, required: true },
  };

  var ver = { versionKey: false };

  var UserColSchema = new userschema(usercolschema, ver);
  var usercolref = mongoose.model("donorprofilecollection", UserColSchema);

  return usercolref;
}

module.exports = { donormodel };





/*const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true, index: true },
  contact: { type: String, required: true, index: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  bloodgroup: { type: String, required: true },
  proofname: { type: String, required: true },
  proofnumber: { type: String, required: true },
  gender: { type: String, required: true },
  occupation: { type: String, required: true },
  dateofbirth: { type: Date, required: true },
  proofpic: { type: String, required: true },
  selfpic: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model("donorprofilecollection", userSchema);
*/
//returns directly to the controller