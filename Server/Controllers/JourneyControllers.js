const errorhandler = require("../Middleware/custom_error");
// const express=require("express")
const { journey_model } = require("../Models/JourneyModel");

const redisClient = require("../Config/redis");
// const twilio=require("twilio")
const nodemailer = require("nodemailer");
const { user_model } = require("../Models/UserModel");
const { hire_model } = require("../Models/HireModel");

// const {server}=require("../index")
// const {WebSocketServer}=require("ws")
const journey = async (req, res, next) => {
  const { uid, wid, j_hid, u_add, w_add, status, date_time } = req.body;

  if (!uid || !wid || !j_hid) {
    return next(errorhandler(404, "Not Found"));
  }
  try {
    const journey_info = journey_model({
      uid,
      wid,
      j_hid,
      u_add,
      w_add,
      status,
      date_time,
    });
    await journey_info.save();

    res.status(200).json({
      status: 1,
      msg: " Journey Info Saved",
    });

    // await journey_info.deleteOne({j_hid:j_hid});
  } catch (err) {
    return next(errorhandler(500, err.message));
  }
};
const get_journey_address = async (req, res, next) => {
  const { rid } = req.params;
  if (!rid) {
    return next(errorhandler(404, "Not Found"));
  }
  const address_info = await journey_model.findOne({ j_hid: rid });

  res.status(200).json({
    status: 1,
    address_info,
  });
};
// const twilio_client=twilio(
// process.env.TWILIO_ACCOUNT_SID,
// process.env.TWILIO_AUTHTOKEN
// )

// const sendOtp=async(req,res,next)=>{
// const{email}=req.body
//
// if(!email){
// return(next(errorhandler(404,"Not Found")))
// }
//
// const otp=Math.floor(100000+Math.random()*90000)
// try{
// await redisClient.set(`otp:${mobile},otp,{EX:90}`)
// }
// catch(err){
// return next(errorhandler(500,err.message))
//
// }
//
// }

const sendOTpEmail = async (req, res, next) => {
  // First Connect with smtp server
  // Create test accouunt if you dont have real email
  try {
    const { email } = req.body;
    if (!email) {
      return next(errorhandler(404, "Email Not Found"));
    }
    const otp = Math.floor(100000 + Math.random() * 90000);
    // Store OTP IN REDIS
    await redisClient.set(`otp:${email}`, otp.toString(), { EX: 90 });
    // Create test account
    // const testaccount = await nodemailer.createTestAccount();
    // Create smtp server
    const transporter = await nodemailer.createTransport({
      service:"gmail",
      auth: {
        user: process.env.EMAIL_URL,
        pass: process.env.APP_PASSWORD,
      },
    });

    const message = await transporter.sendMail({
      from: `"Yash Services" <${process.env.EMAIL_URL}>`,
      to: email,
      subject: "Hello otp",
      text: "Hello world?", // plain‑text body
      html: `<h2>Your OTP is ${otp}</h2><p>Valid for 90 seconds</p>`, // HTML body
    });
    res.status(200).json({ status: 1,msg:"OTP Sent to Mail",previewURL:nodemailer.getTestMessageUrl(message) });
  } catch (err) {
    return next(errorhandler(500, err.message));
  }
};
const verify_otp=async(req,res,next)=>{
    const{otp,email}=req.body;
    const{id}=req.params;
    try{
        if(!otp || !email){
            return next(errorhandler(404,"OTP IS REQUIRED"))
        }
        const savedOtp=await redisClient.get(`otp:${email}`)

        if(!savedOtp){
            return next(errorhandler(400,"OTP IS EXPIRED"))
        }

        if(savedOtp!==otp){
            return next(errorhandler(400,"OTP IS INVALID"))
        }
        if(!id){
            return next(errorhandler(400,"Process Failed,Try Again Later"))

        }

        await redisClient.del(`otp:${email}`)
        

       const up= await hire_model.findByIdAndUpdate({_id:id},{status:"Completed"})

        res.status(200).json({
            status:1,
            msg:"OTP VERIFIED SUCCESSFULLY.",
            up
        })



    }
    catch(err){
        return next(errorhandler(500,err.message))
    }
}
const fetch_email=async(req,res,next)=>{
    const{id}=req.params

    if(!id){
        return(next(errorhandler(404,"Id Not found")))
    }
    try{
        const email_info=await user_model.findOne({_id:id})
        res.status(200).json({
            status:1,
            email_info
        })
    }
    catch(err){
        return next(errorhandler(500,err.message))
    }

}
module.exports = { journey, get_journey_address, sendOTpEmail,verify_otp,fetch_email};
