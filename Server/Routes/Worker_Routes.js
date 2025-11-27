const express=require("express");
const { w_signup,w_signin, show_workers, worker_info, verify_w_token, w_update, w_sign_out } = require("../Controllers/WorkerController");
const { search } = require("../Controllers/ServiceControllers");

const worker_route=express.Router();

worker_route.post("/signup",w_signup);
worker_route.post("/signin",w_signin);
worker_route.get("/workerlist",show_workers);
worker_route.get("/worker-data/:id",worker_info);
worker_route.put("/update-w/:wid",verify_w_token,w_update);
worker_route.get("/w-signout",w_sign_out);
worker_route.get("/search",search);

module.exports={worker_route};