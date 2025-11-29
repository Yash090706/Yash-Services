let express=require("express");
const mongoose=require("mongoose");
const { user_route } = require("./Routes/User_Routes");
const cors=require("cors");
const { worker_route } = require("./Routes/Worker_Routes");
let app=express();
require("dotenv").config();
// Parsing JSON Data
app.use(express.json());
// Cors To Connect Backend with Frontend
app.use(cors({origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Cookies Parser
const cookie_parser=require("cookie-parser");
const { service_routes } = require("./Routes/ServiceRoutes");
app.use(cookie_parser());
// Static Routes
// Customer
app.use("/yash-services/customer",user_route);
// Worker
app.use("/yash-services/worker",worker_route);
// Service Routes
app.use("/yash-services/services",service_routes);
// App's MiddleWare
app.use((err,req,res,next)=>{
    const statuscode=err.statuscode || 500;
    const message=err.message || "Internal Server Error."

    res.status(statuscode).json({
        success:false,
        statuscode,
        message

    })
})
// Mongo Db Connection
mongoose.connect(process.env.MONGO_DB_URL).then(()=>{
    console.log("Connected To Mongo DB SuccessFully.")
}).catch((error)=>{
    console.log(error)
})
app.listen(process.env.PORT_NUMBER,()=>{
    console.log("Server is Running on Port "+process.env.PORT_NUMBER)
})