const express=require("express");
const { verify_hire_token, view_hire_request, hire_request } = require("../Controllers/ServiceControllers");

const service_routes=express.Router();
service_routes.post("/hire_request/:userid/:workerid",hire_request);
service_routes.get("/get-hire-req/:wid",verify_hire_token,view_hire_request)

module.exports={service_routes}