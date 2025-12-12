const mongoose = require("mongoose");

const worker_schema = mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  UserType: {
    type: String,
    required: true,
    enum: ["Worker"],
    default: "Worker",
  },
  role:{
    type:String,
    required:true,
  },
  experience:{
    type:Number,
    required:true
  },
  v_charges:{
    type:Number,
    required:true
  },
  w_address:{
    type:String,
    required:true
  }

});

const worker_model=mongoose.model("Worker_Model",worker_schema);

module.exports={worker_model}