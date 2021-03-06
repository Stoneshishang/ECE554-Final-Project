class RtgGame {
  constructor(p1, p2) {
    this._players = [p1, p2];

    //capture the turn in _turns[]
    this._turns = [null, null];

    this._player1Selections = [];
    this._player2Selections = [];

    this._initalMoney1 = 5000;
    this._initalMoney2 = 5000;

    this._players.forEach((player, index) => {
      player.on("turn", (turn) => {
        console.log(`the index is ${index}`);
        console.log(`The selected turn is ${turn}`);

        //if  at turn[0] which also means player 1, push the input into the array
        if (index === 0) {
          this._player1Selections.push(turn);
          this._onTurn(0, turn);
        } else if (index === 1) {
          this._player2Selections.push(turn);
          this._onTurn(1, turn);

          console.log(
            `player1 Arr is ${JSON.stringify(this._player1Selections)}`
          );

          console.log(
            `player2 Arr is ${JSON.stringify(this._player2Selections)}`
          );
        }
      });
    });
  }

  //Send each individual players feedback of the selection
  _sendToPlayer(playerIndex, msg) {
    this._players[playerIndex].emit("selections", msg);
  }

  //send both players the arguments of the function which is the "You have matched an existing player!".
  _sendToPlayers(msg) {
    this._players.forEach((player) => player.emit("selections", msg));
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
      this._player1Selections.length >= 4 &&
      this._player2Selections.length >= 4
    ) {
      this._sendToPlayers(
        "GAME OVER! The Real Time BTC prince at your selected time is " +
          turns[0]
      );

      this._getGameResult();
      this._player1Selections = [];
      this._player2Selections = [];
      this._sendToPlayers("NEXT TURN!");
    } else if (
      this._player1Selections.length != null &&
      this._player1Selections.length != 3 &&
      this._player2Selections.length == 4
    ) {
      this._sendToPlayers("GAME OVER! ");
      this._getGameResult();
      this._player1Selections = [];
      this._player2Selections = [];
      this._sendToPlayers("NEXT TURN!");
    } else if (
      this._player1Selections.length == 4 &&
      this._player2Selections.length != 3 &&
      this._player2Selections.length != null
    ) {
      this._sendToPlayers("GAME OVER! ");
      this._getGameResult();
      this._player1Selections = [];
      this._player2Selections = [];
      this._sendToPlayers("NEXT TURN!");
    } else if (
      this._player1Selections.length == 3 &&
      this._player2Selections.length == 4
    ) {
      this._sendToPlayers("Wait for Player 1 result is being triggered ");
      console.log(`Player 1 timer is triggered`);
      this._getGameResult();
      console.log(`player 1 result is fetched`);

      if (
        this._player1Selections.length == 4 &&
        this._player2Selections.length == 4
      ) {
        this._sendToPlayers("NEXT TURN!");
      }
    } else if (
      this._player1Selections.length == 4 &&
      this._player2Selections.length == 3
    ) {
      this._sendToPlayers("Wait for Player 2 result is being triggered ");
      console.log(`Player 2 timer is triggered`);
      this._getGameResult();
      console.log(`player 2 result is fetched`);

      if (
        this._player1Selections.length == 4 &&
        this._player2Selections.length == 4
      ) {
        this._sendToPlayers("NEXT TURN!");
      }
    }
  }

  _getGameResult() {
    const player1Diff = Math.abs(
      this._player1Selections[3] - this._player1Selections[1]
    );

    const player2Diff = Math.abs(
      this._player2Selections[3] - this._player2Selections[1]
    );

    console.log(`player1Diff is ${player1Diff}`);
    console.log(`player2Diff is ${player2Diff}`);

    if (
      this._player1Selections.length == 4 &&
      this._player2Selections.length == 4
    ) {
      if (player1Diff < player2Diff) {
        this._sendWinMessage(this._players[0], this._players[1]);

        if (this._initalMoney1 > 0 && this._initalMoney2 > 0) {
          this._initalMoney1 =
            this._initalMoney1 + Number(this._player2Selections[0]);
          this._initalMoney2 =
            this._initalMoney2 - Number(this._player2Selections[0]);

          this._sendToPlayers(
            `Player1 has $${this._initalMoney1} left, Player2 has $${this._initalMoney2} left`
          );

          console.log(`Player1 has $${this._initalMoney1} left`);
          console.log(`Player2 has $${this._initalMoney2} left`);
        } else if (this._initalMoney1 < 0 || this._initalMoney2 < 0) {
          this._sendToPlayers(
            "One player has out of money, He is OUT of the game"
          );
        }
      } else if (player1Diff > player2Diff) {
        this._sendWinMessage(this._players[1], this._players[0]);
        if (this._initalMoney1 > 0 && this._initalMoney2 > 0) {
          this._initalMoney1 =
            this._initalMoney1 - Number(this._player1Selections[0]);
          this._initalMoney2 =
            this._initalMoney2 + Number(this._player1Selections[0]);

          this._sendToPlayers(
            `Player1 has $${this._initalMoney1} left, Player2 has $${this._initalMoney2} left`
          );

          console.log(`Player1 has $${this._initalMoney1} left`);
          console.log(`Player2 has $${this._initalMoney2} left`);
        } else if (this._initalMoney1 < 0 || this._initalMoney2 < 0) {
          this._sendToPlayers(
            "One player has out of money, He is OUT of the game"
          );
        }
      } else if (player1Diff == player2Diff) {
        this._sendToPlayers(
          "It's a Drawl, becuase you guys selected the same betting price."
        );
      }
    } else if (
      this._player1Selections.length != 3 &&
      this._player2Selections.length == 4
    ) {
      console.log(
        `this._player1Selections length is ${this._player1Selections.length}`
      );

      this._sendWinMessage(this._players[1], this._players[0]);

      if (this._initalMoney1 > 0 && this._initalMoney2 > 0) {
        this._initalMoney1 =
          this._initalMoney1 - Number(this._player1Selections[0]);
        this._initalMoney2 =
          this._initalMoney2 + Number(this._player1Selections[0]);

        this._sendToPlayers(
          `Player1 has $${this._initalMoney1} left, Player2 has $${this._initalMoney2} left`
        );

        console.log(`Player1 has $${this._initalMoney1} left`);
        console.log(`Player2 has $${this._initalMoney2} left`);
      } else if (this._initalMoney1 < 0 && this._initalMoney2 > 0) {
        this._sendToPlayers("Player 1 has out of money, He is OUT of the game");
      } else if (this._initalMoney1 > 0 && this._initalMoney2 < 0) {
        this._sendToPlayers("Player 2 has out of money, He is OUT of the game");
      }
    } else if (
      this._player1Selections.length == 4 &&
      this._player2Selections.length != 3
    ) {
      this._sendWinMessage(this._players[0], this._players[1]);

      if (this._initalMoney1 > 0 && this._initalMoney2 > 0) {
        this._initalMoney1 =
          this._initalMoney1 + Number(this._player2Selections[0]);
        this._initalMoney2 =
          this._initalMoney2 - Number(this._player2Selections[0]);

        this._sendToPlayers(
          `Player1 has $${this._initalMoney1} left, Player2 has $${this._initalMoney2} left`
        );

        console.log(`Player1 has $${this._initalMoney1} left`);
        console.log(`Player2 has $${this._initalMoney2} left`);
      } else if (this._initalMoney1 < 0 && this._initalMoney2 > 0) {
        this._sendToPlayers("Player 1 has out of money, He is OUT of the game");
      } else if (this._initalMoney1 > 0 && this._initalMoney2 < 0) {
        this._sendToPlayers("Player 2 has out of money, He is OUT of the game");
      }
    } else if (
      this._player1Selections.length == 3 &&
      this._player2Selections.length == 4
    ) {
      let intervalCheck = function (arr) {
        return new Promise((resolve, reject) => {
          () => {
            if (arr.length == 3) {
              setInterval(() => {
                if (arr.length == 4) {
                  resolve(1);
                }
              }, 1000);
            } else {
              reject(Error("Player 1 array is not 4 yet"));
            }
          };
        });
      };

      intervalCheck(this._player1Selections)
        .then((checkResults) => {
          if (player1Diff < player2Diff) {
            this._sendWinMessage(this._players[0], this._players[1]);

            if (this._initalMoney1 > 0 && this._initalMoney2 > 0) {
              this._initalMoney1 =
                this._initalMoney1 + Number(this._player2Selections[0]);
              this._initalMoney2 =
                this._initalMoney2 - Number(this._player2Selections[0]);

              this._sendToPlayers(
                `Player1 has $${this._initalMoney1} left, Player2 has $${this._initalMoney2} left`
              );

              console.log(`Player1 has $${this._initalMoney1} left`);
              console.log(`Player2 has $${this._initalMoney2} left`);
            } else if (this._initalMoney1 < 0 || this._initalMoney2 < 0) {
              this._sendToPlayers(
                "One player has out of money, He is OUT of the game"
              );
            }
          } else if (player1Diff > player2Diff) {
            this._sendWinMessage(this._players[1], this._players[0]);
            if (this._initalMoney1 > 0 && this._initalMoney2 > 0) {
              this._initalMoney1 =
                this._initalMoney1 - Number(this._player1Selections[0]);
              this._initalMoney2 =
                this._initalMoney2 + Number(this._player1Selections[0]);

              this._sendToPlayers(
                `Player1 has $${this._initalMoney1} left, Player2 has $${this._initalMoney2} left`
              );

              console.log(`Player1 has $${this._initalMoney1} left`);
              console.log(`Player2 has $${this._initalMoney2} left`);
            } else if (this._initalMoney1 < 0 || this._initalMoney2 < 0) {
              this._sendToPlayers(
                "One player has out of money, He is OUT of the game"
              );
            }
          } else if (player1Diff == player2Diff) {
            this._sendToPlayers(
              "It's a Drawl, becuase you guys selected the same betting price."
            );
          }
          console.log(`checkResult is ${checkResults}`);

          clearInterval();
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (
      this._player1Selections.length == 4 &&
      this._player2Selections.length == 3
    ) {
      let intervalCheck = function (arr) {
        return new Promise((resolve, reject) => {
          () => {
            if (arr.length == 3) {
              setInterval(() => {
                if (arr.length == 4) {
                  resolve(1);
                }
              }, 1000);
            } else {
              reject(Error("Player 2 array is not 4 yet"));
            }
          };
        });
      };

      intervalCheck(this._player2Selections)
        .then((checkResults) => {
          if (player1Diff < player2Diff) {
            this._sendWinMessage(this._players[0], this._players[1]);

            if (this._initalMoney1 > 0 && this._initalMoney2 > 0) {
              this._initalMoney1 =
                this._initalMoney1 + Number(this._player2Selections[0]);
              this._initalMoney2 =
                this._initalMoney2 - Number(this._player2Selections[0]);

              this._sendToPlayers(
                `Player1 has $${this._initalMoney1} left, Player2 has $${this._initalMoney2} left`
              );

              console.log(`Player1 has $${this._initalMoney1} left`);
              console.log(`Player2 has $${this._initalMoney2} left`);
            } else if (this._initalMoney1 < 0 || this._initalMoney2 < 0) {
              this._sendToPlayers(
                "One player has out of money, He is OUT of the game"
              );
            }
          } else if (player1Diff > player2Diff) {
            this._sendWinMessage(this._players[1], this._players[0]);
            if (this._initalMoney1 > 0 && this._initalMoney2 > 0) {
              this._initalMoney1 =
                this._initalMoney1 - Number(this._player1Selections[0]);
              this._initalMoney2 =
                this._initalMoney2 + Number(this._player1Selections[0]);

              this._sendToPlayers(
                `Player1 has $${this._initalMoney1} left, Player2 has $${this._initalMoney2} left`
              );

              console.log(`Player1 has $${this._initalMoney1} left`);
              console.log(`Player2 has $${this._initalMoney2} left`);
            } else if (this._initalMoney1 < 0 || this._initalMoney2 < 0) {
              this._sendToPlayers(
                "One player has out of money, He is OUT of the game"
              );
            }
          } else if (player1Diff == player2Diff) {
            this._sendToPlayers(
              "It's a Drawl, becuase you guys selected the same betting price."
            );
          }
          console.log(`checkResult is ${checkResults}`);

          clearInterval();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  _sendWinMessage(winner, loser) {
    winner.emit("selections", "You WON!");
    winner.emit("timer", "enable the button");
    loser.emit("selections", "You LOST!");
    loser.emit("timer", "enable the button");
  }
}

module.exports = RtgGame;
