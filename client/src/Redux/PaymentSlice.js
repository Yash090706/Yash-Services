import { createSlice } from "@reduxjs/toolkit";

const initialState={
    paymentinfo:[],
    error:false
}

const payment_slice=createSlice({
    name:"payment_slice",
    initialState,
    reducers:{
        PaymentSuccess:(state,action)=>{
            state.paymentinfo=action.payload

        },
        PaymentFailed:(state,action)=>{
            state.error=action.payload
        }
    }
})


export default payment_slice.reducer
export const {PaymentSuccess,PaymentFailed} =payment_slice.actions