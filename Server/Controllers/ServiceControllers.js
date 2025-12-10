const errorhandler = require("../Middleware/custom_error");
const { hire_model } = require("../Models/HireModel");
const { user_model } = require("../Models/UserModel");
const { worker_model } = require("../Models/WorkerModel");
const  clients = require("../index");
const jwt = require("jsonwebtoken");
const {notificationModel}=require("../Models/NotificationsModel");
const { messageModel } = require("../Models/MessageModel");
const search = async (req, res, next) => {
  const query = req.query.role || req.query.fullname || "";
  try {
    const search_obj = {
      $or: [
        { role: { $regex: query, $options: "i" } },
        { fullname: { $regex: query, $options: "i" } },
      ],
    };
    const w = await worker_model.find(search_obj);
    res.status(200).json({
      status: 1,
      data: w,
    });
  } catch (err) {
    return next(errorhandler(500, err.message));
  }
};
const hire_request = async (req, res, next) => {
  const {
    fullname,
    mobile,
    date,
    address,
    message,
    worker_name,
    role,
    experience,
    v_charges,
  } = req.body;
  const uid = req.params.userid;
  const wid = req.params.workerid;
  try {
    if (!uid) {
      return next(errorhandler(401, "Login Required"));
    }
    if (!wid) {
      return next(errorhandler(401, "Worker is not Active"));
    }
    const worker = await worker_model.findById(wid);
    if (!worker) {
      return next(errorhandler(400, "Invalid Worker"));
    }
    const user = await user_model.findById(uid);
    if (!user) {
      return next(errorhandler(400, "Invalid User"));
    }

    const c_date = new Date(date);
    const hire_req = hire_model({
      userid: uid,
      workerid: wid,
      fullname,
      worker_name,
      role,
      v_charges,
      experience,
      mobile,
      address,
      message,
      date: c_date,
    });
    await hire_req.save().then(() => {
      res.status(200).json({
        status: 1,
        msg: "Request Sent to Worker SuccessFully.",
      });
    });
  } catch (err) {
    return next(errorhandler(500, err.message));
  }
};
const verify_hire_token = (req, res, next) => {
  const token = req.cookies.worker_token;
  if (!token) {
    return next(errorhandler(401, "Access Denied,Sign in Again"));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, worker) => {
    if (err) {
      return next(errorhandler(402, "Token is not valid"));
    }
    req.worker = worker;
    next();
  });
};
const view_hire_request = async (req, res, next) => {
  const { wid } = req.params;
  if (req.worker.id != wid) {
    return next(errorhandler(400, "Bad Request"));
  }
  const req_info = await hire_model.find({ workerid: wid });

  res.status(200).json({
    status: 1,
    h_req_info: req_info,
  });
};
const verify_user_hire_token = (req, res, next) => {
  const token = req.cookies.user_token;
  if (!token) {
    return next(errorhandler(401, "Access Denied,Sign In Again."));
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorhandler(401, "Token Not Valid."));
    }
    req.user = user.id;
    next();
  });
};
const view_sended_request = async (req, res, next) => {
  const { uid } = req.params;
  if (!req.user.id == uid) {
    return next(errorhandler(402, "Bad Requests."));
  }

  const sended_req = await hire_model.find({ userid: uid });
  res.status(200).json({
    status: 1,
    sended_req_info: sended_req,
  });
};

const cancel_request = async (req, res, next) => {
  const { hid } = req.body;
  try {
    const can_req = await hire_model.deleteOne({ _id: hid });
    const nd=await notificationModel.deleteMany({hid})
    res.status(200).json({
      status: 1,
      msg: "Request Cancelled SuccessFully.",
      can_req,
    });
  } catch (err) {
    return next(errorhandler(500, err.message));
  }
};
const accept_request = async (req, res, next) => {
  try {
    const { hid, cid } = req.body;
    if (!cid || !hid) {
      return next(errorhandler(400, "Missing fields"));
    }

    const workerinfos=await hire_model.findOne({_id:hid})
    console.log("Current active WebSockets:", Object.keys(clients));
    const notification={
      cid,
      hid,
      message:"Request Accepted.",
      wname:workerinfos.worker_name,
      role:workerinfos.role
    }
    // Safely send WebSocket message
    if (clients[cid] && clients[cid].readyState === clients[cid].OPEN) {
      try {
        clients[cid].send(JSON.stringify(notification
        ));
        console.log("Sent WebSocket message to customer:", cid);
      } catch (err) {
        console.log("WebSocket send failed:", err.message);
      }
    } else {
      console.log("Customer not connected,Saving Message:", cid);
      await notificationModel.create(notification);
    }

    // Update hire request status
    const update = await hire_model.updateOne(
      { _id: hid },
      { $set: { status: "Accepted" } }
    );

    if (update.modifiedCount === 0) {
      return next(errorhandler(404, "Hire request not found"));
    }

    return res.status(200).json({
      status: 1,
      msg: "Request Accepted and Stored in Db.",
      update
    });

  } catch (err) {
    console.error("Accept request error:", err.message);
    return next(errorhandler(500, "Internal Server Error"));
  }
};
const fetch_notifications=async(req,res,next)=>{
  const{cid}=req.params;
  try{
    const notificationsinfo=await notificationModel.find({cid});
    await notificationModel.deleteMany({cid});
    res.status(200).json({
      status:1,
      message:"Pending Notifications.",
      notificationsinfo
    })
  }
  catch(err){
    return next(errorhandler(500,err.message))
  }
  

}
const worker_cancel_request=async(req,res,next)=>{
  const{hid}=req.body;
  
  try{
    const ninfo=await hire_model.findOne({
      _id:hid
    })
    const wname=ninfo.worker_name;
    const role=ninfo.role;
    const cid=ninfo.userid;
    const cancel=await hire_model.deleteOne({_id:hid});

    await notificationModel.create({cid,hid,message:"Request Cancelled",wname,role})
    res.status(200).json({
      status:1,
      msg:"Request Cancelled By Worker",
      cancel
    })
  }
  catch(err){
    return next(errorhandler(500,err.message))
  }
}
const old_messages=async(req,res,next)=>{
  try{
  const {roomId}=req.query;

  if(!roomId){
    return next(errorhandler(404,"Room Id not Found"))
  }
  const messages=await messageModel.find({roomId}).sort({createdAt:1})
// Oldest to newest
res.status(200).json({
  status:1,
  messages
})


  }
  catch(err){
    next(errorhandler(500,err.message))
  }

}
module.exports = {
  search,
  hire_request,
  verify_hire_token,
  view_hire_request,
  verify_user_hire_token,
  view_sended_request,
  cancel_request,
  accept_request,
  fetch_notifications,
  worker_cancel_request,
  old_messages
};
