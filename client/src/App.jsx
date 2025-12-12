import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Services from "./Pages/Services";
import React from "react";
import SignUp from "./Pages/SignUp";
import Header from "./Components/Header";
import { ToastContainer } from "react-toastify";
import Signin from "./Pages/Signin";
import WorkerPage from "./Pages/WorkerPage";
import UserProfile from "./Pages/UserProfile";
import PrivateRoute from "./Components/PrivateRoute";
import WorkerPrivateRoute from "./Components/WorkerPrivateRoute";
import WorkerProfile from "./Pages/WorkerProfile";
import FilterWorkerspage from "./Pages/FilterWorkerspage";
import ServicePrivateRoute from "./Components/ServicePrivateRoute";
import WorkerRequests from "./Pages/WorkerRequests";
import WorkerSingleRequest from "./Pages/WorkerSingleRequest";
import UserRequests from "./Pages/UserRequests";
import UserSingleRequest from "./Pages/UserSingleRequest";
import { WSignOut } from "./Redux/WorkerSlice";
import WorkerRequestPrivateRoute from "./Components/WorkerRequestPrivateRoute";
import UserRequestPrivateRoute from "./Components/UserRequestPrivateRoute";
import Chat from "./Pages/Chat";
import GoogleMaps from "./Pages/GoogleMaps";
const App = () => {
  return (
    <div className="bg-green-100 min-h-screen min-w-screen">
      <BrowserRouter>
        <Header />
        <ToastContainer position="top-center" />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/services" element={<Services/>}/> */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/google-maps/:rid" element={<GoogleMaps/>}/>
          <Route element={<UserRequestPrivateRoute />}>
            <Route path="/user-req" element={<UserRequests />} />
          </Route>
          <Route path="/user-req/:urid" element={<UserSingleRequest />} />
          <Route path="/worker" element={<WorkerPage />} />
          <Route element={<WorkerRequestPrivateRoute />}>
            <Route path="/worker-req" element={<WorkerRequests />}></Route>
          </Route>

          <Route path="/worker-req/:reqid" element={<WorkerSingleRequest />} />

          <Route path="/w-filter" element={<FilterWorkerspage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<UserProfile />}></Route>
          </Route>
          <Route element={<WorkerPrivateRoute />}>
            <Route path="/w-profile" element={<WorkerProfile />}></Route>
          </Route>
          <Route element={<ServicePrivateRoute />}>
            <Route path="/services" element={<Services />}></Route>
          </Route>
          <Route path="/chat/:requestId/:senderId/:receiverId/:senderName" element={<Chat/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
