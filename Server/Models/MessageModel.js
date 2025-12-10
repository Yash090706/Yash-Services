const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  roomId: { type: String, required: true },
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  delivered: { type: Boolean, default: false },
});

const messageModel=mongoose.model("Message",messageSchema);


module.exports={messageModel}