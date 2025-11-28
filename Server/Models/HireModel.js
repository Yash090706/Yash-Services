const mongoose = require("mongoose");
// const { user_model } = require("./UserModel")

const hire_schema = mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_model",
    required: true,
  },
  workerid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker_model",
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    
  },
  address: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const hire_model=mongoose.model("Hiremodel",hire_schema);

module.exports={hire_model}