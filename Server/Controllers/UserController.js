const errorhandler=require("../Middleware/custom_error");
const bcryptjs=require("bcryptjs");
const { user_model } = require("../Models/UserModel");
const signup=async(req,res,next)=>{
    const{fullname,email,password,mobile,gender,UserType}=req.body;
    const hashed_password=bcryptjs.hashSync(password,10);
    try{
    const user_signup__info=user_model({
        fullname,
        email,
        password:hashed_password,
        mobile,
        gender,
        UserType

    })
    await user_signup__info.save().then(()=>{
        res.status(200).json({
            message:"User Signed Up SuccessFully."
        })
    })
    }
    catch{
        next(errorhandler(500,"Sign Up Failed."));
    }

}

module.exports={signup};