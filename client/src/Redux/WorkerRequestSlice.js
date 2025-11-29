import { createSlice } from "@reduxjs/toolkit";

const initialState={
    worker_requests:[],
    loading:false,
    error:false

}
const user_req_slice=createSlice({
    name:"worker_req_slice",
    initialState,
    reducers:{
        setRequests:(state,action)=>{
            state.worker_requests=action.payload   
        },
        clearSingleRequest:(state,action)=>{
            const reqId=action.payload;
        }
    }
})