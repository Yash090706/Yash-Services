const redisClient = require("../Config/redis");
const errorhandler = require("../Middleware/custom_error");
const { hire_model } = require("../Models/HireModel");
const { orderModel } = require("../Models/OrderCompleteModel");
const nodemailer = require("nodemailer");
const { worker_model } = require("../Models/WorkerModel");
// const { hire_request } = require("./ServiceControllers");
const orderComplete = async (req, res, next) => {
  const { uid, wid, hid, uname, wname, date, details, total } = req.body;

  if (!uid || !wid || !hid || !uname || !wname || !date || !details || !total) {
    return next(errorhandler(404, "Required"));
  }
  if (details.length == 0) {
    return next(errorhandler(404, "Required"));
  }
  try {
    const new_order = new orderModel({
      uid,
      wid,
      hid,
      uname,
      wname,
      date,
      details,
      total,
    });

    const save_order = await new_order.save();

    res.status(200).json({
      status: 1,
      msg: "Bill Saved Successfully",
      data: save_order,
    });
  } catch (err) {
    return next(errorhandler(500, err.message));
  }
};
const payment = async (req, res, next) => {
  const { hid } = req.body;
  try {
    if (!hid) {
      return next(errorhandler(404, "Not Found"));
    }
    const get_payment_info = await orderModel.findOne({ hid: hid });
    res.status(200).json({
      status: 1,
      get_payment_info,
    });
  } catch (err) {
    return next(errorhandler(500, err.message));
  }
};
const send_pay_otp = async (req, res, next) => {
  const { email, billno } = req.body;
  if (!email || !billno) {
    return next(errorhandler(404, "Not Found"));
  }
  const validbill = await orderModel.findOne({ billno });
  if (!validbill) {
    return next(errorhandler(400, "Bad Request"));
  }
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    await redisClient.set(`otp:${email}`, otp.toString(), { EX: 120 });
    const testaccount = await nodemailer.createTestAccount();
    // Create smtp server
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user:process.env.EMAIL_URL ,
        pass: process.env.APP_PASSWORD,
      },
    });
    const message = await transporter.sendMail({
      from: `"Yash Services" <${process.env.EMAIL_URL}>`,
      to: email,
      subject: "Hello otp",
      text: "Hello world?", // plain‑text body
      html: `<h2>Your OTP is ${otp}</h2><p>Valid for 120 seconds</p>`, // HTML body
    });
    res
      .status(200)
      .json({
        status: 1,
        msg: "OTP Sent to Mail",
        previewURL: nodemailer.getTestMessageUrl(message),
      });
  } catch (err) {
    return next(errorhandler(500, err.message));
  }
};
const verify_pay_otp = async (req, res, next) => {
  const { otp, email } = req.body;
  if (!otp) {
    return next(errorhandler(404, "Not Found"));
  }
  if (!email) {
    return next(errorhandler(404, "Not Found"));
  }
  const saved_otp = await redisClient.get(`otp:${email}`);
  if (!saved_otp) {
    return next(errorhandler(400, "Otp Expired or Not Found"));
  }
  if (saved_otp != otp) {
    return next(errorhandler(400, "InValid Otp"));
  }
  await redisClient.del(`otp:${email}`);
  res.status(200).json({
    status: 1,
    msg: "Otp Verified SuccessFully.",
  });
};
const payment_done = async (req, res, next) => {
  const { pay_status, pay_mode, rid } = req.body;

  try {
    if (!pay_status || !pay_mode || !rid) {
      return next(errorhandler(404, "Not Found"));
    }
    const up_pay = await orderModel.findOneAndUpdate(
      { hid: rid },
      {
        $set: {
          pay_status,
          pay_mode,
          paid_at: new Date(),
        },
      },
      {
        new: true,
        upsert: false, // explicit
      }
    );
    await hire_model.deleteOne({ _id: rid });
    console.log(up_pay);
    res.status(200).json({
      up_pay,
    });
  } catch (err) {
    return next(errorhandler(500, err.message));
  }
};

const get_past_orders = async (req, res, next) => {
  const { uid } = req.body;
  try {
    if (!uid) {
      return next(errorhandler(404, "Not Found"));
    }
    const info = await orderModel.find({ uid: uid, pay_status: "Done" });
    res.status(200).json({
      status: 1,
      info,
    });
  } catch (err) {
    return next(errorhandler(500, err.message));
  }
};
const get_w_past_orders = async (req, res, next) => {
  const { wid } = req.body;
  try {
    if (!wid) {
      return next(errorhandler(404, "Not Found"));
    }
    const info = await orderModel.find({ wid: wid, pay_status: "Done" });
    res.status(200).json({
      status: 1,
      info,
    });
  } catch (err) {
    return next(errorhandler(500, err.message));
  }
};
const feedback = async (req, res, next) => {
  const { msg, wid, uname, date } = req.body;
  if (!wid || !feedback) {
    return next(errorhandler(404, "Not Found"));
  }
  if (!date || !uname) {
    return next(errorhandler(404, "Not Found"));
  }
  try {
    const update_feedback = await worker_model.findByIdAndUpdate(
      { _id: wid },
      { $push: { feedbacks:{ msg,
            uname,
            date: new Date()
        } } },
      { new: true, upsert: false }
    );
    res.status(200).json({
      status: 1,
      update_feedback,
      msg: "Feedback Submitted",
    });
  } catch (err) {
    return next(errorhandler(500, err.message));
  }
};
module.exports = {
  orderComplete,
  payment,
  send_pay_otp,
  verify_pay_otp,
  payment_done,
  get_past_orders,
  get_w_past_orders,
  feedback,
};
