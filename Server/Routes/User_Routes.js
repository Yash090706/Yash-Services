const express=require("express");
const { signup, signin } = require("../Controllers/UserController");


const user_route=express.Router();

user_route.post("/signup",signup);
user_route.post("/signin",signin);

module.exports={user_route}