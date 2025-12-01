import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const UserRequests = () => {
  const {userinfo}=useSelector((state)=>state.user)
  const navigate=useNavigate();
  const [sended_req,setsended_req]=useState([])
  useEffect(()=>{
    if(!userinfo){
      navigate("/signin")
      
    }
    const fetch_sended_req=async()=>{
      try{
      await axios.get(`http://localhost:8000/yash-services/services/view-sended-req/${userinfo.others._id}`).then((res)=>{
        console.log(res.data)
        setsended_req(res.data.sended_req_info)

      })
      }
      catch(err){
        console.log(err)

      }

    }
    fetch_sended_req();

  },[userinfo])

  return (
    <div className="p-10">
      <div className='bg-green-200 w-[1200px] mx-auto rounded-3xl flex flex-col gap-4 p-4'>
        <h1 className="font-mono text-3xl text-center p-4">Your Requests</h1>
        {
          sended_req.length > 0 ?(
            sended_req.map((info,index)=>(
               <div className="bg-green-300 w-[1000px] mx-auto p-6 rounded-2xl flex flex-row gap-3 font-mono text-xl" id={index}>
     <div className="flex flex-row gap-30 justify-between mx-auto">
     <h1>{info.fullname}</h1>
     <h1>{info.worker_name}</h1>
     <h1>{info.date}</h1>
     </div>
     <button className="bg-blue-400 p-3 rounded-4xl text-white hover:cursor-pointer hover:opacity-70">View More</button>
     <button className="bg-red-500 p-3 rounded-4xl text-white hover:cursor-pointer hover:opacity-70">Cancel</button>
 </div>

            ))
          ):(
            <div className="mx-auto text-3xl font-mono text-red-500"> No Requests</div>
          )
        }
        {/* // <div className="bg-green-300 w-[1000px] mx-auto p-6 rounded-2xl flex flex-row gap-3 font-mono text-xl"> */}
            {/* <div className="flex flex-row gap-30 justify-between mx-auto"> */}
            {/* <h1>Name</h1> */}
            {/* <h1>Role</h1> */}
            {/* <h1>Date</h1> */}
            {/* </div> */}
            {/* <button className="bg-blue-400 p-3 rounded-4xl text-white hover:cursor-pointer hover:opacity-70">View More</button> */}
            {/* <button className="bg-red-500 p-3 rounded-4xl text-white hover:cursor-pointer hover:opacity-70">Cancel</button> */}
        {/* </div> */}


      </div>
    </div>
  )
}

export default UserRequests
