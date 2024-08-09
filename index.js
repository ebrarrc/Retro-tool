const express = require("express");
const next = require("next");
const http = require("http");
const socketio = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = socketio(httpServer);

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("newCard", (data) => {
      io.emit("newCard", data);
    });

    socket.on("updateCard", (data) => {
      io.emit("updateCard", data);
    });

    socket.on("removeCard", (data) => {
      io.emit("removeCard", data);
    });

    socket.on("voteCard", (data) => {
      io.emit("voteCard", data);
    });
    
   socket.on("updateStep", (data) => {
     io.emit("updateStep", data);
   });
    socket.on("guestAdded", (roomId, guest) => {
      io.to(roomId).emit("guestAdded", guest);
    });

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
    });
    socket.on("updateActionPlan", (data) => {
      io.emit("updateActionPlan", data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
