import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2/dist/sweetalert2.all.js";
import { SetHireRequests } from "../Redux/UserHireRequestSlice";
import API from "../api/axios";

const WorkerSingleRequest = () => {
  const { worker_requests } = useSelector((state) => state.worker_req_slice);
  const { workerinfo } = useSelector((state) => state.worker);

  const { reqid } = useParams();
  const dispatch = useDispatch();

  const [email, setEmail] = useState(null);
  const [hidden, setHidden] = useState(true);
  const [bill, setBill] = useState(true);
  const [completed, setCompleted] = useState(false);

  const request = worker_requests.find((r) => r._id === reqid);

  /* -------------------- GUARD -------------------- */
  if (!request) {
    return <h1 className="text-center mt-10">No Request Found</h1>;
  }

  /* -------------------- STATUS HANDLING -------------------- */
  useEffect(() => {
    setHidden(request.status !== "Pending");
  }, [request.status]);

  /* -------------------- ACCEPT -------------------- */
  const accept_req = async () => {
    try {
      await API.post("/yash-services/services/accept-request", {
        cid: request.userid,
        hid: request._id,
      });
      toast.success("Request Accepted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept request");
    }
  };

  /* -------------------- CANCEL -------------------- */
  const cancel_req = async () => {
    try {
      await API.post("/yash-services/services/worker-cancel-req", {
        hid: request._id,
      });
      toast.success("Request Cancelled");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel request");
    }
  };

  /* -------------------- FETCH EMAIL -------------------- */
  const fetch_email = useCallback(async () => {
    try {
      const res = await API.post(
        `/yash-services/services/fetch_email/${request.userid}`
      );
      setEmail(res?.data?.email_info?.email || null);
    } catch (err) {
      console.error(err);
    }
  }, [request.userid]);

  useEffect(() => {
    fetch_email();
  }, [fetch_email]);

  /* -------------------- SEND OTP -------------------- */
  const send_otp = async () => {
    try {
      const res = await API.post("/yash-services/services/email", { email });
      return res.data?.status === 1;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  /* -------------------- JOB COMPLETION -------------------- */
  const jobcompletion = async () => {
    if (!email) {
      toast.error("User email not found");
      return;
    }

    Swal.fire({
      title: "Sending OTP...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    const otpSent = await send_otp();
    Swal.close();

    if (!otpSent) {
      toast.error("Failed to send OTP");
      return;
    }

    const { value: otp } = await Swal.fire({
      title: "Enter OTP",
      input: "text",
      inputPlaceholder: "6-digit OTP",
      showCancelButton: true,
      confirmButtonText: "Verify",
    });

    if (!otp) return;

    try {
      const res = await API.post(
        `/yash-services/services/verify/${request._id}`,
        { email, otp }
      );

      dispatch(SetHireRequests(res.data.up));

      toast.success("Job Completed");
      setBill(false);
      setCompleted(true);
    } catch (err) {
      console.error(err);
      toast.error("OTP Invalid or Expired");
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="bg-green-200 w-[800px] h-[620px] mx-auto mt-7 rounded-3xl p-10">
      <ToastContainer />

      <div className="flex justify-between">
        <Link to="/worker-req">
          <button className="p-3 bg-blue-300 rounded-3xl">👈 Back</button>
        </Link>

        <Link
          to={`/chat/${request._id}/${request.workerid}/${request.userid}/${request.fullname}`}
        >
          <button className="bg-blue-400 p-3 rounded-3xl">
            <img
              src="https://cdn-icons-png.flaticon.com/128/1370/1370907.png"
              className="h-7 w-7"
            />
          </button>
        </Link>
      </div>

      <div className="mt-10 space-y-3 font-mono text-lg">
        <p>User Name: {request.fullname}</p>
        <p>Address: {request.address}</p>
        <p>Mobile: {request.mobile}</p>
        <p>Message: {request.message}</p>
        <p>Date: {request.date}</p>

        <div className="flex gap-4 mt-6">
          <button onClick={accept_req} hidden={hidden} className="bg-green-500 p-3 rounded-3xl">
            Accept
          </button>

          <button onClick={cancel_req} hidden={hidden} className="bg-red-500 p-3 rounded-3xl">
            Reject
          </button>

          <button onClick={jobcompletion} hidden={completed} className="bg-purple-400 p-3 rounded-3xl">
            Completed ?
          </button>

          <Link to={`/payment/${request._id}`}>
            <button hidden={bill} className="bg-purple-500 p-3 rounded-3xl">
              Create Bill
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkerSingleRequest;
