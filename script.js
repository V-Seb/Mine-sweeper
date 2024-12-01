// Constants for the game
const gridSize = 10;  // 10x10 grid
const numMines = 15;  // Number of mines

let board = [];  
let gameOver = false;  
let cellsRevealed = 0;  

function initializeGame() {
    board = [];
    cellsRevealed = 0;
    gameOver = false;

    const boardElement = document.getElementById('board');
    boardElement.innerHTML = ''; 

    for (let row = 0; row < gridSize; row++) {
        const rowArray = [];
        for (let col = 0; col < gridSize; col++) {
            rowArray.push({
                revealed: false,
                flagged: false,
                mine: false,
                neighboringMines: 0
            });

            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => revealCell(row, col));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFlag(row, col);
            });
            boardElement.appendChild(cell);
        }
        board.push(rowArray);
    }

    // Place mines randomly
    placeMines();
    calculateNeighboringMines();
}

// Place mines randomly on the board
function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);

        if (!board[row][col].mine) {
            board[row][col].mine = true;
            minesPlaced++;
        }
    }
}

// Calculate the number of neighboring mines for each cell
function calculateNeighboringMines() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (board[row][col].mine) continue;

            let mineCount = 0;
            for (let r = row - 1; r <= row + 1; r++) {
                for (let c = col - 1; c <= col + 1; c++) {
                    if (r >= 0 && r < gridSize && c >= 0 && c < gridSize && board[r][c].mine) {
                        mineCount++;
                    }
                }
            }

            board[row][col].neighboringMines = mineCount;
        }
    }
}

// Reveal a cell when clicked
function revealCell(row, col) {
    if (gameOver || board[row][col].revealed || board[row][col].flagged) return;

    board[row][col].revealed = true;
    cellsRevealed++;

    const cellElement = document.getElementsByClassName('cell')[row * gridSize + col];
    cellElement.classList.add('revealed');

    if (board[row][col].mine) {
        cellElement.classList.add('mine');
        endGame('Game Over! You clicked on a mine.');
    } else {
        if (board[row][col].neighboringMines > 0) {
            cellElement.textContent = board[row][col].neighboringMines;
        }

        if (cellsRevealed === gridSize * gridSize - numMines) {
            endGame('You Win! All safe cells are revealed.');
        }

        // If the cell has no neighboring mines, reveal adjacent cells automatically
        if (board[row][col].neighboringMines === 0) {
            revealAdjacentCells(row, col);
        }
    }
}

// Reveal adjacent cells when a cell with no neighboring mines is revealed
function revealAdjacentCells(row, col) {
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < gridSize && c >= 0 && c < gridSize && !board[r][c].revealed) {
                revealCell(r, c);
            }
        }
    }
}

// Toggle the flag on a cell (right-click)
function toggleFlag(row, col) {
    if (gameOver || board[row][col].revealed) return;

    board[row][col].flagged = !board[row][col].flagged;
    const cellElement = document.getElementsByClassName('cell')[row * gridSize + col];

    if (board[row][col].flagged) {
        cellElement.classList.add('flagged');
    } else {
        cellElement.classList.remove('flagged');
    }
}

// End the game (either win or lose)
function endGame(message) {
    gameOver = true;
    alert(message);
}

// Reset the game when the reset button is clicked
document.getElementById('resetButton').addEventListener('click', initializeGame);

// Initialize the game when the page loads
initializeGame();
