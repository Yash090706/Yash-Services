const express=require("express");
const { w_signup,w_signin, show_workers } = require("../Controllers/WorkerController");

const worker_route=express.Router();

worker_route.post("/signup",w_signup);
worker_route.post("/signin",w_signin);
worker_route.get("/workerlist",show_workers);

module.exports={worker_route};