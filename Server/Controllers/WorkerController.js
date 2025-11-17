const bcryptjs=require("bcryptjs");
const {worker_model}=require("../Models/WorkerModel")
const errorhandler=require("../Middleware/custom_error")
const w_signup=async(req,res,next)=>{
    const{fullname,email,password,mobile,gender,UserType,experience,role,v_charges}=req.body;
    const w_hashed_password=bcryptjs.hashSync(password,10);
    try{
        const w_info=worker_model({
            fullname,
            email,
            password:w_hashed_password,
            mobile,
            gender,
            UserType,
            experience,
            role,
            v_charges

        })
        await w_info.save().then(()=>{
            res.status(200).json({
                message:"Worker Signed up SuccessFully."
            })
        })

    }
    catch{
        next(errorhandler(500,"Signed Up Failed."))

    }


}
module.exports={w_signup}