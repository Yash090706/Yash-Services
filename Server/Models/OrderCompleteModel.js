const mongoose = require("mongoose");


const orderSchema = mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  wid: {
    type: String,
    required: true,
  },
  hid: {
    type: String,
    required: true,
  },
  uname: {
    type: String,
    required: true,
  },
  wname: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  details:[{
     desc:{type:String,required:true},
     charge:{type:Number,required:true}}

],
  total:{
     type:Number,
     required:true
  }
});

const orderModel = mongoose.model("orderComplete", orderSchema);

module.exports = { orderModel };
