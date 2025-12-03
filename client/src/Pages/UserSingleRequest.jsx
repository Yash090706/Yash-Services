import React from 'react'
import { useSelector } from 'react-redux'
import { useParams,Link } from 'react-router-dom';
const UserSingleRequest = () => {
    const {user_hire_request}=useSelector((state)=>state.user_hire_request);
    const {urid}=useParams();

   const info= user_hire_request.find((rid)=>urid==rid._id)
   console.log(info)
   
    
  return (
    <div className="">
        <Link to="/user-req">
        <button className=' p-2 mt-5 w-[100px] bg-blue-300  rounded-3xl font-semibold hover:cursor-pointer hover:opacity-70 text-xl font-mono ml-10'>👈Back</button>
        </Link>
        <div className="w-[800px] bg-green-200 h-[550px] mx-auto rounded-4xl flex flex-col">
            <h1 className="mx-auto text-center mt-5 text-4xl font-mono">Your Request</h1>
            <div className="mx-auto text-center p-10 font-mono text-2xl flex flex-col gap-4 ">
                <h1>User Name:{info.fullname}</h1>
                <h1>Worker Name:{info.worker_name}</h1>
                <h1>Mobile:{info.mobile}</h1>
                <h1>Message:{info.message}</h1>
                <h1>Address:{info.address}</h1>
                <h1> Hire Time/Date:{info.date}</h1>
                <h1>Role:{info.role}</h1>
                <h1>Visiting Charges:{info.v_charges}</h1>
                <h1>Experience:{info.experience}</h1>
            </div>

        </div>
      
    </div>
  )
}

export default UserSingleRequest
