const errorhandler = require("../Middleware/custom_error");
const { hire_model } = require("../Models/HireModel");
const { user_model } = require("../Models/UserModel");
const { worker_model } = require("../Models/WorkerModel");
const jwt=require("jsonwebtoken")
const search=async(req,res,next)=>{
    const query=req.query.role || req.query.fullname||""
    try{
        const search_obj={
            $or:[
                {role:{$regex:query,$options:"i"}},
            {fullname:{$regex:query,$options:"i"}}
            ]
        }
    const w= await worker_model.find(search_obj);
    res.status(200).json({
        status:1,
        data:w
    })
    }
    catch(err){
        return next(errorhandler(500,err.message));
    }
}
const hire_request=async(req,res,next)=>{
    const{fullname,mobile,date,address,message}=req.body
     const uid=req.params.userid
 const wid=req.params.workerid
 try{

    if(!uid){
        return next(errorhandler(401,"Login Required"))
    }
    if(!wid){
        return next(errorhandler(401,"Worker is not Active"))
    }
    const worker=await worker_model.findById(wid)
    if(!worker){
        return next(errorhandler(400,"Invalid Worker"))
    }
    const user=await user_model.findById(uid)
    if(!user){
        return next(errorhandler(400,"Invalid User"))

    }


    const c_date=new Date(date)
    const hire_req=hire_model({
        userid:uid,workerid:wid,fullname,mobile,address,message,date:c_date
    })
    await hire_req.save().then(()=>{
        res.status(200).json({
            status:1,
            msg:"Request Sent to Worker SuccessFully."
        })
    })
}
catch(err){
    return next(errorhandler(500,err.message));

}
    
}
const verify_hire_token=(req,res,next)=>{
     const token=req.cookies.worker_token
 if(!token){
     return next(errorhandler(401,"Access Denied,Sign in Again"))
 }

    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,worker)=>{
        if(err){
            return(next(errorhandler(402,"Token is not valid")))
        }
        req.worker=worker;
        next();
    })

}
const view_hire_request=async (req,res,next)=>{
    const {wid}=req.params
    if(req.worker.id!=wid){
        return next(errorhandler(400,"Bad Request"))
    }
    const req_info= await hire_model.find({workerid:wid})

    res.status(200).json({
        status:1,
        h_req_info:req_info
    })

}
module.exports={search,hire_request,verify_hire_token,view_hire_request}