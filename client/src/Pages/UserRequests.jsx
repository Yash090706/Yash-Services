import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import {Swal} from "sweetalert2/dist/sweetalert2.js";
// import Swal from "sweetalert2";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { useDispatch } from "react-redux";
import {
  clearSingleHireRequest,
  SetHireRequests,
} from "../Redux/UserHireRequestSlice";

const UserRequests = () => {
  const { userinfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { user_hire_request } = useSelector((state) => state.user_hire_request);
  console.log(user_hire_request);

  const navigate = useNavigate();
  const [sended_req, setsended_req] = useState([]);
  const cancel_req = async (hidd) => {
    // e.preventDefault();
    console.log("Swal =", Swal);

    Swal.fire({
      title: "Do you want to Cancel Request ? ",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // console.log(sended_req[0]._id);
        const hid = hidd;
        const res = await axios.post(
          "http://localhost:8000/yash-services/services/cancel-req",
          { hid }
        );
        // fetch_sended_req();
        console.log(res.data);
        dispatch(clearSingleHireRequest(hid));
        setsended_req(user_hire_request);
        fetch_sended_req();
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
  const fetch_sended_req = async () => {
    try {
      await axios
        .get(
          `http://localhost:8000/yash-services/services/view-sended-req/${userinfo.others._id}`
        )
        .then((res) => {
          console.log(res.data);
          setsended_req(res.data.sended_req_info);
          dispatch(SetHireRequests(res.data.sended_req_info));
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userinfo) {
      navigate("/signin");
    }
    // const fetch_sended_req = async () => {
    // try {
    // await axios
    // .get(
    // `http://localhost:8000/yash-services/services/view-sended-req/${userinfo.others._id}`
    // )
    // .then((res) => {
    // console.log(res.data);
    // setsended_req(res.data.sended_req_info);
    // dispatch(SetHireRequests(res.data.sended_req_info))
    //
    // });
    // } catch (err) {
    // console.log(err);
    // }
    // };

    fetch_sended_req();

    // cancel_req();
  }, []);

  return (
    <div className="p-10">
      <div className="bg-green-200 w-[1200px] mx-auto rounded-3xl flex flex-col gap-4 p-4">
        <h1 className="font-mono text-3xl text-center p-4">Your Requests</h1>
        {sended_req.length > 0 ? (
          sended_req.map((info, index) => (
            <div
              className="bg-green-300 w-[1000px] mx-auto p-6 rounded-2xl flex flex-row gap-3 font-mono text-xl"
              id={index}
            >
              <div className="flex flex-row gap-30 justify-between mx-auto">
                <h1>{info.fullname}</h1>
                <h1>{info.worker_name}</h1>
                <h1>{info.date}</h1>
              </div>
              <Link to={`/user-req/${info._id}`}>
                <button
                  className="bg-blue-400 p-3 rounded-4xl text-white hover:cursor-pointer hover:opacity-70"
                  onClick={() => user_req_view_more(info._userid)}
                >
                  View More
                </button>
              </Link>
              <button
                className="bg-red-500 p-3 rounded-4xl text-white hover:cursor-pointer hover:opacity-70"
                onClick={() => cancel_req(info._id)}
              >
                Cancel
              </button>
            </div>
          ))
        ) : (
          <div className="mx-auto text-3xl font-mono text-red-500">
            {" "}
            No Requests
          </div>
        )}
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
  );
};

export default UserRequests;
