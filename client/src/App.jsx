import { BrowserRouter, Routes,Route} from "react-router-dom";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import React from 'react'
import SignUp from "./Pages/SignUp";
import Header from"./Components/Header"
import { ToastContainer} from 'react-toastify';
import Signin from "./Pages/Signin";
import WorkerPage from "./Pages/WorkerPage";
import UserProfile from "./Pages/UserProfile";
import PrivateRoute from "./Components/PrivateRoute";
import WorkerPrivateRoute from "./Components/WorkerPrivateRoute";
import WorkerProfile from "./Pages/WorkerProfile";
const App = () => {
  return (
    <div className="bg-green-100 min-h-screen min-w-screen">
      <BrowserRouter>
      <Header/>
      <ToastContainer/>
<Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/services" element={<Services/>}/>
  <Route path="/signup" element={<SignUp/>}/>
  <Route path="/signin" element={<Signin/>}/>
  <Route path="/worker" element={<WorkerPage/>}/>
  <Route element={<PrivateRoute/>}>
  <Route path="/profile" element={<UserProfile/>}></Route>
  </Route>
  <Route elemet={<WorkerPrivateRoute/>}>
  <Route path="/w-profile" element={<WorkerProfile/>}>

  </Route>

  </Route>
</Routes>
</BrowserRouter>
  </div>
  )
}

export default App;



