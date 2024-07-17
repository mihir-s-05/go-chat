import React, {useState, useEffect, useRef} from "react";
import "./App.css";

const App = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(process.env.REACT_APP_WS_URL);

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setChat((prevChat) => [...prevChat, msg]);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() === "" || username.trim() === "") return;
    const msg = {username, content: message};
    ws.current.send(JSON.stringify(msg));
    setMessage("");
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-window">
          {chat.map((msg, index) => (
            <div key={index}>
            <strong>{msg.username}</strong>: {msg.content}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input 
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default App;