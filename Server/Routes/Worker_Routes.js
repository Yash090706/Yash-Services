const express=require("express");
const { w_signup,w_signin } = require("../Controllers/WorkerController");

const worker_route=express.Router();

worker_route.post("/signup",w_signup);
worker_route.post("/signin",w_signin);

module.exports={worker_route};