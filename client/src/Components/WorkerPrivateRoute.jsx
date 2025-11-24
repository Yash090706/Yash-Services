import React from 'react'
import { Outlet,Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
const WorkerPrivateRoute = () => {
    const {workerinfo}=useSelector((state)=>state.worker)
  return (
    <div>
        {
            workerinfo ? <Outlet/> : <Navigate to="/signin"></Navigate>
        }
      
    </div>
  )
}

export default WorkerPrivateRoute
