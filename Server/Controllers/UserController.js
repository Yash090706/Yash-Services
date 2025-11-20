const errorhandler=require("../Middleware/custom_error");
const bcryptjs=require("bcryptjs");
const { user_model } = require("../Models/UserModel");
const jwt=require("jsonwebtoken");
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
const signin=async(req,res,next)=>{
    const{email,password,UserType}=req.body;
    try{
        const signin_info= await user_model.findOne({email:email});
        if(!signin_info){
            return next(errorhandler(404,"User Not Found"));
        }
        if(!bcryptjs.compareSync(password,signin_info.password)){
            return next(errorhandler(401,"Invalid Credentials."));
        }
        if(UserType!=signin_info.UserType){
            return next(errorhandler(400,"Bad Request"));
        }
        const{password:hashed_password,...others}=signin_info._doc;
        const token=jwt.sign({id:signin_info._id},process.env.JWT_SECRET_KEY);
        const token_expiry=new Date(Date.now()+60*60*1000);
        res.cookie("WorkerToken",token,{httpOnly:true,expires:token_expiry}).status(200).json({
            others
        })
    }
    catch{
        next(errorhandler(500,"Internal Srver Error."));
    }

}

module.exports={signup,signin};