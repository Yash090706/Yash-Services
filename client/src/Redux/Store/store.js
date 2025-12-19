import { combineReducers, configureStore } from "@reduxjs/toolkit";
import workerreducer from "../WorkerSlice"
import storage from "redux-persist/lib/storage"
import {persistReducer,persistStore} from "redux-persist"
import userreducer from "../UserSlice"
import sel_workerred from"../SelectedWorkerSlice"
import worker_reqReducer from "../WorkerRequestSlice"
import user_req_reducer from "../UserHireRequestSlice"
import journey_slice from "../JourneySlice"
import payment_slice from "../PaymentSlice"
const rootreducer=combineReducers({
    worker:workerreducer,
    user:userreducer,
    selected_worker:sel_workerred,
    worker_req_slice:worker_reqReducer,
    user_hire_request:user_req_reducer,
    journey:journey_slice,
    payment_slice:payment_slice


})
const persistconfig={
    key:"root",
    version:1,
    storage
}
const persistedReducer=persistReducer(persistconfig,rootreducer)
export const store=configureStore({
    reducer:
        persistedReducer,
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false,
    })

});

export const persistor=persistStore(store);
