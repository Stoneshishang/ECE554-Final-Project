const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const RtgGame = require("./rtg-game");

const app = express();

const clientPath = `${__dirname}/../client`;
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
      s.emit("message", "We have two players now!")
    );
    waitingPlayer = null;
  } else {
    waitingPlayer = sock;
    waitingPlayer.emit(
      "message",
      " Your are Player 1, waiting for an opponent..."
    );
  }

  sock.on("message", (text) => {
    io.emit("message", text);
  });
});

server.on("error", (err) => {
  console.error("Server error: ", err);
});

server.listen(3000, () => {
  console.log("RTG started on 3000");
});
