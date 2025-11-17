const express=require("express");
const { signup } = require("../Controllers/UserController");

const user_route=express.Router();

user_route.post("/signup",signup);

module.exports={user_route}