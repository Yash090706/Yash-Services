import React from "react";
import userimg from "../assets/userimg.jpg";
import { useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { WUpdateFailed, WUpdateStart, WUpdateSuccess } from "../Redux/WorkerSlice";
import { ToastContainer,toast} from "react-toastify";
const WorkerProfile = () => {
  const { workerinfo } = useSelector((state) => state.worker);
  const [disabled, setdisabled] = useState(true);
  const [formdata, setformdata] = useState({
    fullname: workerinfo.fullname,
    mobile: workerinfo.mobile,
    email: workerinfo.email,
    role: workerinfo.role,
    experience: workerinfo.experience,
    v_charges: workerinfo.v_charges,
    password: "",
  });
  const dispatch=useDispatch();
  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled) {
      setdisabled(false);
    } else {
      try {
        dispatch(WUpdateStart());
        await axios
          .put(
            `http://localhost:8000/yash-services/worker/update-w/${workerinfo._id}`,
            formdata,
            { withCredentials: true }
          )
          .then((res) => {
            dispatch(WUpdateSuccess(res.data));
            console.log(res.data);
            toast.success("Worker Profile Updated SuccessFully.")
            setdisabled(true)
          })
          .catch((err) => {
            console.log(err);
            dispatch(WUpdateFailed(err))
            toast.error("Worker Profile Update Failed.")
            setdisabled(true)
          });
      } catch (err) {
        console.log(err);
        dispatch(WUpdateFailed(err))
        toast.error("Worker Profile Update Failed.")
        setdisabled(true)
      }
    }
  };
  useEffect(() => {
    setformdata({
      fullname: workerinfo.fullname,
      mobile: workerinfo.mobile,
      email: workerinfo.email,
      role: workerinfo.role,
      experience: workerinfo.experience,
      v_charges: workerinfo.v_charges,
      password: "",
    });
  },[workerinfo]);

  return (
    <div className="flex flex-row gap-20">
      <ToastContainer/>
      <div className="w-[600px] h-[600px] bg-gray-300  mt-9 rounded-3xl">
        <div className="border-10 border-gray-500 w-[400px] h-[300px] mx-auto text-center mt-7">
          <img
            src={userimg}
            alt="profile Image"
            className="w-full h-full"
          ></img>
        </div>
        <form className="mt-5 flex flex-col gap-5 font-mono p-3">
          <div className="flex flex-row gap-3">
            <label className="bg-gray-200 p-3 text-center ml-3 rounded-3xl w-[200px]">
              Full Name
            </label>
            <input
              type="text"
              value={formdata.fullname}
              className=" bg-gray-200 w-full p-3 rounded-4xl text-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
              disabled={disabled}
              id="fullname"
              onChange={handleChange}
            ></input>
          </div>
          <div className="flex flex-row gap-3">
            <label className="bg-gray-200 p-3 text-center ml-3 rounded-3xl w-[200px]">
              Mobile
            </label>
            <input
              type="text"
              value={formdata.mobile}
              disabled={disabled}
              id="mobile"
              onChange={handleChange}
              className=" bg-gray-200 w-full p-3 rounded-4xl text-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
            ></input>
          </div>
          <button
            type="submit"
            className="bg-gray-600 mx-auto p-3 rounded-4xl text-white w-[200px] hover:cursor-pointer hover:opacity-70"
            onClick={handleSubmit}
          >
            {disabled ? "Edit" : "Save"}
          </button>
        </form>
      </div>
      <div className="bg-gray-300 mt-9 mr-10 p-3  rounded-3xl w-[700px] h-[600px] font-mono flex flex-col gap-5">
        <div className="flex flex-row gap-3 mt-5">
          <label className="bg-gray-200 p-3 text-center ml-3 rounded-3xl w-[200px]">
            E-Mail
          </label>
          <input
            type="text"
            value={formdata.email}
            disabled={disabled}
            id="email"
            onChange={handleChange}
            className=" bg-gray-200 w-full p-3 rounded-4xl text-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
          ></input>
        </div>
        <div className="flex flex-row gap-3">
          <label className="bg-gray-200 p-3 text-center ml-3 rounded-3xl w-[200px]">
            Password
          </label>
          <input
            type="text"
            value={formdata.password}
            placeholder="Your Password"
            disabled={disabled}
            id="password"
            onChange={handleChange}
            className=" bg-gray-200 w-full p-3 rounded-4xl text-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
          ></input>
        </div>
        <div className="flex flex-row gap-3">
          <label className="bg-gray-200 p-3 text-center ml-3 rounded-3xl w-[200px]">
            Role
          </label>
          <input
            type="text"
            value={formdata.role}
            id="role"
            onChange={handleChange}
            disabled={disabled}
            className=" bg-gray-200 w-full p-3 rounded-4xl text-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
          ></input>
        </div>
        <div className="flex flex-row gap-3">
          <label className="bg-gray-200 p-3 text-center ml-3 rounded-3xl w-[200px]">
            Experience
          </label>
          <input
            type="number"
            id="experience"
            onChange={handleChange}
            value={formdata.experience}
            disabled={disabled}
            className=" bg-gray-200 w-full p-3 rounded-4xl text-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
          ></input>
        </div>
        <div className="flex flex-row gap-3">
          <label className="bg-gray-200 p-3 text-center ml-3 rounded-3xl w-[200px]">
            Visiting Charges
          </label>
          <input
            type="number"
            onChange={handleChange}
            value={formdata.v_charges}
            id="v_charges"
            disabled={disabled}
            className=" bg-gray-200 w-full p-3 rounded-4xl text-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
          ></input>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
