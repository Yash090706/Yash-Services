const express=require("express");
const { w_signup } = require("../Controllers/WorkerController");

const worker_route=express.Router();

worker_route.post("/signup",w_signup)

module.exports={worker_route};