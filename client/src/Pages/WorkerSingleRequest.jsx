import React from "react";
import { useSelector } from "react-redux";
import { useParams,Link } from "react-router-dom";

const WorkerSingleRequest = () => {
  const { worker_requests } = useSelector((state) => state.worker_req_slice);
  const { reqid } = useParams();

  const request = worker_requests.find((r) => r._id === reqid);

  if (!request) {
    return (
      <div>
        <h1>No Request</h1>
      </div>
    );
  }
  return (
    <div>
      <div className="bg-green-200 w-[800px] h-[600px] mx-auto mt-10 rounded-3xl p-10">
        <Link to="/worker-req">
         <button className=' p-3  w-[100px] bg-blue-300  rounded-3xl font-semibold hover:cursor-pointer hover:opacity-70 text-xl font-mono'>👈Back</button>
         </Link>
        <div className="font-mono w-[500px] mx-auto h-[500px] text-xl">
          <h1 className="ml-10 mt-10">User Id:{request.userid}</h1>
          <h1 className="ml-10 mt-10">User Name:{request.fullname}</h1>
          <h1 className="ml-10 mt-10">Worker Id:{request.workerid}</h1>
          <h1 className="ml-10 mt-10">User Mobile:{request.mobile}</h1>
          <h1 className="ml-10 mt-10">Message:{request.message}</h1>
          <div className="ml-10 mt-10 flex flex-row gap-8">
            <button className="bg-green-500 text-white p-3 rounded-3xl text-center font-mono hover:cursor-pointer hover:opacity-75">
              Accept
            </button>
            <button className="bg-red-500 text-white p-3 rounded-3xl text-center font-mono hover:cursor-pointer hover:opacity-75">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerSingleRequest;
