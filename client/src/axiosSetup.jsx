import axios from "axios";
import { store } from "./Redux/Store/store";
import { USignOut } from "./Redux/UserSlice";
import { toast } from "react-toastify";
import { WSignOut } from "./Redux/WorkerSlice";

axios.defaults.withCredentials=true;
axios.interceptors.response.use(
    (response)=>response,
    (error)=>{
        const status=error.response?.status;
        if(status === 401 || status===402 || status===403){
            toast.error("Token is Expired ! Sign in Again.")

            const state=store.getState();
            // store.dispatch(WSignOut());
            if(state.user.userinfo){
                store.dispatch(USignOut())
            }
            if(state.worker.workerinfo){
                store.dispatch(WSignOut())
            }

            setTimeout(()=>{
                window.location.href="/signin"
            },8000)
        }
        return Promise.reject(error);
    }
)

export default axios;