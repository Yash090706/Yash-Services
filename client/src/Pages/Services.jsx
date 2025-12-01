import axios from "axios";
import React, { useState } from "react";
// import { useRef } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

const Services = () => {
  // const location=useLocation();
  // const {workerid}=useParams();
  // console.log(workerid)
  // const location=useLocation();
  const { userinfo } = useSelector((state) => state.user);
  const { workerinfo } = useSelector((state) => state.worker);
  const { sel_worker } = useSelector((state) => state.selected_worker);
  // const worker=location.state
  const [formdata, setformdata] = useState({
    fullname: userinfo?.others?.fullname || workerinfo?.fullname || "",
    worker_name:sel_worker.worker.fullname,
    role:sel_worker.worker.role,
    v_charges:sel_worker.worker.v_charges,
    experience:sel_worker.worker.experience,
    mobile: userinfo?.others?.mobile || workerinfo?.mobile || "",
    address: "",
    date: "",
    message: "",
  });
  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.id]: e.target.value });
  };
  const handleRequest = async (e) => {
    e.preventDefault();
    // console.log(worker)
    console.log(sel_worker);
    console.log(sel_worker.worker._id);

    try {
      await axios
        .post(
          `http://localhost:8000/yash-services/services/hire_request/${userinfo.others._id}/${sel_worker.worker._id}`,
          formdata
        )
        .then((res) => {
          console.log(res.data);
          toast.success(
            `Request Sent To Worker ${sel_worker.worker.fullname} SuccessFully.`
          );
          toast.success(
            `Wait Until ${sel_worker.worker.fullname} Accepts your Request,Our Team will Notify You.`
          );
          setformdata({
            fullname: userinfo?.others?.fullname || workerinfo?.fullname || "",
            mobile: userinfo?.others?.mobile || workerinfo?.mobile || "",
            address: "",
            date: "",
            message: "",
          });
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex flex-row gap-30">
      <ToastContainer />
      <div className="bg-green-200 w-[600px] h-[400px] mt-20 ml-15 rounded-3xl p-15 ">
        <input
          type="text"
          placeholder="Your Name"
          onChange={handleChange}
          id="fullname"
          value={formdata.fullname}
          className="mx-auto bg-green-300 w-full p-3 rounded-2xl text-center font-mono blur-[0.5px] hover:blur-none"
        ></input>
        <input
          type="text"
          placeholder="Your Mobile"
          id="mobile"
          onChange={handleChange}
          value={formdata.mobile}
          className="mx-auto bg-green-300 w-full mt-10 p-3 rounded-2xl text-center font-mono blur-[0.5px] hover:blur-none"
        ></input>
        <textarea
          placeholder="Your Address"
          value={formdata.address}
          id="address"
          onChange={handleChange}
          className="mx-auto bg-green-300 w-full mt-10 p-3 rounded-2xl text-center font-mono resize-none"
        ></textarea>
      </div>
      <div className="bg-green-200 w-[600px] h-[400px] mt-20  rounded-3xl p-15">
        <textarea
          placeholder="Message/ Describe Your Issue"
          id="message"
          onChange={handleChange}
          className="mx-auto bg-green-300 w-full p-3 rounded-2xl text-center font-mono resize-none"
          value={formdata.message}
        ></textarea>
        <input
          type="datetime-local"
          className="bg-green-300 w-full p-3  rounded-2xl text-center font-mono mt-10"
          id="date"
          value={formdata.date}
          onChange={handleChange}
        ></input>
        <button
          className="mt-10 p-3 bg-blue-400 font-mono rounded-4xl ml-20 text-amber-50 hover:cursor-pointer hover:opacity-70"
          onClick={handleRequest}
        >
          Send Request
        </button>
        <button className="p-3 bg-blue-400 font-mono rounded-4xl ml-10 text-amber-50 hover:cursor-pointer hover:opacity-70">View All Requests</button>
      </div>
    </div>
  );
};

export default Services;
