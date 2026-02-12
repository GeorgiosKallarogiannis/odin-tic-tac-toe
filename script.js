"use strict";

// Open dialog box
const playerNameForm = document.querySelector("#playerNameForm");
const showBtn = document.querySelector("#newGameBtn");
const confirmBtn = document.querySelector("#confirmBtn");
const playerOneName = document.querySelector("#playerOne");
const playerTwoName = document.querySelector("#playerTwo");
const playerOneField = document.querySelector("#playerOneSection");
const playerTwoField = document.querySelector("#playerTwoSection");

// Game starts in non active state
let gameStarted = 0;

showBtn.addEventListener("click", () => {
  playerNameForm.showModal();
});

// Get input value from dialog box and start game
confirmBtn.addEventListener("click", (event) => {
  event.preventDefault();

  playerOneField.children[0].innerText = playerOneName.value;
  playerTwoField.children[0].innerText = playerTwoName.value;

  gameStarted = 1;
  gameController(gameStarted, player1, player2);

  playerNameForm.close();
});

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
  score: 0,
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
function gameController(gameStarted, player1, player2) {
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
      player1.score++;
      return 1;
    } else if (boardState.some((x) => x.toString() === "o,o,o")) {
      console.log("Player2 Wins");
      player2.score++;
      return 1;
    }
  }

  const renderedBoard = document.querySelector("#gameboard");
  const players = [player1, player2];
  let plays = 0;

  if (gameStarted) {
    renderedBoard.addEventListener("click", function playRound(e) {
      const player = players[plays % 2];

      const validPlay = player.placeSymbol(
        board,
        e.target.dataset.row,
        e.target.dataset.column,
      );

      if (validPlay) {
        plays++;
      }

      render(board);

      if (checkWin()) {
        renderedBoard.removeEventListener("click", playRound);
      } else if (plays === 9) {
        renderedBoard.removeEventListener("click", playRound);
        console.log("It's a draw");
      }
    });
  }
}

const player1 = Player("player1", "x");
const player2 = Player("player2", "o");

function render(board) {
  const flatArr = board.flat();

  const htmlboard = document.querySelector("#gameboard");

  for (let i = 0; i < flatArr.length; i++) {
    htmlboard.children[i].innerText = flatArr[i];
  }
}

//Reset Game
const resetBtn = document.querySelector("#resetBtn");

function resetGameState() {
  const board = gameboard;
  gameStarted = 0;
  player1.score = 0;
  player2.score = 0;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      board[i][j] = "";
    }
  }

  render(board);
}

resetBtn.addEventListener("click", () => {
  resetGameState();
});
