import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const Header = () => {
  const { userinfo } = useSelector((state) => state.user);
  const { workerinfo } = useSelector((state) => state.worker);
  return (
    <div className="bg-green-300 flex gap-8 p-3 mx-auto min-w-screen">
      <h1 className="font-bold text-2xl text-blue-600">
        YASH'S SERVICE PROVIDERS
      </h1>
      <div className="flex gap-8 mx-auto font-semibold hover:cursor-pointer ">
        <Link to="/">
          <h1>Home</h1>
        </Link>
        <Link to="/services">
          <h1>Sevices</h1>
        </Link>
        <div className="flex flex-row gap-5">
          {userinfo ? (<>
            <span className="text-blue-700 font-mono text-[20px]">{`Welcome - ${userinfo.others.fullname}`}</span>
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
      </div>

      <div className="bg-white mx-auto h-[30px] rounded-lg w-[398px] flex items-center px-2 gap-2">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500" />
        <input
          className="p-1 w-full font-semibold outline-none text-center"
          type="text"
          placeholder="Search Service"
        />
      </div>
    </div>
  );
};

export default Header;
