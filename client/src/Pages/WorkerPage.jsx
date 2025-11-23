import React from 'react'
import { useLocation,Link } from 'react-router-dom'
import userimg from "../assets/userimg.jpg"
const WorkerPage = () => {
    const location=useLocation();
    const worker=location.state
  return (
    <>
    <Link to="/">
    <button className='ml-20 p-3 bg-blue-300 mt-5 rounded-3xl font-semibold hover:cursor-pointer hover:opacity-70'> 👈Back</button>
    </Link>
    <div>
      
        <div className="w-[700px] h-[570px] mx-auto bg-green-300  rounded-4xl">
            <h1 className="p-6 text-center text-3xl font-mono ">Workers Info</h1>
            <div>
              <img src={userimg} alt="" className="h-[100px] mx-auto rounded-4xl"/>
            </div>
            <div className="text-center flex flex-col font-mono mt-10 gap-3">
              <h1 className="text-2xl">Name :{worker.fullname}</h1>
              <h2 className="text-xl">Email : {worker.email}</h2>
              <h2 className="text-xl">Gender : {worker.gender}</h2>
              <h2 className="text-xl">Mobile Number : {worker.mobile}</h2>
              <h2 className="text-xl">Role : {worker.role}</h2>
              <h2 className="text-xl">Visiting Charges: {worker.v_charges}</h2>
              <button className="bg-blue-400 p-3 text-xl rounded-4xl mx-auto w-[150px] mt-5 hover:cursor-pointer hover:opacity-70">Hire Now</button>
              

            </div>

        </div>
      
    </div>
    </>
  )
}

export default WorkerPage
