import { BrowserRouter, Routes,Route} from "react-router-dom";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import React from 'react'
import SignUp from "./Pages/SignUp";
import Header from"./Components/Header"
import { ToastContainer} from 'react-toastify';
import Signin from "./Pages/Signin";
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
</Routes>
</BrowserRouter>
  </div>
  )
}

export default App;



