import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate,Link} from "react-router-dom";
const SignUp = () => {
  const navigate = useNavigate();
  const [custdata, setcustdata] = useState({
    fullname: "",
    email: "",
    password: "",
    gender: "",
    mobile: "",
    UserType: "",
  });
  const [wdata, setwdata] = useState({
    role: "",
    experience: "",
    v_charges: "",
    w_address:""
  });
  const handleChange = (e) => {
    setcustdata({ ...custdata, [e.target.id]: e.target.value });
  };
  const handleWorker = (e) => {
    setwdata({ ...wdata, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (custdata.UserType === "Customer") {
      try {
        await axios
          .post("http://localhost:8000/yash-services/customer/signup", custdata)
          .then((res) => {
            console.log(res.data);
            setcustdata({
              fullname: "",
              email: "",
              password: "",
              gender: "",
              mobile: "",
              UserType: "",
            });
            // Response which got from signup from controller
            toast.success(res.data.message);
            setTimeout(() => {
              navigate("/");
            }, 1500);
          });
      } catch (err) {
        console.log(err);
        toast.error("User SignUp Failed");
      }
    }
    if (custdata.UserType === "Worker") {
      try {
        const final_w_data = { ...custdata, ...wdata };
        await axios
          .post(
            "http://localhost:8000/yash-services/worker/signup",
            final_w_data
          )
          .then((res) => {
            console.log(res.data);
            setwdata({
              role: "",
              experience: "",
              v_charges: "",
            });
            setcustdata({
              fullname: "",
              email: "",
              password: "",
              gender: "",
              mobile: "",
              UserType: "",
            });
            toast.success(res.data.message);
            setTimeout(() => {
              navigate("/");
            }, 1500);
          });
      } catch (err) {
        console.log(err);
        toast.error(" Worker Signup Failed.");
      }
    }
  };
  return (
    // <div className="bg-gray-50 w-[600px] h-[600px] shadow-[0_0_15px_rgba(0,0,0,0.15)] mx-auto rounded-4xl mt-11">
    <div className="min-w-screen min-h-screen">
      <div
        className={`bg-gray-50 w-[600px] border-2 mx-auto rounded-4xl shadow-[0_0_15px_rgba(0,0,0,0.15)] transition-all duration-300 
    ${custdata.UserType === "Worker" ? "h-[750px] mt-3" : "h-[600px] mt-11"}`}
      >
        <ToastContainer />
        <h1 className="font-semibold text-4xl text-center p-3">SIGN UP</h1>

        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* <label className="ml-3 font-semibold text-[18px]">Full Name:</label> */}
          <input
            type="text"
            className="w-full border rounded-lg p-3 text-center bg-white shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
            placeholder="Your Full Name"
            onChange={handleChange}
            id="fullname"
            value={custdata.fullname}
          ></input>
          {/* <label className="ml-3 font-semibold text-[18px]">Email:</label> */}
          <input
            type="email"
            className="w-full border rounded-lg p-3 text-center bg-white shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
            placeholder="Your Email"
            onChange={handleChange}
            id="email"
            value={custdata.email}
          ></input>
          <input
            type="password"
            className="w-full border rounded-lg p-3 text-center bg-white shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
            placeholder="Your Password"
            onChange={handleChange}
            id="password"
            value={custdata.password}
          ></input>
          <div className="flex gap-3 bg-white p-3 rounded-lg border justify-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]">
            <label className="ml-3 font-semibold text-[20px] ">Gender : </label>
            <h1 className="font-semibold text-[20px]">Male</h1>
            <input
              type="radio"
              name="gender"
              value="Male"
              onChange={handleChange}
              id="gender"
              checked={custdata.gender === "Male"}
            ></input>
            <h1 className="font-semibold text-[20px]">Female</h1>
            <input
              type="radio"
              name="gender"
              value="Female"
              onChange={handleChange}
              id="gender"
              checked={custdata.gender === "Female"}
            ></input>
          </div>
          <input
            type="text"
            className="w-full border rounded-lg p-3 text-center bg-white shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
            placeholder="Mobile Number"
            onChange={handleChange}
            id="mobile"
            value={custdata.mobile}
          ></input>

          <select
            className="bg-white p-3 rounded-lg border shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
            onChange={handleChange}
            id="UserType"
            value={custdata.UserType}
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
          <input
            type="text"
            placeholder="Your Role"
            id="role"
            value={wdata.role}
            onChange={handleWorker}
            className={`w-full border rounded-lg p-3 text-center bg-white shadow-[0_6px_10px_rgba(0,0,0,0.15)] transition-all duration-300 ${
              custdata.UserType === "Worker" ? "block" : "hidden"
            }`}
          ></input>
          <input
            type="number"
            placeholder="Visiting Charges"
            onChange={handleWorker}
            id="v_charges"
            value={wdata.v_charges}
            className={`w-full border rounded-lg p-3 text-center bg-white shadow-[0_6px_10px_rgba(0,0,0,0.15)] transition-all duration-300 ${
              custdata.UserType === "Worker" ? "block" : "hidden"
            }`}
          ></input>
          <input
            type="number"
            placeholder=" Work Experience"
            onChange={handleWorker}
            id="experience"
            value={wdata.experience}
            className={`w-full border rounded-lg p-3 text-center bg-white shadow-[0_6px_10px_rgba(0,0,0,0.15)] transition-all duration-300 ${
              custdata.UserType === "Worker" ? "block" : "hidden"
            }`}
          ></input>
           <input
   type="text"
   placeholder=" Address"
   onChange={handleWorker}
   id="w_address"
   value={wdata.w_address}
   className={`w-full border rounded-lg p-3 text-center bg-white shadow-[0_6px_10px_rgba(0,0,0,0.15)] transition-all duration-300 ${
     custdata.UserType === "Worker" ? "block" : "hidden"
   }`}
 ></input>

          <button className="bg-green-300 p-3 rounded-lg border font-semibold hover:cursor-pointer hover:opacity-75">
            SIGNUP
          </button>
        </form>
        <div className="ml-3 text-red-600 flex flex-row gap-2 font-semibold text-xl mt-5">
  <h2>Already Have an Account?</h2>
  <Link to="/signin">
    <h2 className="underline">Sign In</h2>
  </Link>
</div>
      </div>
      
    </div>
  );
};

export default SignUp;
// http://localhost:8000/yash-services/worker/signup
