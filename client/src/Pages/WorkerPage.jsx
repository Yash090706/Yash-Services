import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import userimg from "../assets/userimg.jpg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Selected_Worker_Success } from "../Redux/SelectedWorkerSlice";
import { toast, ToastContainer } from "react-toastify";
const WorkerPage = () => {
  const [open, setopen] = useState(false);
  const location = useLocation();
  const worker = location.state;
  if (!worker) {
    return (
      <div className="text-center text-2xl mt-10">
        Invalid access. Please select a worker from the list.
      </div>
    );
  }
  const feedback_data = worker?.feedbacks?.map((item) => ({
    uname: item.uname,
    msg: item.msg,
    date: item.date,
  }));
  console.log(worker.feedbacks);

  const { userinfo } = useSelector((state) => state.user);
  const { workerinfo } = useSelector((state) => state.worker);
  const [disabled, setdisabled] = useState(false);
  const navigate = useNavigate();
  // const {sel_worker}=useSelector((state)=>state.selected_worker);
  const dispatch = useDispatch();
  const proceed_to_hire = (e) => {
    e.preventDefault();
    if (userinfo?.others?._id) {
      navigate("/services");
      console.log(worker);
      dispatch(Selected_Worker_Success({ worker }));

      // console.log(worker)
    } else if (workerinfo?._id) {
      toast.warning("You need to Sign in as a Customer.");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } else {
      navigate("/signin");
    }
  };

  //
  // if(!workerinfo || workerinfo._id != worker._id){
  // setdisabled(true)
  // }
  // else{
  // setdisabled(false)
  // }
  // },[workerinfo,worker])
  return (
    <>
      <ToastContainer />
      <Link to="/">
        <button className="ml-20 p-3 bg-blue-300 mt-5 rounded-3xl font-semibold hover:cursor-pointer hover:opacity-70">
          {" "}
          👈Back
        </button>
      </Link>
      <div>
        <div className="w-[700px] mx-auto bg-green-300  rounded-4xl">
          <h1 className="p-6  text-center text-3xl font-mono ">Workers Info</h1>
          <div>
            <img
              src={userimg}
              alt=""
              className="h-[100px] mx-auto rounded-4xl"
            />
          </div>
          <div className="text-center flex flex-col font-mono mt-5 gap-3 pb-10">
            <h1 className="text-2xl">Name :{worker.fullname}</h1>
            <h2 className="text-xl">Email : {worker.email}</h2>
            <h2 className="text-xl">Gender : {worker.gender}</h2>
            <h2 className="text-xl">Mobile Number : {worker.mobile}</h2>
            <h2 className="text-xl">Role : {worker.role}</h2>
            <h2 className="text-xl">Visiting Charges: {worker.v_charges}</h2>
            <div>
              <button
                className="bg-green-700 text-white hover:bg-green-800 rounded-xl p-2
"
                onClick={() => setopen(!open)}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1484/1484584.png"
                  className="w-15 h-10"
                ></img>
              </button>
              {open && (
                <div
                  className="absolute top-32 right-15  ml-4 w-[320px] max-h-[800px] overflow-y-auto bg-green-200 border border-green-500 rounded-xl p-3 shadow-lg z-50"
                >
                  {worker?.feedbacks?.length === 0 ? (
                    <p>No feedback</p>
                  ) : (
                    worker?.feedbacks?.map((item, index) => (
                      <div
                        key={index}
                        className="bg-green-400 text-amber-50 mt-5 rounded-3xl"
                      >
                        <p>Msg:{item.msg}</p>
                        <h2>From:{item.uname}</h2>
                        <h2>Date:{new Date(item.date).toDateString()}</h2>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              className={`bg-blue-400 p-3 text-xl rounded-4xl mx-auto w-[150px] hover:cursor-pointer hover:opacity-70 ${
                disabled ? "blur-[1px] bg-red-500" : "blur-none"
              }`}
              onClick={proceed_to_hire}
              disabled={disabled}
            >
              Hire Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkerPage;
