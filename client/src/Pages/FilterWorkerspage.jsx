import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import userimg from "../assets/userimg.jpg";
import API from "../api/axios";
axios.defaults.withCredentials = true;
const FilterWorkerspage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role") || "";
  const fullname = searchParams.get("fullname") || "";
  const query = searchParams.get("query");
  const [workers, setworkers] = useState([]);
  const [result, setresults] = useState(true);
  const navigate = useNavigate();
  const getworkerid = async (workerid) => {
    await API
      .get(`/yash-services/worker/worker-data/${workerid}`)
      .then((res) => {
        if (res.data.status == 1) {
          const wdata = res.data.worker_data;
          navigate("/worker", { state: wdata });
        } else {
          return "No Data Found.";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    const filter_workers = async () => {
      try {
        const res = await API.get(
          "/yash-services/worker/search",
          {
            params: { role, fullname },
          }
        );
        console.log(res.data.data);
        setworkers(res.data.data);
        if (res.data.data.length >= 1) {
          setresults(false);
        } else {
          setresults(true);
        }
      } catch (err) {
        console.log(err);
      }
    };
    filter_workers();
  }, [role, fullname]);
  return (
    <div className="flex flex-col font-mono">
      <h1 className="mx-auto mt-5 text-2xl font-serif">
        {result ? " " : `Search Filters For ${query}`}
      </h1>
      {workers.length >= 1 ? (
        workers.map((worker, index) => (
          <div
            className="bg-green-200 w-full h-[300px] mt-4 rounded-2xl flex flex-row gap-10 hover:shadow-[0_6px_18px_rgba(0,0,0,0.25)] hover:scale-102 transition-all duration-300 shadow-[0_6px_15px_rgba(0,0,0,0.15)]"
            key={index}
          >
            <div className="w-[400px] ml-10 rounded-4xl bg-green-300 mt-4 mb-4">
              <img
                src={userimg}
                className="w-full p-7 h-full rounded-4xl"
              ></img>
            </div>
            <div className="w-[900px] bg-green-300 mt-4 mb-4 rounded-4xl center text-center flex flex-col gap-5 mx-auto">
              <h1 className="mt-8 text-2xl"> FullName : {worker.fullname}</h1>
              <h2 className="text-xl">Role:{worker.role}</h2>
              <h2 className="text-xl">Visiting Charges:{worker.v_charges}</h2>
              <button
                className="bg-blue-400 p-2 rounded-3xl mb-3 hover:cursor-pointer hover:opacity-70 w-[200px] mx-auto"
                onClick={() => getworkerid(worker._id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-green-200 w-[400px] mx-auto mt-50 text-center text-4xl text-red-600 rounded-4xl">
          Results Not Found
        </div>
      )}
      {/* <div className="bg-red-600 w-full h-[300px] mt-4 rounded-2xl flex flex-row gap-10"> */}
      {/* <div className="w-[400px] ml-10 rounded-4xl bg-amber-400 mt-4 mb-4"></div> */}
      {/* <div className="w-[900px] bg-blue-600 mt-4 mb-4 rounded-4xl center"> */}
      {/*              */}
      {/* </div> */}
      {/* </div> */}
      {/* <div className="bg-yellow-200 w-full h-[300px] mt-3 rounded-2xl">Hello</div> */}
    </div>
  );
};

export default FilterWorkerspage;
