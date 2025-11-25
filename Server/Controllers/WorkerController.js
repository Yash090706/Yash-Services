const bcryptjs = require("bcryptjs");
const { worker_model } = require("../Models/WorkerModel");
const errorhandler = require("../Middleware/custom_error");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const w_signup = async (req, res, next) => {
  const {
    fullname,
    email,
    password,
    mobile,
    gender,
    UserType,
    experience,
    role,
    v_charges,
  } = req.body;
  const w_hashed_password = bcryptjs.hashSync(password, 10);
  try {
    const w_info = worker_model({
      fullname,
      email,
      password: w_hashed_password,
      mobile,
      gender,
      UserType,
      experience,
      role,
      v_charges,
    });
    await w_info.save().then(() => {
      res.status(200).json({
        message: "Worker Signed up SuccessFully.",
      });
    });
  } catch {
    next(errorhandler(500, "Signed Up Failed."));
  }
};
const w_signin = async (req, res, next) => {
  try {
    const { email, password, UserType } = req.body;

    const validate_worker = await worker_model.findOne({ email: email });

    if (!validate_worker) {
      return next(errorhandler(404, "User Not Found"));
    }
    if (!bcryptjs.compareSync(password, validate_worker.password)) {
      return next(errorhandler(401, "Wrong Credentials"));
    }
    if (UserType != validate_worker.UserType) {
      return next(errorhandler(400, "Bad Request"));
    }
    // Should not send password in response so filtering it;
    const { password: w_hashed_password, ...others } = validate_worker._doc;
    // We will send token in Cookies.
    const token = jwt.sign(
      { id: validate_worker._id },
      process.env.JWT_SECRET_KEY
    );
    const token_expiry = new Date(Date.now() + 60 * 60 * 1000);

    // Send the created token in cookie on browser
    res
      .cookie("worker_token", token, { httpOnly: true, expires: token_expiry })
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};
const show_workers = async (req, res, next) => {
  try {
    const workers_list = await worker_model.find();

    const safeworkers = workers_list.map((worker) => {
      const { password, ...restinfo } = worker._doc;
      return restinfo;
    });
    res.status(200).json({
      status: 1,
      wlist: safeworkers,
    });
  } catch {
    next(errorhandler(500, "Internal Server Error"));
  }
};
const worker_info = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorhandler(404, "Invalid Worker Id."));
    }
    const worker_individual_info = await worker_model.findOne({ _id: id });
    if (!worker_individual_info) {
      return next(errorhandler(404, "User Not Found."));
    }
    const { password: w_hashed_password, ...restinfo } =
      worker_individual_info._doc;
    res.status(200).json({
      status: 1,
      worker_data: restinfo,
    });
  } catch {
    next(errorhandler(500, "Internal Server Error"));
  }
};
const verify_w_token = (req, res, next) => {
  const token = req.cookies.worker_token;
  if (!token) {
    return next(errorhandler(401, "Access Denied"));
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, worker) => {
    if (err) {
      return next(errorhandler(402, "Token Not Valid."));
    }
    req.worker = worker;
    next();
  });
};
const w_update = async (req, res, next) => {
  const { wid } = req.params;
  if (req.worker.id != wid) {
    return next(errorhandler(401, "You can Update only your account."));
  }
  try {
    const w_update_data = {};
    if (req.body.fullname) {
      w_update_data.fullname = req.body.fullname;
    }
    if (req.body.email) {
      w_update_data.email = req.body.email;
    }
    if (req.body.password) {
      const hash_u_password = bcryptjs.hashSync(req.body.password, 10);
      w_update_data.password = hash_u_password;
    }
    if (req.body.role) {
      w_update_data.role = req.body.role;
    }
    if (req.body.experience) {
      w_update_data.experience = req.body.experience;
    }
    if (req.body.v_charges) {
      w_update_data.v_charges = req.body.v_charges;
    }
    if (req.body.mobile) {
      w_update_data.mobile = req.body.mobile;
    }
    const worker_update = await worker_model.findByIdAndUpdate(
      wid,
      w_update_data,
      { new: true }
    );

    const { password: whpass, ...restinfo } = worker_update._doc;
    res.status(200).json(restinfo);
  } catch (err) {
    return next(errorhandler(500, "Internal Server Error."));
  }
};
module.exports = {
  w_signup,
  w_signin,
  show_workers,
  worker_info,
  verify_w_token,
  w_update,
};
