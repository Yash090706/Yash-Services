const errorhandler=require("../Middleware/custom_error")
// const express=require("express")
const {journey_model}=require("../Models/JourneyModel");

const journey=async(req,res,next)=>{
    const{uid,wid,j_hid,u_add,w_add,status,date_time}=req.body;

    if(!uid || !wid || !j_hid){
        return next(errorhandler(404,"Not Found"))
    }
    try{
        const journey_info=journey_model({
            uid,wid,j_hid,u_add,w_add,status,date_time
        })
        await journey_info.save();

        res.status(200).json({
            status:1,
            msg:" Journey Info Saved"
        })

        // await journey_info.deleteOne({j_hid:j_hid});

    }
    catch(err){
        return next(errorhandler(500,err.message))
    }
}
const get_journey_address=async(req,res,next)=>{
    const {rid}=req.params
    if(!rid){
        return next(errorhandler(404,"Not Found"))
    }
    const address_info=await journey_model.findOne({j_hid:rid})

    res.status(200).json({
        status:1,
        address_info
    })


}

module.exports={journey,get_journey_address}
