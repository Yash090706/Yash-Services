import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const UserRequestPrivateRoute = () => {
    const{userinfo}=useSelector((state)=>state.user)
  return (
    <div>
        {
            userinfo? <Outlet/> :<Navigate to="/signin"/>
        }
      
    </div>
  )
}

export default UserRequestPrivateRoute
