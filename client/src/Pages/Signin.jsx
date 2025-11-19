// import React from "react";
import axios from "axios";
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { SignInFailed, SignInStart, SignInSuccess } from "../Redux/WorkerSlice";
const Signin = () => {
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [signindata, setsignindata] = useState({
    email: "",
    password: "",
    UserType: "",
  });
  const handleChange = (e) => {
    setsignindata({ ...signindata, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(SignInStart());
      await axios
        .post("http://localhost:8000/yash-services/worker/signin", signindata)
        .then((res) => {
          console.log(res.data);
          dispatch(SignInSuccess(res.data));
          setsignindata({
            email: "",
            password: "",
            UserType: "",
          });
          toast.success("Worker Signed In SuccessFully.");
          setTimeout(()=>{
            navigate("/")
           
          },1500)
        });
    } catch (err) {
      toast.error("Signin Failed! "+err)
      dispatch(SignInFailed(err));
      console.log(err);
    }
  };
  return (
    <div className="min-h-screen">
    <div className="bg-gray-50 w-[600px] h-[500px] mx-auto mt-11 rounded-4xl border-2 shadow-[0_0_15px_rgba(0,0,0,0.15)] transition-all duration-300 ">
      <h1 className="text-center p-3 font-semibold text-5xl">Sign in </h1>
      <form className="flex flex-col gap-7 mt-10" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={signindata.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border text-center bg-white shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={signindata.password}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border text-center bg-white shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
        />
        <select
          className="bg-white p-3 rounded-lg border shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
          onChange={handleChange}
          id="UserType"
          value={signindata.UserType}
        >
          <option className="text-center bg-gray-200 font-semibold">
            Select Type:
          </option>
          <option className="text-center bg-gray-200 font-semibold">
            Worker
          </option>
          <option className="text-center font-semibold bg-gray-200">
            Customer
          </option>
        </select>
        <button className="bg-green-300 p-3 rounded-lg border font-semibold hover:cursor-pointer hover:opacity-75">
          SIGNIN
        </button>
      </form>
    </div>
    </div>
  );
};

export default Signin;
