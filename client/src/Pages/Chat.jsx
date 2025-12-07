import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
const Chat = () => {
  //   this would be room id which would be common for both
  const { requestId } = useParams();
  const { userinfo } = useSelector((state) => state.user);
  const { workerinfo } = useSelector((state) => state.worker);
  const userId = userinfo?.others?._id || workerinfo?._id;
  // To store websocket connection so that later can be used.
  const [ws, setWS] = useState(null);
  // To store messages so that ca be displayed on ui.
  const [messages, setMessages] = useState([]);
  // To store what you are typing.
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!userId) {
      return;
    }
    console.log(
      `Chat Starting with Room Id as ${requestId} and User Id as ${userId}`
    );
    const socket = new WebSocket(
      `ws://localhost:8000/chat?userId=${userId}&roomId=${requestId}`
    );
    setWS(socket);

    // If any message comes
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };
    socket.onopen = () => {
      console.log("Chat Connected");
    };
    socket.onclose = () => {
      console.log("Chat Disconnected");
    };
    return () => socket.close();
  }, [userId, requestId]);
  const sendMsg = () => {
    if (!msg) {
      return;
    }
    ws.send(JSON.stringify({ sender: userId, message: msg }));
    setMsg("");
  };
  // const userId = userinfo?.others?._id || workerinfo?._id;
  return (
    <div className="p-6">
      <h1 className="font-mono text-3xl text-center mb-4">Chat</h1>
      <div className="bg-gray-200 h-[400px] p-4 overflow-y-scroll rounded-xl">
      
      
      
      {messages.map((m, index) => (
  <div
    key={index}
    className={`p-2 m-2 rounded-lg max-w-[60%] ${
      m.sender === userId ? "bg-blue-300 ml-auto" : "bg-green-300 mr-auto"
    }`}
  >
    {m.message}
  </div>
))}

      
      
      
      
      
      
      
      
      </div>
      <div className="flex mt-4 gap-2">
        <input
          className="flex-1 border p-2 rounded-xl"
          placeholder="Type message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
          <button
          className="bg-blue-500 text-white p-3 rounded-xl"
          onClick={sendMsg}
        >
          Send
        </button>

      </div>
    </div>
  );
};

export default Chat;
