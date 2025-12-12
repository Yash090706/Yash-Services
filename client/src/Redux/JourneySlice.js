import { createSlice } from "@reduxjs/toolkit";

const initialState={
    loading:false,
    error:false,
    j_info:{}
}

const JourneySlice=createSlice({
    name:"journey",
    initialState,
    reducers:{
        JourneyStart:(state,action)=>{
            state.j_info=action.payload
        }
    }
})


export default JourneySlice.reducer;

export const {JourneyStart}=JourneySlice.actions