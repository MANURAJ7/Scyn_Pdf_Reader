import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Room from "./Pages/Room";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [roomDetails, setRoomDetails] = useState({});

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io.connect("http://localhost:3001");
    setSocket(newSocket);
    console.log(newSocket.id);

    // Clean up the socket connection on component unmount
    return () => {
      if (newSocket) newSocket.disconnect(); // Ensure to use .disconnect()
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-zinc-900 text-zinc-50">
      <Routes>
        <Route
          path="/"
          element={
            <Home
              socket={socket}
              roomDetails={roomDetails}
              setRoomDetails={setRoomDetails}
            />
          }
        />
        <Route
          path="/Room"
          element={
            <Room
              socket={socket}
              setRoomDetails={setRoomDetails}
              roomDetails={roomDetails}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
