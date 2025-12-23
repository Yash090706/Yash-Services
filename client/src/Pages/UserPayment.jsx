import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";
// useState

axios.defaults.withCredentials = true;
const UserPayment = () => {
  const { rid, v_charges } = useParams();
  const [user_data, setuserdata] = useState(null);
  const [rows, setrows] = useState([
    {
      date: new Date().toDateString(),
      desc: "",
      charge: "",
    },
  ]);
  console.log(rid);
  //   const hid={rid}
  // console.log(rid)

  const get_payment_details = async () => {
    try {
      const res = await API.post(
        "/yash-services/services/user-payment",
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
    // console.log(user_data)
    // if(!user_data) return;
  }, [rid]);

  return (
    <div className="p-4">
      {/* <ToastContainer/> */}
      <div className="mx-auto font-mono bg-slate-100 w-[700px] min-h-screen  mt-10 rounded-2xl p-3 border-3 border-green-500">
        <div className="flex flex-col mt-2 text-green-700 text-3xl text-center">
          Payment
        </div>
        {/* <div className="flex flex-row"> */}
        {/* </div> */}
        <div className="flex flex-row gap-10 mt-5 ml-15">
          <div className="flex flex-row gap-3 ml-5">
            <label className="text-xl">UserName : </label>
            <h1 className="text-xl">{user_data?.uname}</h1>
          </div>
          <div className="flex flex-row gap-3 ml-10">
            <label className="text-xl">Worker Name :</label>
            <h1 className="text-xl">{user_data?.wname}</h1>
          </div>
        </div>
        <div className="flex flex-row gap-10 mt-5 ml-5 text-center">
          <div className="flex flex-row gap-3 ml-5">
            <label className="text-xl">Bill No.</label>
            <h1 className="text-xl">{user_data?._id}</h1>
          </div>
          <div className="flex flex-row gap-3 ml-5 mr-10">
            <label className="text-xl">Visit Fee:</label>
            <h1 className="text-xl">{v_charges}</h1>
          </div>
        </div>
        <div className="mx-auto bg-green-200 rounded-2xl p-3 flex flex-col gap-3 ml-2 mr-2 mt-5 border-3 border-green-500">
          <div className="flex flex-row justify-between">
            <h1>Sr NO.</h1>
            <h1>DATE</h1>
            <h1>Description</h1>
            <h1>Charge</h1>
          </div>
          {user_data?.details?.map((row, index) => (
            <div
              className="flex flex-row justify-between bg-slate-300 rounded-2xl border-3 border-gray-400"
              key={index}
            >
              <h1 className="p-3">{index + 1}</h1>
              <h1 className="p-3">
                {/* {readableDate.toDateString()} */}
                {user_data?.date}
              </h1>
              <div className="p-3 text-xl ">
                <textarea
                  id="desc"
                  value={row.desc}
                  //   onChange={(e) => {
                  // updated_rows(index, "desc", e.target.value);
                  //   }}
                  className="bg-gray-200 text-black text-center rounded-2xl w-[140px] "
                ></textarea>
              </div>
              <div className="p-3 text-xl">
                <input
                  type="text"
                  id="charges"
                  className="bg-gray-200 rounded-2xl w-[80px] p-3 text-center"
                  value={row.charge}
                  //   onChange={(e) => {
                  // updated_rows(index, "charge", e.target.value);
                  //   }}
                ></input>
              </div>
            </div>
          ))}
        </div>
        <div className="ml-40 mt-5 flex flex-row h-[50px] gap-5">
          <h1 className=" bg-green-300  text-center rounded-2xl p-2 border-3 border-green-500 text-2xl">
            Total :{user_data?.total}
          </h1>
          <Link to={`/finalpay/${rid}`}>
          <button className="bg-blue-500 text-white text-2xl rounded-2xl hover:cursor-pointer hover:opacity-75 p-3 w-[150px]">
            Pay
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserPayment;
