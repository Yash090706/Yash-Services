import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import userimg from "../assets/userimg.jpg"
import { useNavigate } from "react-router-dom";
// import Header from '../Components/Header'

const Home = () => {
  const navigate=useNavigate();
  const getworkerid=async(workerid)=>{
    await axios.get(`http://localhost:8000/yash-services/worker/worker-data/${workerid}`).then((res)=>{
      if(res.data.status == 1){
        const wdata=res.data.worker_data
        navigate("/worker",{state:wdata});
        
      }
      else{
        return "No Data Found."
      }
    
    }).catch((err)=>{
      console.log(err.response.data)
    })

  }
  const [workers_list, setworkers_list] = useState([]);
  const fetch_workers = async () => {
    await axios
      .get("http://localhost:8000/yash-services/worker/workerlist")
      .then((res) => {
        if (res.data.status === 1) {
          console.log(res.data.wlist);
          setworkers_list(res.data.wlist);
        } else {
          console.log("error");
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  useEffect(() => {
    fetch_workers();
  }, []);

  return (
    <div className="bg-green-100 min-h-screen min-w-screen">
      <div className="pt-5">
        <h1 className="text-center bg-purple-400 p-5 rounded-4xl w-[700px] h-[80px] font-semibold mx-auto text-2xl shadow-[0_0_5px_rgba(255,215,0,1)] text-white transition-all duration-300 ">
          Welcome To Yash Services.. Find Any Service Of Your Choice.
        </h1>
      </div>
      <div className="max-w-full bg-green-100 mt-7 min-h-screen ml-2 mr-2 rounded-lg flex flex-col gap-10 ">
        {/* <div className="bg-green-200 w-full h-[300px] rounded-lg flex gap-3 justify-center"> */}
        <div className="bg-green-200 w-full rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-5">

          {workers_list.length >= 1 ? (
            workers_list.map((worker, index) => (
              <div
                className="bg-green-300 text-black border border-green-400 w-[400px]
                 h-full rounded-3xl ml-5 shadow-[0_6px_15px_rgba(0,0,0,0.15)]
                  hover:shadow-[0_6px_18px_rgba(0,0,0,0.25)] hover:scale-105 transition-all duration-300"
                key={index}
              >
                <img src={userimg} alt="" className="h-[100px] mx-auto mt-2 rounded-4xl"/>
                <h2 className="text-center text-2xl mt-5 font-mono">
                 
                  Name : {worker.fullname}
                </h2>
                <p className="text-center text-xl mt-2 font-mono">
                  Role: {worker.role}
                </p>
                {/* <p className="text-center text-xl mt-2 font-mono"> */}
                  {/* Visiting Charges: {worker.v_charges} */}
                {/* </p> */}
                <p className="text-center text-xl mt-2 font-mono">
                  <button className="bg-blue-400 p-2 rounded-3xl mb-3 hover:cursor-pointer hover:opacity-70" onClick={()=>getworkerid(worker._id)}>View Details</button>
                </p>
              </div>
            ))
          ) : (
            <div>
              <h1 className="text-center p-30 text-4xl text-red-500 font-semibold">
                No Worker Found!!
              </h1>
            </div>
          )}
          {/* <div className="bg-red-400 w-[400px] h-full rounded-3xl ml-5"> */}
          {/* hello */}
          {/* </div> */}
          {/* <div className="bg-red-400 w-[400px] h-full rounded-3xl ml-5"> */}
          {/* hello */}
          {/* </div> */}
        </div>
        {/* <br></br> */}
        {/* <div className="bg-orange-300 w-full h-[300px] rounded-lg flex flex-row gap-3 justify-center"> */}
        {/* <div className="bg-red-400 w-[400px] h-full rounded-3xl ml-5"> */}
        {/* hello */}
        {/* </div> */}
        {/* <div className="bg-red-400 w-[400px] h-full rounded-3xl ml-5"> */}
        {/* hello */}
        {/* </div> */}
        {/* <div className="bg-red-400 w-[400px] h-full rounded-3xl ml-5"> */}
        {/* hello */}
        {/* </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Home;
