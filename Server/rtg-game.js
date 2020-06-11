var util = require("util");

class RtgGame {
  constructor(p1, p2) {
    this._players = [p1, p2];

    // console.log(`this._players is ${util.inspect(this._players[0])}`);

    //capture the turn in _turns[]
    this._turns = [null, null];

    this._player1Selections = [];
    this._player2Selections = [];

    this._sendToPlayers("You have matched an player!");

    this._players.forEach((player, index) => {
      player.on("turn", (turn) => {
        console.log(`the index is ${index}`);
        console.log(`The selected turn is ${turn}`);

        //if  at turn[0] which also means player 1, push the input into the array
        if (index === 0) {
          this._player1Selections.push(turn);
          this._onTurn(0, turn);

          console.log(
            `player1 Arr is ${JSON.stringify(this._player1Selections)}`
          );
        } else if (index === 1) {
          this._player2Selections.push(turn);
          this._onTurn(1, turn);

          console.log(
            `player2 Arr is ${JSON.stringify(this._player2Selections)}`
          );
        }
      });

      player.on("price", (price) => {
        this._onTurn(index, price);
        console.log(`the index is ${index}`);

        console.log(`The selected price is ${price}`);
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

  //Capture the turn of each players, control the game flow
  _onTurn(playerIndex, turn) {
    console.log(` _onTurn PlayerIndex is ${playerIndex}`);

    this._turns[playerIndex] = turn;
    this._sendToPlayer(
      playerIndex,
      `You have selected betting ${turn} for this turn.`
    );

    this._checkGameOver();
  }

  _checkGameOver() {
    console.log(`_checkGameOVer this._turns ${this._turns}`);
    const turns = this._turns;

    console.log(`Player1 Array is ${JSON.stringify(this._player1Selections)}`);
    console.log(`Player2 Array is ${JSON.stringify(this._player2Selections)}`);

    console.log(
      "*****************************************************************************"
    );

    if (
      (turns[0] || turns[1]) &&
      this._player1Selections[0] != 0 &&
      this._player1Selections[1] == undefined &&
      this._player1Selections[2] == undefined
    ) {
      this._sendToPlayers("You need to complete your betting in 10 seconds!");
    }

    if (
      this._player1Selections.length >= 3 &&
      this._player2Selections.length >= 3
    ) {
      this._sendToPlayers("Game Over! " + turns.join(" : "));
      this._player1Selections = [];
      this._player2Selections = [];
      this._sendToPlayers("Next Round!");
    }
  }

  // _callAPIforPrice() {}
}

module.exports = RtgGame;
