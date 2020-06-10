class RtgGame {
  constructor(p1, p2) {
    this._players = [p1, p2];

    //capture the turn in _turns[]
    this._turns = [null, null];

    this._sendToPlayers("You have matched an existing player!");

    this._players.forEach((player, index) => {
      player.on("turn", (turn) => {
        this._onTurn(index, turn);
        console.log(`The selected turn is ${turn}`);
      });
    });
  }

  //Send each individual players feedback of the selection
  _sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit("message", msg);
  }

  //send both players the arguments of the function which is the "You have matched an existing player!".
  _sendToPlayers(msg) {
    this._players.forEach((player) => player.emit("message", msg));
  }

  //Capture the turn of each players
  _onTurn(playerIndex, turn) {
    this._turns[playerIndex] = turn;
    this._sendToPlayer(playerIndex, `You selected ${turn}`);

    this._checkGameOver();
  }

  _checkGameOver() {
    const turns = this._turns;

    if (turns[0] && turns[1]) {
      this._sendToPlayers("Game Over! " + turns.join(" : "));
      this._turns = [null, null];
      this._sendToPlayers("Next Round!");
    }
  }
}

module.exports = RtgGame;
