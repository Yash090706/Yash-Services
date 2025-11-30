import { createSlice } from "@reduxjs/toolkit";

const initialState={
    worker_requests:[],
    loading:false,
    error:false

}
const worker_req_slice=createSlice({
    name:"worker_req_slice",
    initialState,
    reducers:{
        SetRequests:(state,action)=>{
            state.worker_requests=action.payload   
        },
        ClearSingleRequest:(state,action)=>{
            const reqId=action.payload;
            state.worker_requests=state.worker_requests.filter(req=>req._id!=reqId)

        },
        ClearAllRequests:(state,action)=>{
            state.worker_requests=[]
        }
    }
})

export default worker_req_slice.reducer;
export const {SetRequests,ClearSingleRequest,ClearAllRequests}=worker_req_slice.actions;