import http from "http";
import WebSocket from "ws";
import express from "express";
import { Socket } from "dgram";
import { SocketAddress } from "net";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`🚀 Listening on http://localhost:3000 🚀`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const onSocketClose = () => console.log("💧 Disconnected from the Browser 💧");

const backSockets = [];

wss.on("connection", (backSocket) => {
  backSockets.push(backSocket);
  console.log("🔥 Connected to Browser 🔥");
  backSocket.on("close", onSocketClose);
  backSocket.on("message", (message) => {
    const parsed = JSON.parse(message);
    if (parsed.type === "new_message") {
      backSockets.forEach((aSocket) => aSocket.send(parsed.payload));
    }
  });
});

server.listen(3000, handleListen);
