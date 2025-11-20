import React from 'react'
import { useLocation } from 'react-router-dom'

const WorkerPage = () => {
    const location=useLocation();
    const worker=location.state
  return (
    <div>
        <div className="w-[700px] h-[500px] mx-auto bg-red-400 mt-15 rounded-4xl">
            <h1 className="p-6 text-center text-3xl font-mono ">Workers Info</h1>
            <label className="ml-10 mt-3">{worker.fullname}</label>

        </div>
      
    </div>
  )
}

export default WorkerPage
