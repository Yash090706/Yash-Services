import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const WorkerRequestPrivateRoute = () => {
    const{workerinfo}=useSelector((state)=>state.worker)
  return (
    <div>
        {workerinfo? <Outlet/>:<Navigate to="/signin"/>}
      
    </div>
  )
}

export default WorkerRequestPrivateRoute
