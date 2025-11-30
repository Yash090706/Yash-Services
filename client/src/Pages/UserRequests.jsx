import React from 'react'

const UserRequests = () => {
  return (
    <div className="p-10">
      <div className='bg-green-200 w-[1200px] mx-auto rounded-3xl flex flex-col gap-4 p-4'>
        <h1 className="font-mono text-3xl text-center p-4">Your Requests</h1>
        <div className="bg-green-300 w-[1000px] mx-auto p-6 rounded-2xl flex flex-row gap-3 font-mono text-xl">
            <div className="flex flex-row gap-30 justify-between mx-auto">
            <h1>Name</h1>
            <h1>Role</h1>
            <h1>Date</h1>
            </div>
            <button className="bg-blue-400 p-3 rounded-4xl text-white hover:cursor-pointer hover:opacity-70">View More</button>
            <button className="bg-red-500 p-3 rounded-4xl text-white hover:cursor-pointer hover:opacity-70">Cancel</button>
        </div>


      </div>
    </div>
  )
}

export default UserRequests
