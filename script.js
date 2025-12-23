"use strict";

// Creates the playing field and places the symbols on the field
const gameboard = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];

  function createBoard() {
    for (let i = 0; i < rows; i++) {
      board[i] = [];

      for (let j = 0; j < columns; j++) {
        board[i].push("");
      }
    }
  }

  createBoard();

  return board;
})();

// Factory  takes a name, symbol and can place the symbol
const Player = (name, symbol) => ({
  name,
  symbol,
  placeSymbol: (board, row, column) => {
    if (!board[row][column]) {
      board[row][column] = symbol;
      return true;
    } else {
      return false;
    }
  },
});

//Updates the board. Updates the score. Switches turns.
function gameController(player1, player2) {
  const board = gameboard;

  function checkBoardState(board) {
    const rows = board.map((x) => x);

    const columns = board.map((x, key) => {
      return board.map((y) => y[key]);
    });

    const diagonals = (() => {
      const firstDiagonal = board.map((x, key) => x[key]);
      const secondDiagonal = board.map((x, key) => x[board.length - 1 - key]);

      return [firstDiagonal, secondDiagonal];
    })();

    return [...rows, ...columns, ...diagonals];
  }

  function checkWin() {
    const boardState = checkBoardState(board);

    if (boardState.some((x) => x.toString() === "x,x,x")) {
      console.log("Player1 Wins");
      return 1;
    } else if (boardState.some((x) => x.toString() === "o,o,o")) {
      console.log("Player2 Wins");
      return 1;
    }
  }

  const players = [player1, player2];

  for (let index = 0; index < 9; index++) {
    const player = players[index % 2];

    let placed = false;
    while (!placed) {
      placed = player.placeSymbol(
        board,
        prompt("Choose a row"),
        prompt("Choose a column")
      );
    }

    if (checkWin() === 1) {
      break;
    }
  }

  console.log("It's a draw");
}

const player1 = Player("player1", "x");
const player2 = Player("player2", "o");

gameController(player1, player2);
