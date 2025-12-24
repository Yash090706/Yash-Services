import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import CompletionJ from "../Components/CompletionJ";
import { SetHireRequests } from "../Redux/UserHireRequestSlice";
import API from "../api/axios";
axios.defaults.withCredentials = true;

const WorkerSingleRequest = () => {
  const { worker_requests } = useSelector((state) => state.worker_req_slice);
  const { user_hire_request } = useSelector((state) => state.user_hire_request);
  const { reqid } = useParams();
  const { workerinfo } = useSelector((state) => state.worker);
  const { j_info } = useSelector((state) => state.journey);
  const [email, setemail] = useState(null);
  const dispatch = useDispatch();
  const [hidden,sethidden]=useState(true)
  const[bill,showbill]=useState(true)
  const[completed,setcompleted]=useState(false)

  // const navigate = useNavigate();
  // const icon="https://cdn-icons-png.flaticon.com/128/684/684908.png"
  // console.log(user_hire_request);

  const request = worker_requests.find((r) => r._id === reqid);
  console.log(request)
  console.log(j_info);
  if (!request) {
    return (
      <div>
        <h1>No Request</h1>
      </div>
    );
  }
  useEffect(()=>{
    if(request.status == "Pending"){
      sethidden(false)
    }
    else{
      sethidden(true)
    }
  })
  const accept_req = async () => {
    try {
      console.log(request.userid);
      console.log({
        cid: request.userid,
        hid: request._id,
      });
      const res = await API.post(
        "/yash-services/services/accept-request",
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
      const res = await API.post(
        "/yash-services/services/worker-cancel-req",
        { hid: request._id }
      );
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const journey_info_sub = async () => {
    const now = new Date();
    const dt = now.toLocaleString();
    const jinfo = {
      uid: request.userid,
      wid: request.workerid,
      j_hid: request._id,
      u_add: request.address,
      w_add: workerinfo.w_address,
      status: "Started",
      date_time: dt,
    };
    try {
      await API
        .post("/yash-services/services/journey", jinfo)
        .then((res) => {
          // toast.success("Journey Started.");
          console.log(res.data);
        });
    } catch (err) {
      console.log(err);
      toast.error("Unable To Start Journey");
    }
  };
  useEffect(() => {
    journey_info_sub();
  }, []);
  const jobcompletion = async () => {
    Swal.fire({
  title: "Sending OTP...",
  allowOutsideClick: false,
  didOpen: () => Swal.showLoading(),
});

    if (!email) {
      toast.error("Email not found");
      return;
    }
    try {
      const sent_otp = await send_otp();
      Swal.close();

      if (!send_otp) {
        toast.error("Failed to send otp,Try Again");
        return;
      }
      toast.success("Otp sent on user Email please receive from them.");

      const { value: otp } = await Swal.fire({
        title: "Enter OTP sent to user email",
        input: "text",
        inputPlaceholder: "Enter 6-digit OTP",
        showCancelButton: true,
        confirmButtonText: "Verify",
      });

      if (!otp) {
        return;
      }
      const res = await API.post(
        `/yash-services/services/verify/${request?._id}`,
        { email, otp }
      );
      console.log(res.data.up);
      dispatch(SetHireRequests(res.data.up));
      // console.log(res.data.up)
      if (res.data.msg == "OTP VERIFIED SUCCESSFULLY.") {
        toast.success("OTP verified. Job completed.");
        showbill(false)
        setcompleted(true)
      } else {
        toast.error("Otp expired or Invalid.");
      }
    } catch (err) {
      toast.error("Otp Expired or Invalid");
      console.log(err);
    }
    // toast.success("Otp sent on User Email Receive from them")
    // send_otp();
    // setTimeout(()=>{
    // Swal.fire({
    // title: "Enter Otp Sent on User Email ? ",
    // showDenyButton: true,
    // showCancelButton: true,
    // confirmButtonText: "Submit",
    // input:"text",
    // denyButtonText: "No",
    // }).then(async (result) => {
    // if (result.isConfirmed) {
    //
    // } else if (result.isDenied) {
    // Swal.fire("Changes are not saved", "", "info");
    // }
    // });
    // },[3000])
  };
  const fetch_email = async () => {
    try {
      const res = await API.post(
        `/yash-services/services/fetch_email/${request?.userid}`
      );
      console.log(res.data.email_info.email);
      setemail(res?.data?.email_info?.email);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetch_email();
  }, [request?.userid]);
const send_otp = async () => {
  try {
    const res = await API.post("/yash-services/services/email", { email });

    if (res.data?.status === 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};


  return (
    <div>
      <div className="bg-green-200 w-[800px] h-[620px] mx-auto mt-7 rounded-3xl p-10">
        <ToastContainer />
        <div className="flex flex-row justify-between">
        <Link to="/worker-req">

          <button className=" p-3  w-[100px] bg-blue-300  rounded-3xl font-semibold hover:cursor-pointer hover:opacity-70 text-xl font-mono">
            👈Back
          </button>
        </Link>
         <Link
   to={`/chat/${request._id}/${request.workerid}/${request.userid}/${request.fullname}`}
 >
   <button
     className="bg-blue-400 text-white p-3 rounded-3xl text-center font-mono hover:cursor-pointer hover:opacity-75"
   ><img src="https://cdn-icons-png.flaticon.com/128/1370/1370907.png" className="h-7 w-7"></img>
   </button>
 </Link>
 </div>
        <div className="font-mono w-[500px] mx-auto h-[500px] text-xl">
          <h1 className="ml-10 mt-10">User Id:{request.userid}</h1>
          <h1 className="ml-10 mt-10">User Name:{request.fullname}</h1>
          <h1 className="ml-10 mt-10">User Address:{request.address}</h1>
          <h1 className="ml-10 mt-10">User Mobile:{request.mobile}</h1>
          {/* <h1 className="ml-10 mt-10">User Email:{request.email}</h1> */}
          <h1 className="ml-10 mt-10">Message:{request.message}</h1>
          <h1 className="ml-10 mt-10">Hire Date:{request.date}</h1>
         
         
         
         
         
        <div className="ml-10 mt-10 flex flex-row flex-wrap gap-6 items-center">

  {/* Accept */}
  <button
    className="bg-green-500 text-white p-3 rounded-3xl text-center font-mono hover:cursor-pointer hover:opacity-75"
    onClick={accept_req}
    hidden={hidden}
  >
    Accept
  </button>

  {/* Reject */}
  <button
    className="bg-red-500 text-white p-3 rounded-3xl text-center font-mono hover:cursor-pointer hover:opacity-75"
    onClick={cancel_req}
    hidden={hidden}
  >
    Reject
  </button>

  {/* Chat */}

  {/* Map / Journey */}
  <Link to={`/google-maps/${request._id}`}>
    <button
      onClick={journey_info_sub}
      className="bg-green-400 text-white p-2 rounded-3xl text-center font-mono hover:cursor-pointer hover:opacity-75"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/128/684/684908.png"
        className="mx-auto w-10 h-9"
      />
    </button>
  </Link>

  {/* Completed */}
  <button
    // hidden={user_hire_request.status == "Completed"}
    // hidden={request.status == "Pending"}
    className="bg-purple-400 text-white rounded-3xl text-center font-mono hover:cursor-pointer hover:opacity-75 p-3"
    onClick={jobcompletion}
    hidden={completed}
  >
    Completed ?
  </button>
     <Link to={`/payment/${request._id}`}>
   <button
     className="bg-purple-400 text-white rounded-3xl text-center font-mono hover:cursor-pointer hover:opacity-75 p-3"
     hidden={bill}
   >
     Create Bill
   </button>
 </Link>

</div>

         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
         
        </div>
      </div>
    </div>
  );
};

export default WorkerSingleRequest;
