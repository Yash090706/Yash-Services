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
        }

    }
})
export const {SignInFailed,SignInStart,SignInSuccess}=WorkerSlice.actions;
export default WorkerSlice.reducer;