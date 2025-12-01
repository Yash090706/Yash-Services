const express=require("express");
const { verify_hire_token, view_hire_request, hire_request, verify_user_hire_token, view_sended_request, cancel_request } = require("../Controllers/ServiceControllers");

const service_routes=express.Router();
service_routes.post("/hire_request/:userid/:workerid",hire_request);
service_routes.get("/get-hire-req/:wid",verify_hire_token,view_hire_request);
service_routes.get("/view-sended-req/:uid",verify_user_hire_token,view_sended_request)
service_routes.post("/cancel-req",verify_user_hire_token,cancel_request)

module.exports={service_routes}