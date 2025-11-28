import { createSlice } from "@reduxjs/toolkit";

const initialState={
    sel_worker:null,
    loading:false,
    error:false
}

const selected_worker_slice=createSlice({
    name:"selected_worker",
    initialState,
    reducers:{
        Selected_Worker_Success:(state,action)=>{
            state.sel_worker=action.payload,
            state.loading=false,
            state.error=false
        }

    }
})

export default selected_worker_slice.reducer;
export const{Selected_Worker_Success}=selected_worker_slice.actions;