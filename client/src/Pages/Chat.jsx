import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useRef } from "react";
import userimg from "../assets/userimg.jpg";
const Chat = () => {
  const { requestId, senderId, receiverId, senderName } = useParams();
  console.log("Chat params:", {
    requestId,
    senderId,
    receiverId,
    pathname: window.location.pathname,
  });

  const [ws, setWS] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const messageref = useRef(null);

  const scrollToBottom = () => {
    messageref.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!senderId || !receiverId) {
      console.error(
        "Chat: missing senderId or receiverId — cannot open socket"
      );
      return;
    }
    const fetch_history = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/yash-services/services/messages/history?roomId=${requestId}`
        );
        setMessages(res.data.messages);
      } catch (err) {
        console.log(err);
      }
    };
    fetch_history();

    const socket = new WebSocket(
      `ws://localhost:8000/chat?userId=${senderId}&roomId=${requestId}`
    );
    setWS(socket);

    socket.onopen = () => {
      console.log("WebSocket connected");
    };
    socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error("Error parsing WS message", err);
      }
    };
    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
    socket.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    return () => {
      socket.close();
    };
  }, [requestId, senderId, receiverId]);

  const sendMsg = () => {
    if (!msg.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;

    const payload = {
      senderId,
      receiverId,
      roomId: requestId,
      text: msg.trim(),
    };
    console.log("Sending message:", payload);

    ws.send(JSON.stringify(payload));
    setMsg("");
  };

  if (!senderId || !receiverId) {
    return <p>Error: invalid chat URL — missing participants.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="font-mono text-3xl text-center mb-2">Chat</h1>
      <div className="bg-gray-200 w-[900px] mx-auto p-3 rounded-sm border border-gray-300 text-2xl font-mono flex flex-row gap-4">
        <img src={userimg} className="w-[50px] h-[50px] rounded-3xl object-cover"></img>
        <h1 className="ml-10 text-center">{senderName}</h1>
      </div>
      <div className="bg-gray-200 h-[450px] w-[900px] p-4 overflow-y-scroll mx-auto border border-gray-300">
        {/* <div className="bg-red-400 w-full h-[20px] static"></div> */}
        {messages.map((m, idx) => (
          <div
            key={idx}
            
            className={`p-2 m-2 rounded-lg max-w-[60%] ${
              m.senderId === senderId
                ? "bg-blue-300 ml-auto"
                : "bg-green-300 mr-auto"
            }`}
            
          >
            <p className={`text-xs text-gray-600 mb-1 ${
      m.senderId === senderId ? "text-right" : "text-left"
    }`}>
      {m.senderId === senderId ? "You" : senderName}
    </p>

            {m.text}
          </div>
        ))}
        <div ref={messageref}></div>
      </div>
      <div className="flex mt-4 gap-2 ml-100">
        <input
          className="border p-2 rounded-xl w-[500px]"
          placeholder="Type a message..."
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
