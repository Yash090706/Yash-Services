const express=require("express");
const { signup, signin, verify_token, update_user, user_sign_out } = require("../Controllers/UserController");
const { hire_request } = require("../Controllers/ServiceControllers");


const user_route=express.Router();

user_route.post("/signup",signup);
user_route.post("/signin",signin);
user_route.put("/user-update/:id",verify_token,update_user);
user_route.get("/user-signout",user_sign_out)
// user_route.post("/hire_request/:userid/:workerid",hire_request);

module.exports={user_route}