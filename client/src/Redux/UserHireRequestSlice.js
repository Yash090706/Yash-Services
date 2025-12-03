import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user_hire_request:[],
    loading:false,
    error:false
}

const User_Hire_Request=createSlice({
    name:"user_hire_request",
    initialState,
    reducers:{
        SetHireRequests:(state,action)=>{
            state.user_hire_request=action.payload

        },
        clearSingleHireRequest:(state,action)=>{
            const rid=action.payload
            state.user_hire_request=state.user_hire_request.filter((req)=>req._id!=rid)

        },
        ClearAllHireRequest:(state)=>{
            state.user_hire_request=[]
        }
    }
})

export default User_Hire_Request.reducer;

export const {SetHireRequests,ClearAllHireRequest,clearSingleHireRequest}=User_Hire_Request.actions;