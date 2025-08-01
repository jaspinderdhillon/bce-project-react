var mongoose = require("mongoose");

var availmedschema = new mongoose.Schema({
    email:{type:String,required:true},
    medname:{type:String,required:true},
    medtype:{type:String,required:true},
    medprice:{type:Number,required:true},
    medquantity:{type:Number,required:true},
    dateofexpiry:{type:Date,required:true},
    city:{type:String,required:true},
    usedfor:{type:String,required:true},
    meddiscription:{type:String},
    medimage:{type:String,required:true},
}, { versionKey: false });

module.exports = mongoose.model("availmedcollection", availmedschema);