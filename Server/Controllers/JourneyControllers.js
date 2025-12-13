const errorhandler=require("../Middleware/custom_error")
// const express=require("express")
const {journey_model}=require("../Models/JourneyModel");
// const {server}=require("../index")
// const {WebSocketServer}=require("ws")
const journey=async(req,res,next)=>{
    const{uid,wid,j_hid,u_add,w_add,status,date_time}=req.body;

    if(!uid || !wid || !j_hid){
        return next(errorhandler(404,"Not Found"))
    }
    try{
        const journey_info=journey_model({
            uid,wid,j_hid,u_add,w_add,status,date_time
        })
        await journey_info.save();

        res.status(200).json({
            status:1,
            msg:" Journey Info Saved"
        })

        // await journey_info.deleteOne({j_hid:j_hid});

    }
    catch(err){
        return next(errorhandler(500,err.message))
    }
}
const get_journey_address=async(req,res,next)=>{
    const {rid}=req.params
    if(!rid){
        return next(errorhandler(404,"Not Found"))
    }
    const address_info=await journey_model.findOne({j_hid:rid})

    res.status(200).json({
        status:1,
        address_info
    })


}

// const wss= new WebSocketServer({server})

// const rooms=new Map();
// wss.on("connection",(ws,req)=>{
    // ws.on("message",(data)=>{
        // const msg=JSON.parse(data)
// 
        // if(msg.type == "JOIN"){
            // ws.rid=msg.rid
// 
            // if(!rooms.has(msg.rid)){
                // rooms.set(msg.rid,new Set())
            // }
// 
            // rooms.get(msg.rid).add(ws)
        // }
// 
        // if(msg.type=="LOCATION"){
            // const clients=rooms.get(msg.rid);
// 
            // if(!clients){
                // return;}
                // clients.forEach((client)=>{
                    // if(client.readyState == WebSocket.OPEN){
                        // client.send(JSON.stringify({
                            // type:"Location",
                            // lat:msg.lat,
                            // lon:msg.lon
                    // }))
                    // }
                // })
// 
        // }
// 
    // })
    // ws.on("close",()=>{
        // if(ws.rid && rooms.has(rid)){
            // rooms.get(ws.rid).delete(ws)
        // }
    // })
// 
// })
// 
// console.log("WebSocket of Maps Running")




module.exports={journey,get_journey_address}
