const mongoose=require("mongoose")

const journey_schema=mongoose.Schema({
    uid:{
        type:String,
        required:true
    },
    wid:{
        type:String,
required:true

    },
    j_hid:{
        type:String,
        required:true
    },
    u_add:{
        type:String,
required:true
    },
    w_add:{
        type:String,
required:true
    },
    status:{
        type:String,
        // default:"On the Way",
    },
    date_time:{
        type:Date,
        required:true
    }
})

const journey_model=mongoose.model("journey",journey_schema);

module.exports={journey_model}