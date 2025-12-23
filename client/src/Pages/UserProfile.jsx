import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userimg from "../assets/userimg.jpg";
import axios from "axios";
import { USignOut, UUpdateSuccess } from "../Redux/UserSlice";
import {toast,ToastContainer} from "react-toastify"
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
axios.defaults.withCredentials = true;
const UserProfile = () => {
  const navigate=useNavigate();
  const { userinfo } = useSelector((state) => state.user);
  const [disabled,setDisabled]=useState(true);
  const dispatch=useDispatch();
  // const [disabled, setDisabled] = useState(false);
  const[updated_data,set_updated_data]=useState({
    fullname:userinfo.others.fullname,
    email:userinfo.others.email,
    mobile:userinfo.others.mobile,
    password:""
  })
  const handleChange=(e)=>{
    set_updated_data({...updated_data,[e.target.id]:e.target.value})
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(disabled){
      setDisabled(false)
    }
    else{
    const url=`/yash-services/customer/user-update/${userinfo.others._id}`
    await API.put(url,updated_data, { withCredentials: true }).then((res)=>{
      console.log(res.data)
      dispatch(UUpdateSuccess(res.data))
      toast.success("User Updated SuccessFuly.")
      setDisabled(true)

    }).catch((err)=>{
      console.log(err)
      toast.error("User Update Failed.")
      setDisabled(true)
    })


  }
}
const handleSignOut=async(e)=>{
  e.preventDefault();
  try{
  await API.get("/yash-services/customer/user-signout")
  dispatch(USignOut());
  toast.success("User Signed Out Successfully.")
  setTimeout(()=>{
    navigate("/signin")
  },8000)
  
  }
  catch(err){
    console.log(err)
    toast.error("User Signed Out Failed.")
  }

}
  useEffect(()=>{
    set_updated_data({
      fullname:userinfo.others.fullname,
      email:userinfo.others.email ,
      mobile:userinfo.others.mobile,
      password:""
    })
  },[userinfo])
  return (
    <div>
      <ToastContainer/>
      <div className="mx-auto bg-gray-300 min-h-[500px] w-[900px] mt-5 rounded-4xl p-2">
        <h1 className="text-center p-5 font-serif text-3xl">My Profile</h1>
        <form className=" flex flex-col gap-7 p-3" onSubmit={handleSubmit}>
          <div className="mx-auto">
            <img src={userimg} className="w-[120px] h-[120px] rounded-4xl border-4 border-gray-800"></img>
          </div>
          <div className="flex flex-row gap-3">
            <label className="text-center w-[200px] p-3 bg-gray-200 ml-2 rounded-lg text-xl font-mono">
              Full Name:
            </label>
            <input
              type="text"
              disabled={disabled}
              className="p-3 bg-gray-200 rounded-4xl shadow-[0_6px_10px_rgba(0,0,0,0.15)] w-full font-mono text-center text-xl"
              value={updated_data.fullname}
              onChange={handleChange}
              id="fullname"
            ></input>
          </div>
          <div className="flex flex-row gap-3">
            <label className="text-center w-[200px] p-3 bg-gray-200 ml-2 rounded-lg text-xl font-mono">
              E-Mail:
            </label>
            <input
              type="email"
              disabled={disabled}
              className="p-3 bg-gray-200 rounded-4xl shadow-[0_6px_10px_rgba(0,0,0,0.15)] w-full font-mono text-center text-xl"
              value={updated_data.email}
              onChange={handleChange}
              id="email"
            ></input>
          </div>
          <div className="flex flex-row gap-3">
            <label className="text-center w-[200px] p-3 bg-gray-200 ml-2 rounded-lg text-xl font-mono">
              Password:
            </label>
            <input
              type="text"
              disabled={disabled}
              className="p-3 bg-gray-200 rounded-4xl shadow-[0_6px_10px_rgba(0,0,0,0.15)] w-full font-mono text-center text-xl"
              value={updated_data.password}
              placeholder="Your Password"
              onChange={handleChange}
              id="password"
            ></input>
          </div>
          <div className="flex flex-row gap-3">
            <label className="text-center w-[200px] p-3 bg-gray-200 ml-2 rounded-lg text-xl font-mono">
              Mobile:
            </label>
            <input
              type="text"
              disabled={disabled}
              className="p-3 bg-gray-200 rounded-4xl shadow-[0_6px_10px_rgba(0,0,0,0.15)] w-full font-mono text-center text-xl"
              value={updated_data.mobile}
              onChange={handleChange}
              id="mobile"
            ></input>
          </div>
          <div className="flex flex-row justify-center gap-5">
          <button type="submit" className=" p-3 rounded-4xl text-xl font-mono w-[200px] bg-gray-700 text-white hover:cursor-pointer hover:opacity-70 border-blue-700">
            {disabled ? "Edit ":"Save"} 
          </button>
          <button type=" button" className="p-3 bg-red-500 rounded-4xl w-[200px]  text-white shadow-[0_6px_10px_rgba(0,0,0,0.15) font-mono text-xl" onClick={handleSignOut} >Sign Out</button>
          </div>
          {/* <button type=" button" className=" bg-red-500 rounded-4xl w-[200px]  text-white shadow-[0_6px_10px_rgba(0,0,0,0.15) font-mono" >Sign Out</button> */}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;  