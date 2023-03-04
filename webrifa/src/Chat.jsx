import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { v4 } from "uuid";

const myId = v4();

const socket = io("http://localhost:8080");
socket.on("connect", () => {
  console.log("[IO] Connect => a new connection has been established");
});

const Chat = () => {
  const [message, updateMessage] = useState("");
  const [messages, updateMessages] = useState([]);

  useEffect(() => {
    const handleNewMessage = (message) =>
      updateMessages([...messages, message]);

    socket.on("chat.message", (message) => {
      handleNewMessage(message);
    });
    return () => {
      socket.off("chat.message", handleNewMessage);
    };
  }, [messages]);

  const handleMessage = ({ target: { value } }) => updateMessage(value);
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (message.trim()) {
      socket.emit("chat.message", {
        message: message,
        id: myId,
      });
      updateMessage("");
    }
  };

  return (
    <main className="container">
      <ul className="list">
        {messages.map((m) => (
          <li
            key={m.id}
            className={`list__item list__item--${
              m.id === myId ? "mine" : "other"
            }`}
          >
            <span
              className={`message message--${m.id === myId ? "mine" : "other"}`}
            >
              {m.message}
            </span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleFormSubmit} className="form">
        <input
          onChange={handleMessage}
          placeholder="Digite uma mensagem..."
          className="form__field"
          type="text"
          value={message}
        />
      </form>
    </main>
  );
};
export default Chat;
