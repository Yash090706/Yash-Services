import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { SetRequests } from "../Redux/WorkerRequestSlice";
import API from "../api/axios";
const WorkerRequests = () => {
  const { workerinfo } = useSelector((state) => state.worker);
  const [hireinfo, sethireinfo] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!workerinfo) {
      navigate("/signin");
    }

    // console.log(workerinfo._id)

    const fetch_workers_request = async () => {
      try {
        const res = await API.get(
          `/yash-services/services/get-hire-req/${workerinfo._id}`
        );
        console.log(res.data.h_req_info);
        sethireinfo(res.data.h_req_info);
        dispatch(SetRequests(res.data.h_req_info));
      } catch (err) {
        console.log(err);
      }
    };

    fetch_workers_request();
  }, [workerinfo, navigate]);
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-green-300 p-4 mx-auto w-[600px] text-center rounded-2xl mt-5 text-2xl font-mono">
        Requets For You {hireinfo.status}
      </div>
      <div className="bg-green-200 p-4 mx-auto w-[900px] rounded-4xl flex flex-col gap-4">
        {hireinfo.length >= 1 ? (
          hireinfo.map((item, index) => (
            <div
              className="bg-green-300 p-7 rounded-2xl flex flex-row gap-10 text-center justify-center "
              key={index}
            >
              <h1 className="font-mono text-center text-2xl">
                {item.fullname}
              </h1>
              <h1 className="font-mono text-2xl ">{item.date}</h1>
              <Link to={`/worker-req/${item._id}`}>
                <button className="bg-blue-500 text-white p-3 rounded-3xl text-center font-mono hover:cursor-pointer hover:opacity-75">
                  View Request
                </button>
              </Link>
            </div>
          ))
        ) : (
          <div className="mx-auto">
            <h1 className="text-center text-red-500 font-mono text-2xl">
              No Requests
            </h1>
          </div>
        )}
        {/* <div className="bg-green-300 p-7 rounded-2xl flex flex-row gap-10 text-center justify-center"> */}
        {/* <h1 className="font-mono text-center text-2xl">{hireinfo.fullname}</h1> */}
        {/* <h1 className="font-mono text-2xl ">{hireinfo.date}</h1> */}
        {/* <button className="bg-blue-500 text-white p-3 rounded-3xl text-center font-mono hover:cursor-pointer hover:opacity-75">View Request</button> */}
        {/* </div> */}
        <Outlet />
      </div>
    </div>
  );
};

export default WorkerRequests;
