import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
    const {userinfo}=useSelector((state)=>state.user)
  return (
    <div>
        {
            userinfo ? <Outlet/> :<Navigate to="/signin"></Navigate>
        }
      
    </div>
  )
}

export default PrivateRoute
