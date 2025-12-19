const express=require("express");
const { verify_hire_token, view_hire_request, hire_request, verify_user_hire_token, view_sended_request, cancel_request, accept_request, fetch_notifications, worker_cancel_request, old_messages } = require("../Controllers/ServiceControllers");
const { journey, get_journey_address, sendEmail, sendOTpEmail, verify_otp, fetch_email } = require("../Controllers/JourneyControllers");
const { orderComplete, payment, send_pay_otp, verify_pay_otp, payment_done, get_past_orders, get_w_past_orders } = require("../Controllers/OrderController");

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
service_routes.post("/email",sendOTpEmail);
service_routes.post("/verify/:id",verify_otp);
service_routes.post("/fetch_email/:id",fetch_email)
service_routes.post("/bill-save",orderComplete)
service_routes.post("/user-payment",payment)
service_routes.post("/send/payment/OTP",send_pay_otp)
service_routes.post("/verify/payment/OTP",verify_pay_otp)
service_routes.post("/paymentdone",payment_done)
service_routes.post("/past-orders",get_past_orders)
service_routes.post("/w-past-orders",get_w_past_orders)

module.exports={service_routes}