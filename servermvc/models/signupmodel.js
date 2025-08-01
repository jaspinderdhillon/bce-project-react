const mongoose = require('mongoose');

function signupmodel() {
  const userschema = mongoose.Schema;
  
  const usercolschema = {
    name: String,
    email: { type: String, required: true, unique: true, index: true },
    pwd: { type: String, required: true },
    dos: { type: Date, default: Date.now },
    status: { type: Boolean, default: true }, // indicates if user is active
    user: String // role: donor / needy
  };

  const ver = { versionKey: false };

  const UserColSchema = new userschema(usercolschema, ver);
  const usercolref = mongoose.model("signupcollection", UserColSchema);

  return usercolref;
}

module.exports = { signupmodel };
