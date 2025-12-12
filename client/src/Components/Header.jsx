import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const Header = () => {
  const { userinfo } = useSelector((state) => state.user);
  const { workerinfo } = useSelector((state) => state.worker);
  const {worker_requests}=useSelector((state)=>state.worker_req_slice)
  const [query,setquery]=useState("");
  const navigate=useNavigate()
  const handleChange=(e)=>{
    setquery(e.target.value)
   
  }
  const handleSearch=(e)=>{
    e.preventDefault();
     navigate(`/w-filter?role=${query}&fullname=${query}&query=${query}`);
     setquery("")
     
  }


  return (
    <div className="bg-green-300 flex gap-8 p-3 mx-auto min-w-screen">
      <h1 className="font-bold text-2xl text-blue-600">
        YASH'S SERVICE PROVIDERS
      </h1>
      <div className="flex gap-8 mx-auto font-semibold hover:cursor-pointer ">
        <Link to="/">
          <h1>Home</h1>
        </Link>
        <Link to="/google-maps">Maps
        </Link>
        {/* <Link to="/services"> */}
          {/* <h1>Sevices</h1> */}
        {/* </Link> */}
        <div className="flex flex-row gap-5">
          {userinfo ? (<>
            <span className="text-blue-700 font-mono text-[20px]">{`Welcome - ${userinfo.others.fullname}`}</span>
            <h1>{console.log(userinfo.others.fullname)}</h1>
            <Link to="/profile">Profile
            </Link>
            </>
          ) : workerinfo ? (
            <>
            <span className="text-blue-700 font-mono text-[20px]">{`Welcome - ${workerinfo.fullname}`}</span>
            <Link to="/w-profile">Profile
            </Link>
            </>
          ) : (
            <div className="">
              <Link to="/signin">Sign In</Link>
              {/* <Link to="/signup">Sign Up</Link> */}
            </div>
          )}
        </div>
        {/* <Link to="/worker"> */}
        {/* <h1>Worker</h1> */}
        {/* </Link> */}
        {
          workerinfo ? (
            <Link to="/worker-req" className="relative inline-block">
              <span>
                Requests
              </span>
              {worker_requests.length > 0 && (<span className="
      absolute -top-2 -right-3
      bg-red-600 text-white text-xs
      px-2 py-0.5 rounded-full
    ">
      {worker_requests.length}
    </span> )}
            </Link>
          ):(
            <Link to="/user-req">Requests</Link>
          )
        }
        {/* <Link to="/worker-req">Requests</Link> */}
      </div>
      
      {/* <Link to="w-filter">Workers Filter</Link> */}

      <div className="bg-white mx-auto h-[30px] rounded-lg w-[398px] flex items-center px-2 gap-2">
        <button className="hover:cursor-pointer" onClick={handleSearch}><FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500" /></button>
        <input
          className="p-1 w-full font-semibold outline-none text-center"
          type="text"
          placeholder="Search Service"
          // id="search"
          onChange={handleChange}
          value={query}
        />
      </div>
    </div>
  );
};

export default Header;
