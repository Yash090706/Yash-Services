import React, { useState } from "react";
import { useSelector } from "react-redux";
import userimg from "../assets/userimg.jpg";
const UserProfile = () => {
  const { userinfo } = useSelector((state) => state.user);
  const [disabled, setDisabled] = useState(true);
  return (
    <div>
      <div className="mx-auto bg-blue-200 min-h-[620px] w-[900px] mt-5 rounded-4xl p-2 ">
        <h1 className="text-center p-5 font-serif text-3xl">My Profile</h1>
        <form className=" flex flex-col gap-7 mt-2">
          <div className="mx-auto">
            <img src={userimg} className="w-[100px] h-[100px] rounded-4xl"></img>
          </div>
          <div className="flex flex-row gap-3">
            <label className="text-center w-[200px] p-3 bg-blue-100 ml-2 rounded-lg text-xl font-mono">
              Full Name:
            </label>
            <input
              type="text"
              disabled={disabled}
              className="p-3 bg-blue-100 rounded-4xl shadow-[0_6px_10px_rgba(0,0,0,0.15)] w-full font-mono text-center text-xl"
              value={userinfo.others.fullname}
            ></input>
          </div>
          <div className="flex flex-row gap-3">
            <label className="text-center w-[200px] p-3 bg-blue-100 ml-2 rounded-lg text-xl font-mono">
              E-Mail:
            </label>
            <input
              type="email"
              disabled={disabled}
              className="p-3 bg-blue-100 rounded-4xl shadow-[0_6px_10px_rgba(0,0,0,0.15)] w-full font-mono text-center text-xl"
              value={userinfo.others.email}
            ></input>
          </div>
          <div className="flex flex-row gap-3">
            <label className="text-center w-[200px] p-3 bg-blue-100 ml-2 rounded-lg text-xl font-mono">
              Password:
            </label>
            <input
              type="text"
              disabled={disabled}
              className="p-3 bg-blue-100 rounded-4xl shadow-[0_6px_10px_rgba(0,0,0,0.15)] w-full font-mono text-center text-xl"
              value="Your Password"
            ></input>
          </div>
          <div className="flex flex-row gap-3">
            <label className="text-center w-[200px] p-3 bg-blue-100 ml-2 rounded-lg text-xl font-mono">
              Mobile:
            </label>
            <input
              type="text"
              disabled={disabled}
              className="p-3 bg-blue-100 rounded-4xl shadow-[0_6px_10px_rgba(0,0,0,0.15)] w-full font-mono text-center text-xl"
              value={userinfo.others.mobile}
            ></input>
          </div>
          <button onClick={(e)=>{
          e.preventDefault()
            setDisabled(!disabled)
          }} className=" p-3 rounded-4xl text-xl font-serif w-[200px] mx-auto bg-blue-400 text-white hover:cursor-pointer hover:opacity-70 border-blue-700">
            {disabled ? "Edit ":"Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
