import axios from "axios";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
const WorkerSingleRequest = () => {
  const { worker_requests } = useSelector((state) => state.worker_req_slice);
  const { reqid } = useParams();
  const { workerinfo } = useSelector((state) => state.worker);
  const navigate = useNavigate();

  const request = worker_requests.find((r) => r._id === reqid);

  if (!request) {
    return (
      <div>
        <h1>No Request</h1>
      </div>
    );
  }
  const accept_req = async () => {
    try {
      console.log(request.userid);
      console.log({
        cid: request.userid,
        hid: request._id,
      });
      const res = await axios.post(
        "http://localhost:8000/yash-services/services/accept-request",
        {
          cid: request.userid,
          hid: request._id,
        }
      );
      console.log(res.data);
      toast.success("Request Accepted.");
    } catch (err) {
      console.log(err);
      toast.error("Failed.");
    }
  };
  // useEffect(()=>{
  // if(!workerinfo){
  // navigate("/signin");
  // return;
  // }
  // const ws=new WebSocket(`ws://localhost:8000?userId=${workerinfo._id}`)

  // ws.onopen=()=>{
  // console.log("Websocket of Worker Connected.")
  // }
  // ws.onclose=()=>{
  // console.log("Websocket of Worker Disconnected.")
  // }
  // return () => ws.close();

  // },[workerinfo])
  const cancel_req = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/yash-services/services/worker-cancel-req",
        { hid: request._id }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <div className="bg-green-200 w-[800px] h-[620px] mx-auto mt-7 rounded-3xl p-10">
        <ToastContainer />
        <Link to="/worker-req">
          <button className=" p-3  w-[100px] bg-blue-300  rounded-3xl font-semibold hover:cursor-pointer hover:opacity-70 text-xl font-mono">
            👈Back
          </button>
        </Link>
        <div className="font-mono w-[500px] mx-auto h-[500px] text-xl">
          <h1 className="ml-10 mt-10">User Id:{request.userid}</h1>
          <h1 className="ml-10 mt-10">User Name:{request.fullname}</h1>
          <h1 className="ml-10 mt-10">User Address:{request.address}</h1>
          <h1 className="ml-10 mt-10">User Mobile:{request.mobile}</h1>
          <h1 className="ml-10 mt-10">Message:{request.message}</h1>
          <h1 className="ml-10 mt-10">Hire Date:{request.date}</h1>
          <div className="ml-10 mt-10 flex flex-row gap-8">
            <button
              className="bg-green-500 text-white p-3 rounded-3xl text-center font-mono hover:cursor-pointer hover:opacity-75"
              onClick={accept_req}
            >
              Accept
            </button>
            <button
              className="bg-red-500 text-white p-3 rounded-3xl text-center font-mono hover:cursor-pointer hover:opacity-75"
              onClick={cancel_req}
            >
              Reject
            </button>
            <button
              className="bg-blue-400 text-white p-3 rounded-3xl text-center font-mono hover:cursor-pointer hover:opacity-75"
              onClick={()=>{
                navigate(`/chat/${request._id}`)
                console.log(request._id)
              }}
              hidden={request.status=="Pending"}

            >
              Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerSingleRequest;
