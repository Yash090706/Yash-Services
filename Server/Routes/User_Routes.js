const express=require("express");
const { signup, signin, verify_token, update_user } = require("../Controllers/UserController");


const user_route=express.Router();

user_route.post("/signup",signup);
user_route.post("/signin",signin);
user_route.put("/user-update/:id",verify_token,update_user)

module.exports={user_route}