const mongoose=require("mongoose");

const notificationSchema=mongoose.Schema({
    cid:{
        type:String,
        required:true
    },
    hid:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    wname:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }
})

const notificationModel=mongoose.model("notifications",notificationSchema);

module.exports={notificationModel}