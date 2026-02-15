"use strict";

(() => {
  const playerNameForm = document.querySelector("#playerNameForm");
  const showBtn = document.querySelector("#newGameBtn");
  const confirmBtn = document.querySelector("#confirmBtn");
  const resetBtn = document.querySelector("#resetBtn");
  const playerOneName = document.querySelector("#playerOne");
  const playerTwoName = document.querySelector("#playerTwo");
  const playerOneField = document.querySelector("#playerOneSection");
  const playerTwoField = document.querySelector("#playerTwoSection");

  // Game starts in non active state
  let gameStarted = 0;

  // Open dialog box
  showBtn.addEventListener("click", () => {
    playerNameForm.showModal();
  });

  // Get input value from dialog box and start game
  confirmBtn.addEventListener("click", (event) => {
    event.preventDefault();

    playerOneField.children[1].innerText = playerOneName.value;
    playerTwoField.children[1].innerText = playerTwoName.value;
    playerOneField.children[3].innerText = player1.score;
    playerTwoField.children[3].innerText = player2.score;

    gameStarted = 1;
    gameController(gameStarted, player1, player2);

    playerNameForm.close();
    showBtn.style.display = "none";
    resetBtn.style.display = "block";
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
        playerOneField.children[3].innerText = player1.score;
        return 1;
      } else if (boardState.some((x) => x.toString() === "o,o,o")) {
        console.log("Player2 Wins");
        player2.score++;
        playerTwoField.children[3].innerText = player2.score;
        return 1;
      }
    }

    const renderedBoard = document.querySelector("#gameboard");
    const players = [player1, player2];
    let plays = 0;

    function playRound(e) {
      console.log(gameStarted);
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
        //renderedBoard.removeEventListener("click", playRound);
        plays = 0;
        setTimeout(() => clearBoard(board), 1000);
      } else if (plays === 9) {
        //renderedBoard.removeEventListener("click", playRound);
        console.log("It's a draw");
        plays = 0;
        setTimeout(() => clearBoard(board), 1000);
      }
    }

    if (gameStarted) {
      renderedBoard.addEventListener("click", playRound);
      resetBtn.addEventListener("click", () => {
        showBtn.style.display = "block";
        resetBtn.style.display = "none";

        resetGameState();

        renderedBoard.removeEventListener("click", playRound);

        console.log(player1.score);
      });
    }
  }

  const player1 = Player("player1", "x");
  const player2 = Player("player2", "o");

  function render(board) {
    const flatArr = board.flat();

    const htmlboard = document.querySelector("#gameboard");

    for (let i = 0; i < flatArr.length; i++) {
      htmlboard.children[i].children[0].innerText = flatArr[i];
      console.log({ htmlboard });
    }
  }

  //Reset Game
  function resetGameState() {
    const board = gameboard;
    gameStarted = 0;

    player1.score = 0;
    player2.score = 0;

    playerOneField.children[1].innerText = "";
    playerTwoField.children[1].innerText = "";
    playerOneField.children[3].innerText = "";
    playerTwoField.children[3].innerText = "";

    clearBoard(board);
  }

  function clearBoard(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j] = "";
      }
    }

    render(board);
  }
})();
