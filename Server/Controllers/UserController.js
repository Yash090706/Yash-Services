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
        // const token_expiry=new Date(Date.now()+60*60*1000);
        const token_expiry = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        res.cookie("user_token",token,{httpOnly:true,expires:token_expiry,secure: false,         // true only when using HTTPS
  sameSite: "lax",}).status(200).json({
            others
        })
    }
    catch(err){
        console.log(err)
        next(errorhandler(500,"Internal Server Error."));
    }

}
const verify_token=(req,res,next)=>{
    const token=req.cookies.user_token;
    // const tokenFromHeader = req.headers.authorization?.split(" ")[1];
  
//   const token = tokenFromCookie || tokenFromHeader;
    if(!token){
        return next(errorhandler(401,"Access Denied"));
    }
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
            return next(errorhandler(402,"Token Not Valid"));
        }
        req.user=user;
        next();
        // here user contains id only

    })
    
}
const update_user=async(req,res,next)=>{
    const{id}=req.params;
    if(req.user.id!=id){
        return next(errorhandler(401,"You can Update only your account."))

    }
    try{
        const updated_data={};
       const {password,mobile,fullname,email}=req.body
       if(fullname){
        updated_data.fullname=fullname;
       }
       if(mobile){
        updated_data.mobile=mobile;
       }
       if(email){
        updated_data.email=email;
       }
       if(password){
        const h_password=bcryptjs.hashSync(password,10);
        updated_data.password=h_password;
       }
       const user_update=await user_model.findByIdAndUpdate(id,updated_data,{new:true});
       const{password:uhashed_pass,...rest}=user_update._doc;
       res.status(200).json({
        status:1,
        message:"User Updated SuccessFully.",
        others:rest
       })
    }
    catch(err){
        next(errorhandler(500,"Internal Server Error."))

    }

}
const user_sign_out=(req,res,next)=>{
    res.clearCookie("user_token",{httpOnly:true}).status(200).json({
        status:1,
        msg:"User Signed Out SuccessFully."
    })
}

module.exports={signup,signin,verify_token,update_user,user_sign_out};