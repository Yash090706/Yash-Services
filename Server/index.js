let express = require("express");
const mongoose = require("mongoose");
const { user_route } = require("./Routes/User_Routes");
const cors = require("cors");
const { worker_route } = require("./Routes/Worker_Routes");
const { WebSocketServer } = require("ws");
const http = require("http");
const {Server}=require("socket.io")
const path=require("path")
// const clients=require("./web_sockets_clients");
const {messageModel}=require("./Models/MessageModel")
// const __dirname=path.resolve()
require("dotenv").config();
let app = express();
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
const errorhandler = require("./Middleware/custom_error");
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
wss.on("connection",async(ws,req)=>{
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
  // Deliver Pending messages

  const pendingMessages=await messageModel.find({receiverId:userId,delivered:false})

  if (pendingMessages.length > 0) {
  for (const msg of pendingMessages) {
    ws.send(JSON.stringify(msg));
  }
  await messageModel.updateMany(
    { receiverId: userId, delivered: false },
    { $set: { delivered: true } }
  );
  console.log(`Delivered ${pendingMessages.length} pending messages to ${userId}`);
}
  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg);
      console.log("Server received message:", data);

      const { senderId, receiverId, roomId, text } = data;

      // Save to DB
      const newMsg = await messageModel.create({
        roomId,
        senderId,
        receiverId,
        text,
        delivered: false,
      });

      // Send to receiver if online
      const recvWs = clients[receiverId];
      if (recvWs && recvWs.readyState === WebSocket.OPEN) {
        recvWs.send(JSON.stringify(newMsg));
        await messageModel.findByIdAndUpdate(newMsg._id, { delivered: true });
      }

      // Optionally send to sender as confirmation
      ws.send(JSON.stringify(newMsg))
    }

    catch (err) {
      console.error("Error handling message:", err);
    }
  });
  
  ws.on("close",()=>{
    delete clients[userId]
    if (ws.rid && rooms.has(ws.rid)) {
      rooms.get(ws.rid).delete(ws);
    }

       console.log("WS Disconnected:", userId);
  })


})

// Location Socket
const io=new Server(server,{
  cors:{
    origin:"*"
  }
}) 

io.on("connection",(socket)=>{
  console.log("Client/Worker Connected with Socket Id - ",socket.id)

  socket.on("JOIN",(data)=>{
    const {rid}=data
    socket.join(rid)
    socket.rid=rid
    console.log(`Socket ${socket.id} Joined Room ${rid}`);
  })

  socket.on("LOCATION",(data)=>{
    const {rid,lat,lon}=data

    io.to(rid).emit("LOCATION",{
      lat,lon
    })

  })
   socket.on("STATUS", (data) => {
    const {rid,status}=data
    io.to(rid).emit("STATUS",{
      rid,status
    });
  });

  socket.on("disconnect",()=>{
    console.log(`Client/Worker Disconnected ${socket.id}`)
  })

})
app.use(express.static(path.join(__dirname,"../client/dist")))

app.use((req,res)=>{
  res.sendFile(path.join(__dirname,"../client/dist/index.html"))

})

server.listen(process.env.PORT_NUMBER, () => {
  console.log("Server is Running on Port an Socket " + process.env.PORT_NUMBER);
});
module.exports={clients,server};






























