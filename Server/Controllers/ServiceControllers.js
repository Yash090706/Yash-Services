const errorhandler = require("../Middleware/custom_error");
const { worker_model } = require("../Models/WorkerModel");
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
module.exports={search}