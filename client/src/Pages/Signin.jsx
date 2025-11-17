import React from "react";

const Signin = () => {
  return (
    <div className="bg-gray-50 w-[600px] h-[500px] mx-auto mt-11 rounded-4xl border-2 shadow-[0_0_15px_rgba(0,0,0,0.15)] transition-all duration-300 ">
      <h1 className="text-center p-3 font-semibold text-5xl">Sign in </h1>
      <form className="flex flex-col gap-7 mt-10">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg border text-center bg-white shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg border text-center bg-white shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
        />
        <select
          className="bg-white p-3 rounded-lg border shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
        //   onChange={handleChange}
          id="UserType"
        //   value={custdata.UserType}
        >
          <option className="text-center bg-gray-200 font-semibold">
            Select Type:
          </option>
          <option className="text-center bg-gray-200 font-semibold">
            Worker
          </option>
          <option className="text-center font-semibold bg-gray-200">
            Customer
          </option>
        </select>
        <button className="bg-green-300 p-3 rounded-lg border font-semibold hover:cursor-pointer hover:opacity-75">
          SIGNIN
        </button>
      </form>
    </div>
  );
};

export default Signin;
