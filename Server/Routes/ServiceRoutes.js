const express=require("express");
const { verify_hire_token, view_hire_request, hire_request, verify_user_hire_token, view_sended_request, cancel_request, accept_request, fetch_notifications, worker_cancel_request, old_messages } = require("../Controllers/ServiceControllers");
const { journey, get_journey_address } = require("../Controllers/JourneyControllers");

const service_routes=express.Router();
service_routes.post("/hire_request/:userid/:workerid",hire_request);
service_routes.get("/get-hire-req/:wid",verify_hire_token,view_hire_request);
service_routes.get("/view-sended-req/:uid",verify_user_hire_token,view_sended_request)
service_routes.post("/cancel-req",verify_user_hire_token,cancel_request);
service_routes.post("/accept-request",accept_request);
service_routes.get("/notifications/:cid",fetch_notifications);
service_routes.post("/worker-cancel-req",worker_cancel_request);
service_routes.get("/messages/history",old_messages);
service_routes.post("/journey",journey),
service_routes.get("/j-address/:rid",get_journey_address);
module.exports={service_routes}