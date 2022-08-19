import http from "http";
import WebSocket from "ws";
import express from "express";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`🚀 Listening on http://localhost:3000 🚀`);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

/* WebSocket
const wss = new WebSocket.Server({ server });

const onSocketClose = () => console.log("💧 Disconnected from the Browser 💧");

const backSockets = [];

wss.on("connection", (backSocket) => {
  backSockets.push(backSocket);
  backSocket["nickname"] = "Anonymous";
  console.log("🔥 Connected to Browser 🔥");
  backSocket.on("close", onSocketClose);
  backSocket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        backSockets.forEach((aSocket) => aSocket.send(`${backSocket.nickname}: ${message.payload}`));
        break;
      case "nickname":
        backSocket["nickname"] = message.payload;
        break;
    }
  }); 
}); */

httpServer.listen(3000, handleListen);
