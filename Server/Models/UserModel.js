let mongoose = require("mongoose");

let user_schema = mongoose.Schema({
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
  UserType:{
    type:String,
    required:true,
    enum:["Customer"],
    default:"Customer"

  }
});

const user_model=mongoose.model("UserModel",user_schema);

module.exports={user_model};
