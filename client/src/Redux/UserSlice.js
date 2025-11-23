import { createSlice } from "@reduxjs/toolkit";

const initialState={
    userinfo:null,
    loading:false,
    error:false
}
const UserSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        USignInStart:(state)=>{
            state.loading=true
        },
        USignInSuccess:(state,action)=>{
            state.loading=false,
            state.userinfo=action.payload,
            state.error=false
        },
        USignInFailed:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        }
    }
})

export const {USignInStart,USignInSuccess,USignInFailed}=UserSlice.actions

export default UserSlice.reducer