import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const WPastOrders = () => {
    const { wid } = useParams();
const [pastorders, setpastorders] = useState([]);
 const get_past_orders = async () => {
   try {
     const res = await axios.post(
       "http://localhost:8000/yash-services/services/w-past-orders",
       { wid }
     );
     console.log(res.data.info);
     setpastorders(res.data.info);
   } catch (err) {
     console.log(err);
   }
 };
 useEffect(() => {
   get_past_orders();
 }, [wid]);
  return (
   
    <div className="p-10">
   <div className="bg-green-200 w-[1200px] mx-auto rounded-3xl flex flex-col gap-6 p-6">
     <h1 className="font-mono text-3xl text-center">Past Orders</h1>
     {/* Order Card */}
     {pastorders ? (
       pastorders.map((order, index) => (
         <div
           className="bg-green-300 w-[1100px] mx-auto p-6 rounded-2xl flex justify-between font-mono text-xl"
           id={index}
         >
           <div className="flex flex-col gap-2">
             <h1>Customer: {order.uname}</h1>
             <h1>Worker:{order.wname}</h1>
             <h1>{new Date(order.paid_at).toDateString()}</h1>
           </div>
           <div className="flex flex-col gap-2 text-right">
             <h1>
               Payment Status:
               <span className="text-green-700 ml-2">
                 {order.pay_status}
               </span>
             </h1>
             <h1>
               Amount:
               <span className="ml-2">{order.total}</span>
             </h1>
             <h1>
               Payment Mode:
               <span className="ml-2">{order.pay_mode}</span>
             </h1>
           </div>
         </div>
       ))
     ) : (
       <div>No Past Orders</div>
     )}
     {/* Order Card */}
     {/* <div className="bg-green-300 w-[1100px] mx-auto p-6 rounded-2xl flex justify-between font-mono text-xl"> */}
     {/* <div className="flex flex-col gap-2"> */}
     {/* <h1>Customer: User Name</h1> */}
     {/* <h1>Worker: Worker Name</h1> */}
     {/* <h1>Date: 10 Dec 2025</h1> */}
     {/* </div> */}
     {/* <div className="flex flex-col gap-2 text-right"> */}
     {/* <h1> */}
     {/* Status: */}
     {/* <span className="text-green-700 ml-2">Paid</span> */}
     {/* </h1> */}
     {/* <h1> */}
     {/* Amount: */}
     {/* <span className="ml-2">₹1500</span> */}
     {/* </h1> */}
     {/* </div> */}
     {/* </div> */}
   </div>
 </div>

   
  )
}

export default WPastOrders
