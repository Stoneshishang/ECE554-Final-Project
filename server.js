const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const RtgGame = require("./rtg-game");

const app = express();

const clientPath = `${__dirname}/client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);
const io = socketio(server);

let waitingPlayer = null;

io.on("connection", (sock) => {
  if (waitingPlayer) {
    //start a game
    new RtgGame(waitingPlayer, sock);
    [sock, waitingPlayer].forEach((s) =>
      s.emit("initialMessage", "We have two players now! Start chatting!")
    );
    sock.emit("player2Identifier", "You are Player 2!");
    waitingPlayer = null;
  } else {
    waitingPlayer = sock;
    waitingPlayer.emit(
      "initialMessage",
      " Your are Player 1, waiting for an opponent..."
    );
  }

  const users = {};

  sock.on("new-user", (name) => {
    users[sock.id] = name;
    sock.broadcast.emit("user-connected", name);
  });

  sock.on("send-chat-message", (message) => {
    sock.broadcast.emit("chat-message", {
      message: message,
      name: users[sock.id],
    });
  });
});

server.on("error", (err) => {
  console.error("Server error: ", err);
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

server.listen(port, () => {
  console.log("RTG started on 3000");
});
