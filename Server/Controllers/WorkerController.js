const bcryptjs=require("bcryptjs");
const {worker_model}=require("../Models/WorkerModel")
const errorhandler=require("../Middleware/custom_error")
const jwt=require("jsonwebtoken");
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
const w_signin=async(req,res,next)=>{
    try{
    const {email,password,UserType}=req.body;
    
    const validate_worker=await worker_model.findOne({email:email});
    
    if(!validate_worker){
        return next(errorhandler(404,"User Not Found"));
    }
    if(!bcryptjs.compareSync(password,validate_worker.password)){
        return next(errorhandler(401,"Wrong Credentials"));
    }
    if(UserType!=validate_worker.UserType){
        return next(errorhandler(400,"Bad Request"));
    }
    // Should not send password in response so filtering it;
    const{password:w_hashed_password,...others}=validate_worker._doc;
    // We will send token in Cookies.
    const token=jwt.sign({id:validate_worker._id},process.env.JWT_SECRET_KEY);
    const token_expiry=new Date(Date.now()+60*60*1000);

    // Send the created token in cookie on browser
    res.cookie("access_token",token,{httpOnly:true,expires:token_expiry}).status(200).json(others);
    }
    catch(err){
        next(err);
    }


}
const show_workers=async(req,res,next)=>{
    try{
        const workers_list=await worker_model.find();
        res.status(200).json({
            status:1,
            wlist:workers_list
        })
    }
    catch{
        next(errorhandler(500,"Internal Server Error"));
    }

}
module.exports={w_signup,w_signin,show_workers}