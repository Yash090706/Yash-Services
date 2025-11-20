import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
const Header = () => {
  return (
    <div className="bg-green-300 flex gap-8 p-3 mx-auto min-w-screen">
      <h1 className="font-bold text-2xl text-blue-600">YASH'S SERVICE PROVIDERS</h1>
      <div className="flex gap-8 mx-auto font-semibold hover:cursor-pointer ">
        <Link to="/">
          <h1>Home</h1>
        </Link>
        <Link to="/services">
          <h1>Sevices</h1>
        </Link>
        <Link to="/signup">
        <h1>Sign up</h1>
        </Link>
        <Link to="/signin">
        <h1>Sign in</h1>
        </Link>
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
