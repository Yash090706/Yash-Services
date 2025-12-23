import React, { useEffect,useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
axios.defaults.withCredentials = true;
const UserSingleRequest = () => {
  const { user_hire_request } = useSelector((state) => state.user_hire_request);
  const { urid } = useParams();
  const { paymentinfo } = useSelector((state) => state.payment_slice);
  const [hidden, sethidden] = useState(false);

  const info = user_hire_request.find((rid) => urid == rid._id);
  console.log(info);
  // const id=paymentinfo.up_pay.hid
  const req=paymentinfo?.find((r)=>r.up_pay.hid==urid)
// console.log(req)
const isPaid=req?.up_pay?.pay_status==="Done"
useEffect(()=>{
  if(isPaid){
  sethidden(true)
}
else{
  sethidden(false)
}
},[urid])
  return (
    <div className="">
      <Link to="/user-req">
        <button className=" p-2 mt-5 w-[100px] bg-blue-300  rounded-3xl font-semibold hover:cursor-pointer hover:opacity-70 text-xl font-mono ml-10">
          👈Back
        </button>
      </Link>
      <div className="w-[800px] bg-green-200 h-[630px] mx-auto rounded-4xl flex flex-col">
        <h1 className="mx-auto text-center mt-5 text-4xl font-mono">
          Your Request
        </h1>
        <div className="mx-auto text-center p-10 font-mono text-2xl flex flex-col gap-4 ">
          <h1>User Name:{info.fullname}</h1>
          <h1>Worker Name:{info.worker_name}</h1>
          <h1>Mobile:{info.mobile}</h1>
          <h1>Message:{info.message}</h1>
          <h1>Address:{info.address}</h1>
          <h1> Hire Time/Date:{info.date}</h1>
          <h1>Role:{info.role}</h1>
          <h1>Visiting Charges:{info.v_charges}</h1>
          <h1>Experience:{info.experience}</h1>
          <div className="flex flex-row gap-5 mx-auto">
            <Link to={`/google-maps/${info._id}`}>
              <button
                disabled={info.status == "Completed"}
                className="bg-green-500 w-[150px] p-2 rounded-4xl text-white hover:cursor-pointer hover:opacity-70 "
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/128/684/684908.png"
                  className="mx-auto w-10 h-10"
                ></img>
              </button>
            </Link>
            <Link to={`/user-payment/${info._id}/${info.v_charges}`}>
              <button
                className="bg-blue-500 p-3 rounded-4xl text-white hover:cursor-pointer hover:opacity-70"
                hidden={hidden}
              >
                Proceed To Pay
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSingleRequest;
