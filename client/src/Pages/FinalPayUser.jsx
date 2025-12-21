import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer,toast} from "react-toastify";
import { PaymentFailed, PaymentSuccess } from "../Redux/PaymentSlice";
const FinalPayUser = () => {
  const [user_data, setuserdata] = useState(null);
  const { rid } = useParams();
  const [paymentDone, setPaymentDone] = useState(false);
  const{paymentinfo}=useSelector((state)=>state.payment_slice)
  const dispatch=useDispatch();
  const [hidden_state, sethidden] = useState(true);
  const[uinfo,setuserid]=useState(null)
  const[email,setemail]=useState(null)
  const [feedback_time,setfeedbacktime]=useState();
  // const {worker_requests}=useSelector((state)=>state.worker_req_slice)
  const { worker_requests } = useSelector((state) => state.worker_req_slice);

  console.log(paymentinfo)
  const req=paymentinfo?.find((r)=>r.up_pay.hid==rid)
  // console.log(req)
  const isPaid=req?.up_pay?.pay_status==="Done"
    const[feedback_data,setfeedback_data]=useState({
    wid:req?.up_pay?.wid,
msg:"",
uname:req?.up_pay?.uname,
date:new Date()
  })

  const fetch_email = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/yash-services/services/fetch_email/${user_data?.uid}`
      );
      console.log(res.data.email_info.email);
      setemail(res.data.email_info);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const useridinfo=worker_requests.find((info)=>info._id===rid)
    setuserid(useridinfo)
  }, [rid]);
  useEffect(()=>{
    if(user_data?.uid){
      fetch_email()
    }
  },[user_data?.uid])
  const get_payment_details = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/yash-services/services/user-payment",
        { hid: rid }
      );
      console.log(res.data);
      setuserdata(res.data.get_payment_info);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    get_payment_details();
  }, [rid]);
  const send_otp = async () => {
    try {
      console.log(email?.email)
      const res = await axios.post(
        "http://localhost:8000/yash-services/services/send/payment/otp",
        { email:email?.email ,billno:user_data._id}
      );
      // sethidden(false)
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const payment=async(mode)=>{
     try {
      console.log(mode)
   const sent_otp = await send_otp();
   if (!send_otp) {
     toast.error("Failed to send otp,Try Again");
   }
   toast.success("Otp sent on Ypur Email.");
   const { value: otp } = await Swal.fire({
     title: "Enter OTP Sent on Email",
     input: "text",
     inputPlaceholder: "Enter 6-digit OTP",
     showCancelButton: true,
     confirmButtonText: "Verify",
   });
   if (!otp) {
     return;
   }
   const res = await axios.post(
     `http://localhost:8000/yash-services/services/verify/payment/otp`,
     { email:email?.email, otp }
   );
   console.log(res.data);
  //  dispatch(SetHireRequests(res.data.up));
   if (res.data.msg == "Otp Verified SuccessFully.") {
    const pay_res=await axios.post(`http://localhost:8000/yash-services/services/paymentdone`,{
      pay_status:"Done",pay_mode:mode,rid
    }).then((res)=>{
      console.log(res.data)
      dispatch(PaymentSuccess([res.data]))
    }).catch((err)=>{
      dispatch(PaymentFailed(err))
    })
    // console.log(pay_res.data)
     toast.success("OTP verified.");
     setPaymentDone(true); 

   } else {
     toast.error("Otp expired or Invalid.");
   }
 } catch (err) {
   toast.error("Otp Expired or Invalid");
   console.log(err);
 }
 // toast.success("Otp sent on User Email Receive from them")

  }
  useEffect(()=>{
    const timer=setTimeout(()=>{
      setfeedbacktime(true)
    },[3000])
    return ()=>clearTimeout(timer)
  })
  const handlefeedbackChange=(e)=>{
    setfeedback_data({...feedback_data,[e.target.id]:e.target.value})
  }
  const feedbackSubmit=async(e)=>{
    e.preventDefault();
    try{
      const res=await axios.post("http://localhost:8000/yash-services/services/feedback",feedback_data)
      console.log(res.data)
    }
    catch(err){
      console.log(err)

    }
  }
return (


<div className="mx-auto h-[500px] w-[700px] rounded-3xl mt-10 bg-gradient-to-br from-indigo-100 via-purple-100 to-violet-200 p-6 shadow-xl flex items-center justify-center">

  {!isPaid ? (
    <div className="w-full">
      <p className="bg-gradient-to-r from-indigo-500 to-violet-500 text-2xl ml-10 mt-5 mr-10 rounded-3xl p-6 text-white font-mono text-center shadow-lg">
        Amount = {user_data?.total}
      </p>

      <p className="flex flex-row gap-5 justify-center mt-16">
        <button
          className="bg-violet-500 text-white p-3 rounded-full w-[120px]"
          onClick={()=>(payment("Cash"))}
        >
          Cash
        </button>

        <button className="bg-violet-500 text-white p-3 rounded-full w-[120px]" onClick={()=>(payment("Online"))}>
          Online
        </button>
      </p>
    </div>
  ) : (
    /* PAYMENT SUCCESS UI */
    <div className="flex flex-col items-center justify-center">
      <div className="h-28 w-28 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-3xl font-semibold text-green-700 mt-6">
        Payment Successful
      </h2>

      <p className="text-lg text-slate-700 mt-2">
        Amount ₹{user_data?.total} received successfully
      </p>
    </div>

  )}
   {feedback_time && (
        <div className="mt-8 bg-white shadow-md rounded-xl p-6 w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">
            Give Your Feedback
          </h3>

          <textarea
            placeholder="Write your feedback..."
            className="w-full border rounded-lg p-3 focus:outline-none focus:ring"
            rows={4}
            value={feedback_data.feedback}
            id="msg"
            onChange={handlefeedbackChange}
          />

          <button
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            onClick={feedbackSubmit}
          >
            Submit Feedback
          </button>
        </div>
      )}
</div>


  );
};

export default FinalPayUser;
