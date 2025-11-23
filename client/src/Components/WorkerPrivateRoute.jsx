import React from 'react'
import { Outlet,Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
const WorkerPrivateRoute = () => {
    const {workerinfo}=useSelector((state)=>state.worker)
  return (
    <div>
        {
            workerinfo ? <Outlet/> : <Link to="/signin"></Link>
        }
      
    </div>
  )
}

export default WorkerPrivateRoute
