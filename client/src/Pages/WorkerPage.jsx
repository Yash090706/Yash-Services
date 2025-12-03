import React, { useState } from 'react'
import { useLocation,Link, useNavigate } from 'react-router-dom'
import userimg from "../assets/userimg.jpg"
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Selected_Worker_Success } from '../Redux/SelectedWorkerSlice'
import { toast, ToastContainer } from 'react-toastify'
const WorkerPage = () => {
    const location=useLocation();
    const worker=location.state
    if (!worker) {
  return (
    <div className="text-center text-2xl mt-10">
      Invalid access. Please select a worker from the list.
    </div>
  );
}

    const {userinfo}=useSelector((state)=>state.user)
    const{workerinfo}=useSelector((state)=>state.worker)
    const[disabled,setdisabled]=useState(false)
    const navigate=useNavigate();
    // const {sel_worker}=useSelector((state)=>state.selected_worker);
    const dispatch=useDispatch();
    const proceed_to_hire=(e)=>{
      e.preventDefault();
      if(userinfo?.others?._id){
        navigate("/services");
        console.log(worker)
        dispatch(Selected_Worker_Success({worker}))
        
        
        // console.log(worker)
      }
      else if(workerinfo?._id){
        toast.warning("You need to Sign in as a Customer.")
        setTimeout(()=>{
          navigate("/signin")
        },2000)
        

      }
      else{
        navigate("/signin")
        
      }

    }







//
  // if(!workerinfo || workerinfo._id != worker._id){
    // setdisabled(true)
  // }
  // else{
    // setdisabled(false)
  // }
// },[workerinfo,worker])
  return (
    <>
    <ToastContainer/>
    <Link to="/">
    <button className='ml-20 p-3 bg-blue-300 mt-5 rounded-3xl font-semibold hover:cursor-pointer hover:opacity-70'> 👈Back</button>
    </Link>
    <div>
      
        <div className="w-[700px] h-[570px] mx-auto bg-green-300  rounded-4xl">
            <h1 className="p-6 text-center text-3xl font-mono ">Workers Info</h1>
            <div>
              <img src={userimg} alt="" className="h-[100px] mx-auto rounded-4xl"/>
            </div>
            <div className="text-center flex flex-col font-mono mt-5 gap-3">
              <h1 className="text-2xl">Name :{worker.fullname}</h1>
              <h2 className="text-xl">Email : {worker.email}</h2>
              <h2 className="text-xl">Gender : {worker.gender}</h2>
              <h2 className="text-xl">Mobile Number : {worker.mobile}</h2>
              <h2 className="text-xl">Role : {worker.role}</h2>
              <h2 className="text-xl">Visiting Charges: {worker.v_charges}</h2>
              <div className="flex flex-row mx-auto gap-3 text-xl">
                <h2 className="">Active</h2>
                {workerinfo && workerinfo._id ===worker._id ?(
                  <div className="text-green-700">Active</div>
                ):(<div className="text-red-600">Not Active</div>)}

              </div>
              <button className={`bg-blue-400 p-3 text-xl rounded-4xl mx-auto w-[150px] hover:cursor-pointer hover:opacity-70 ${disabled ? "blur-[1px] bg-red-500":"blur-none"}`} onClick={proceed_to_hire} disabled={disabled}>Hire Now</button>
              

            </div>

        </div>
      
    </div>
    </>
  )
}

export default WorkerPage
