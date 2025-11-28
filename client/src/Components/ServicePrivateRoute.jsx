import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
const ServicePrivateRoute = () => {
    const{userinfo}=useSelector((state)=>state.user)
    const{workerinfo}=useSelector((state)=>state.worker)
    
  return (
    <div>
        {userinfo || workerinfo? <Outlet/>:<Navigate to="/signin"></Navigate>}
      
    </div>
  )
}

export default ServicePrivateRoute
