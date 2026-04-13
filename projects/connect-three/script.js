// Basic game settings
const ROWS = 6;
const COLS = 3;

// Board state: each position starts empty
let boardState = [];
let currentPlayer = "P1";
let gameOver = false;
let isAnimating = false;
let winningCells = [];

// Fixed symbols for each player
const symbols = {
  P1: "X",
  P2: "O"
};

// Page elements
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

// Set up a fresh empty board
function createEmptyBoard() {
  boardState = [];

  for (let row = 0; row < ROWS; row++) {
    let currentRow = [];

    for (let col = 0; col < COLS; col++) {
      currentRow.push("");
    }

    boardState.push(currentRow);
  }
}

// Update the message area
function updateStatus(message) {
  statusText.textContent = message;
}

// Reset the game
function restartGame() {
  createEmptyBoard();
  currentPlayer = "P1";
  gameOver = false;
  isAnimating = false;
  winningCells = [];
  renderBoard();
  updateStatus("Player 1's turn (X)");
}

// Find the lowest empty row in the chosen column
function getLowestOpenRow(col) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (boardState[row][col] === "") {
      return row;
    }
  }

  return -1;
}

// Check if the board is full
function isBoardFull() {
  for (let col = 0; col < COLS; col++) {
    if (boardState[0][col] === "") {
      return false;
    }
  }

  return true;
}

// Check for 3 in a row
function checkWinner(player) {
  const directions = [
    [0, 1],   // horizontal
    [1, 0],   // vertical
    [1, 1],   // diagonal down-right
    [1, -1]   // diagonal down-left
  ];

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (boardState[row][col] !== player) {
        continue;
      }

      for (let i = 0; i < directions.length; i++) {
        let rowStep = directions[i][0];
        let colStep = directions[i][1];
        let line = [{ row: row, col: col }];
        let matched = true;

        for (let step = 1; step < 3; step++) {
          let newRow = row + rowStep * step;
          let newCol = col + colStep * step;

          if (
            newRow < 0 ||
            newRow >= ROWS ||
            newCol < 0 ||
            newCol >= COLS ||
            boardState[newRow][newCol] !== player
          ) {
            matched = false;
            break;
          }

          line.push({ row: newRow, col: newCol });
        }

        if (matched) {
          return line;
        }
      }
    }
  }

  return null;
}

// Draw the board on the page
function renderBoard(lastMove = null) {
  cells.forEach(function (cell) {
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    const disc = cell.querySelector(".disc");
    const value = boardState[row][col];

    cell.classList.remove("winning");
    disc.className = "disc";
    disc.textContent = "";

    if (value === "P1") {
      disc.classList.add("player1");
      disc.textContent = symbols.P1;
    } else if (value === "P2") {
      disc.classList.add("player2");
      disc.textContent = symbols.P2;
    } else {
      disc.classList.add("empty");
    }

    if (lastMove && lastMove.row === row && lastMove.col === col && value !== "") {
      disc.classList.add("drop");
    }

    for (let i = 0; i < winningCells.length; i++) {
      if (winningCells[i].row === row && winningCells[i].col === col) {
        cell.classList.add("winning");
      }
    }
  });
}

// Handle a click on any column
function handleColumnClick(col) {
  if (gameOver || isAnimating) {
    return;
  }

  const row = getLowestOpenRow(col);

  if (row === -1) {
    updateStatus("That column is full. Try a different one.");
    return;
  }

  // Place the disc
  boardState[row][col] = currentPlayer;
  isAnimating = true;

  renderBoard({ row: row, col: col });

  const playerWhoMoved = currentPlayer;

  // Wait for the short drop animation before checking the result
  setTimeout(function () {
    const winLine = checkWinner(playerWhoMoved);

    if (winLine) {
      winningCells = winLine;
      gameOver = true;
      isAnimating = false;
      renderBoard();
      updateStatus(
        (playerWhoMoved === "P1" ? "Player 1" : "Player 2") +
        " wins!"
      );
      return;
    }

    if (isBoardFull()) {
      gameOver = true;
      isAnimating = false;
      updateStatus("It's a draw. Press Restart to play again.");
      return;
    }

    currentPlayer = currentPlayer === "P1" ? "P2" : "P1";
    isAnimating = false;

    updateStatus(
      (currentPlayer === "P1" ? "Player 1's turn (X)" : "Player 2's turn (O)")
    );
  }, 350);
}

// Add click events to every cell
cells.forEach(function (cell) {
  cell.addEventListener("click", function () {
    const col = Number(cell.dataset.col);
    handleColumnClick(col);
  });
});

// Restart button
restartBtn.addEventListener("click", restartGame);

// Start the game once the page loads
restartGame();