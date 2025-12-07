let express = require("express");
const mongoose = require("mongoose");
const { user_route } = require("./Routes/User_Routes");
const cors = require("cors");
const { worker_route } = require("./Routes/Worker_Routes");
const { WebSocketServer } = require("ws");
const http = require("http");
// const clients=require("./web_sockets_clients");

let app = express();
require("dotenv").config();
const server = http.createServer(app);
// Parsing JSON Data
app.use(express.json());
// Cors To Connect Backend with Frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Cookies Parser
const cookie_parser = require("cookie-parser");
const { service_routes } = require("./Routes/ServiceRoutes");
app.use(cookie_parser());
// Static Routes
// Customer
app.use("/yash-services/customer", user_route);
// Worker
app.use("/yash-services/worker", worker_route);
// Service Routes
app.use("/yash-services/services", service_routes);
// App's MiddleWare
app.use((err, req, res, next) => {
  const statuscode = err.statuscode || 500;
  const message = err.message || "Internal Server Error.";

  res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});
// Mongo Db Connection
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Connected To Mongo DB SuccessFully.");
  })
  .catch((error) => {
    console.log(error);
  });
// Web Socket
const wss = new WebSocketServer({ server });

const clients={};
// in clients we will store socket connection of specific userid 
wss.on("connection",(ws,req)=>{
  ws.on("error",(err)=>console.log("Conection Error.",err))
  const url=new URL(req.url,"http://localhost")
  const userId=url.searchParams.get("userId")
  const roomId=url.searchParams.get("roomId")

  if(!userId){
    console.log("User Id Not Found So Closing Web Socket Connection")
    return ws.close()
  }
  ws.userId=userId
  ws.roomId=roomId

  clients[userId]=ws 
  // store socket connection to respective userid like userid123=wsconnection to find user later
  console.log("WS Connected | user:", userId, "| room:", roomId);
  ws.on("message",(msg)=>{
    const data=JSON.parse(msg)

    if(ws.roomId){
      wss.clients.forEach((client)=>{
        if(client.roomId === ws.roomId && client.readyState ===1){
          client.send(JSON.stringify(data))
        }
      })
    }
  })
  ws.on("close",()=>{
    delete clients[userId]
       console.log("WS Disconnected:", userId);
  })


})
server.listen(process.env.PORT_NUMBER, () => {
  console.log("Server is Running on Port an Socket " + process.env.PORT_NUMBER);
});

module.exports=clients;






























