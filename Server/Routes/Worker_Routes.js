const express=require("express");
const { w_signup,w_signin, show_workers, worker_info } = require("../Controllers/WorkerController");

const worker_route=express.Router();

worker_route.post("/signup",w_signup);
worker_route.post("/signin",w_signin);
worker_route.get("/workerlist",show_workers);
worker_route.get("/worker-data/:id",worker_info);

module.exports={worker_route};