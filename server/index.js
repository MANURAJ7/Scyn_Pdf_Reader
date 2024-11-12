const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);

const port = 3001;

const io = new Server(httpServer, {
  cors: {
    origin: `http://localhost:3000`,
    methods: ["GET", "POST"],
  },
});

let roomDetails = {};

const createRoom = (socketId, roomId, url) => {
  const newRoom = {
    admin: socketId,
    url: url,
    page: 1,
  };
  roomDetails[roomId] = newRoom;
};

io.on("connection", (socket) => {
  console.log(socket.id, " connected!!");
  socket.on("create_room", (roomId, url) => {
    if (!roomDetails[roomId]) {
      //if room doesn't exists
      socket.join(roomId);
      createRoom(socket.id, roomId, url);
      socket.emit("join_room_res_event", 1, true, url, roomId);
      console.log(socket.id, " created room ", roomId);
    } else {
      //if room exists join the user
      socket.join(roomId);
      socket.emit(
        "join_room_res_event",
        roomDetails[roomId].page,
        false,
        roomDetails[roomId].url,
        roomId
      );
      console.log(socket.id, " joined room ", roomId);
    }
  });
  socket.on("join_room_req_event", (roomId) => {
    if (!roomDetails[roomId]) {
      // if room does not exists
      socket.emit("join_room_res_event", -1, false, "", roomId);
    } else {
      //if room exists join the user
      socket.join(roomId);
      socket.emit(
        "join_room_res_event",
        roomDetails[roomId].page,
        false,
        roomDetails[roomId].url,
        roomId
      );
      console.log(roomDetails[roomId].page, "page sent");
    }
  });
  socket.on("change_page", (pageNo, roomId) => {
    console.log("new page: ", pageNo, "in", roomId);
    if (roomDetails[roomId] && socket.id === roomDetails[roomId].admin) {
      roomDetails[roomId].page = pageNo;
      io.to(roomId).emit("page_update_event", pageNo);
    } else {
      socket.emit("error", "Invalid request from you");
    }
  });
});

httpServer.listen(port, () => {
  console.log(`server started at ${port}`);
});
