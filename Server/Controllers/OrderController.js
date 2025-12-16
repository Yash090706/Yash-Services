const errorhandler=require("../Middleware/custom_error")
const { orderModel } = require("../Models/OrderCompleteModel")

const orderComplete=async(req,res,next)=>{
    const {uid,wid,hid,uname,wname,date,details,total}=req.body;

    if(!uid || !wid || !hid || !uname || !wname ||  !date || !details || !total){
        return next(errorhandler(404,"Required"))
    }
    if(details.length == 0){
        return next(errorhandler(404,"Required"))
    }
    try{
        const new_order=new orderModel({uid,wid,hid,uname,wname,date,details,total})

        const save_order=await new_order.save();

        res.status(200).json({
            status:1,
            msg:"Bill Saved Successfully",
            data:save_order
        })
    }
    catch(err){
        return next(errorhandler(500,err.message))

    }

}
module.exports={orderComplete}