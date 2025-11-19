import { combineReducers, configureStore } from "@reduxjs/toolkit";
import workerreducer from "../WorkerSlice"
import storage from "redux-persist/lib/storage"
import {persistReducer,persistStore} from "redux-persist"

const rootreducer=combineReducers({
    worker:workerreducer
})
const persistconfig={
    key:"root",
    version:1,
    storage
}
const persistedReducer=persistReducer(persistconfig,rootreducer)
export const store=configureStore({
    reducer:{
        persistedReducer
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false,
    })

});

export const persistor=persistStore(store);
