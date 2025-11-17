import { BrowserRouter, Routes,Route} from "react-router-dom";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import React from 'react'
import SignUp from "./Pages/SignUp";
import Header from"./Components/Header"
import { ToastContainer} from 'react-toastify';
const App = () => {
  return (
      <BrowserRouter>
      <Header/>
      <ToastContainer/>
<Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/services" element={<Services/>}/>
  <Route path="/signup" element={<SignUp/>}/>
</Routes>
</BrowserRouter>
  
  )
}

export default App;



