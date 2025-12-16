import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import {toast,ToastContainer} from "react-toastify"
const Payment = () => {
  const { user_hire_request } = useSelector((state) => state.user_hire_request);
  const { rid } = useParams();
  console.log(user_hire_request);
  const readableDate = new Date(Date.now());
  const [rows, setrows] = useState([
    {
      date: new Date().toDateString(),
      desc: "",
      charge: "",
    },
  ]);
  const addRows = () => {
    setrows([
      ...rows,
      {
        date: new Date().toDateString(),
        desc: "",
        charge: "",
      },
    ]);
  };

  const updated_rows = (index, field, value) => {
    const update = [...rows];
    update[index][field] = value;
    setrows(update);
  };
  const total = rows.reduce((sum, row) => sum + Number(row.charge || 0), 0);
  const g_total = total + Number(user_hire_request.v_charges);
  const remove_row = (index) => {
    setrows(rows.filter((_, i) => index != i));
  };
  const data = {
    uid: user_hire_request.userid,
    wid: user_hire_request.workerid,
    hid: user_hire_request._id,
    uname: user_hire_request.fullname,
    wname: user_hire_request.worker_name,
    date: new Date().toDateString(),
    details: rows
      .filter((row) => row.desc !== "" && row.charge !== "")
      .map((row) => ({ desc: row.desc, charge: Number(row.charge) })),
    total: g_total,
  };
  // console.log(rows)
  console.log(data);
  const createBill = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/yash-services/services/bill-save",
        data
      );
      toast.success("Bill Created SuccesFully.")
      console.log(res.data);
      setrows(rows.map((row)=>({...row,desc:"",charge:""})))
    } catch (err) {
      console.log(err);
      toast.error("Bill Creation Failed.")
    }
  };

  return (
    <div className="p-4">
      <ToastContainer/>
      <div className="mx-auto font-mono bg-slate-100 w-[700px] min-h-screen  mt-10 rounded-2xl p-3 border-3 border-green-500">
        <div className="flex flex-col mt-5 text-green-700 text-2xl text-center">
          Bill
        </div>
        <div className="mt-5 pl-20 pr-20 flex flex-col">
          <label className="ml-5 text-xl">Visiting Charges - </label>
          <input
            type="text"
            placeholder="Visiting Charges"
            className="bg-slate-300 
          rounded-2xl font-mono text-xl w-full text-center p-1 border-3 border-green-500 text-black mt-2"
            value={user_hire_request.v_charges}
          ></input>
        </div>
        <div className="mx-auto bg-green-200 rounded-2xl p-3 flex flex-col gap-3 ml-2 mr-2 mt-5 border-3 border-green-500">
          <div className="flex flex-row justify-between">
            <h1>Sr NO.</h1>
            <h1>DATE</h1>
            <h1>Description</h1>
            <h1>Charge</h1>
          </div>
          {rows.map((row, index) => (
            <div
              className="flex flex-row justify-between bg-slate-300 rounded-2xl border-3 border-gray-400"
              key={index}
            >
              <h1 className="p-3">{index + 1}</h1>
              <h1 className="p-3" value={row.date}>
                {readableDate.toDateString()}
              </h1>
              <div className="p-3">
                <textarea
                  id="desc"
                  value={row.desc}
                  onChange={(e) => {
                    updated_rows(index, "desc", e.target.value);
                  }}
                  className="bg-gray-200 text-black text-center rounded-2xl w-[140px] "
                ></textarea>
              </div>
              <div className="p-3">
                <input
                  type="text"
                  id="charges"
                  className="bg-gray-200 rounded-2xl w-[80px] p-3 text-center"
                  value={row.charge}
                  onChange={(e) => {
                    updated_rows(index, "charge", e.target.value);
                  }}
                ></input>
              </div>
              <button onClick={() => remove_row(index)} className="text-xl">
                -
              </button>
              {/* <input type="text" className="bg-white rounded-2xl w-[80px] "></input> */}
            </div>
          ))}

          <button className="text-xl" onClick={addRows}>
            +
          </button>
        </div>
        <div className="flex flex-row">
          <div className="bg-green-300 mx-auto text-center font-mono text-xl w-[300px] rounded-2xl mt-5 p-3 flex flex-row ">
            <h1 className="ml-25">Total-</h1>
            <h1 className="">{g_total}</h1>
          </div>
          <button
            className="bg-blue-400 mr-35 mt-5 p-3 rounded-2xl hover:cursor-pointer hover:opacity-75"
            onClick={createBill}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
