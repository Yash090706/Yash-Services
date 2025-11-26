import {createSlice} from "@reduxjs/toolkit";

const initialState={
    workerinfo:null,
    loading:false,
    error:false
}

const WorkerSlice=createSlice({
    name:"worker",
    initialState,
    reducers:{
        SignInStart:(state)=>{
            state.loading=true;
        },
        SignInSuccess:(state,action)=>{
            state.loading=false;
            state.workerinfo=action.payload
            state.error=false;
        },
        SignInFailed:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        },
        WUpdateStart:(state)=>{
            state.loading=true
        },
        WUpdateSuccess:(state,action)=>{
            state.loading=false,
            state.workerinfo=action.payload,
            state.error=false
        },
        WUpdateFailed:(state,action)=>{
            state.loading=false,
            state.error=action.payload
        },
        WSignOut:(state)=>{
            state.workerinfo=null,
            state.loading=false,
            state.error=false
        }

    }
})
export const {SignInFailed,SignInStart,SignInSuccess,WUpdateFailed,WUpdateStart,WUpdateSuccess,WSignOut}=WorkerSlice.actions;
export default WorkerSlice.reducer;