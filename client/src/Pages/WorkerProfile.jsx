import React from "react";
import userimg from "../assets/userimg.jpg";
import { useSelector } from "react-redux";
import { useState } from "react";
const WorkerProfile = () => {
  const { workerinfo } = useSelector((state) => state.worker);
  const [disabled, setdisabled] = useState(true);
  const handle_disable=(e)=>{
    e.preventDefault();
    setdisabled(!disabled)

  }
  return (
    <div className="flex flex-row gap-25">
      <div className="w-[600px] h-[600px] bg-gray-300 ml-9 mt-9 rounded-3xl">
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
              value={workerinfo.fullname}
              className=" bg-gray-200 w-full p-3 rounded-4xl text-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
              disabled={disabled}
            ></input>
          </div>
          <div className="flex flex-row gap-3">
            <label className="bg-gray-200 p-3 text-center ml-3 rounded-3xl w-[200px]">
              Mobile
            </label>
            <input
              type="text"
              value={workerinfo.mobile}
              disabled={disabled}
              className=" bg-gray-200 w-full p-3 rounded-4xl text-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
            ></input>
          </div>
          <button
            className="bg-gray-600 mx-auto p-3 rounded-4xl text-white w-[200px] hover:cursor-pointer hover:opacity-70"
            onClick={handle_disable}
          >
            {disabled ? "Edit" : "Save"}
          </button>
        </form>
      </div>
      <div className="bg-gray-300 mt-9 p-3  rounded-3xl w-[700px] h-[600px] font-mono flex flex-col gap-5">
        <div className="flex flex-row gap-3 mt-5">
          <label className="bg-gray-200 p-3 text-center ml-3 rounded-3xl w-[200px]">
            E-Mail
          </label>
          <input
            type="text"
            value={workerinfo.email}
            disabled={disabled}
            className=" bg-gray-200 w-full p-3 rounded-4xl text-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
          ></input>
        </div>
        <div className="flex flex-row gap-3">
          <label className="bg-gray-200 p-3 text-center ml-3 rounded-3xl w-[200px]">
            Role
          </label>
          <input
            type="text"
            value={workerinfo.role}
            disabled={disabled}
            className=" bg-gray-200 w-full p-3 rounded-4xl text-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
          ></input>
        </div>
        <div className="flex flex-row gap-3">
          <label className="bg-gray-200 p-3 text-center ml-3 rounded-3xl w-[200px]">
            Experience
          </label>
          <input
            type="text"
            value={workerinfo.experience}
            disabled={disabled}
            className=" bg-gray-200 w-full p-3 rounded-4xl text-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
          ></input>
        </div>
        <div className="flex flex-row gap-3">
          <label className="bg-gray-200 p-3 text-center ml-3 rounded-3xl w-[200px]">
            Visiting Charges
          </label>
          <input
            type="text"
            value={workerinfo.v_charges}
            disabled={disabled}
            className=" bg-gray-200 w-full p-3 rounded-4xl text-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
          ></input>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
