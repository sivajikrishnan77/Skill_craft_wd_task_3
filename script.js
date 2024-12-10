const board = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const statusMessage = document.getElementById('statusMessage');
const resetBtn = document.getElementById('resetBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const vsComputerBtn = document.getElementById('vsComputerBtn');
const winnerPopup = document.getElementById('winnerPopup');
const popupMessage = document.getElementById('popupMessage');

let currentPlayer = 'X';
let gameActive = true;
let gameState = Array(9).fill('');
let isVsComputer = false;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

// Game mode selection with alerts
twoPlayerBtn.addEventListener('click', () => {
    isVsComputer = false;
    alert('Game Mode: Two Player. Game starts now!');
    resetGame(); // Directly reset the game after alert
});

vsComputerBtn.addEventListener('click', () => {
    isVsComputer = true;
    alert('Game Mode: Play vs Computer. Game starts now!');
    resetGame(); // Directly reset the game after alert
});

// Click event for each cell
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Handle cell click
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    updateCell(clickedCell, clickedCellIndex);
    checkResult();

    if (isVsComputer && currentPlayer === 'O' && gameActive) {
        computerMoveHard();
    }
}

// Update cell with the current player's move
function updateCell(cell, index) {
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.style.pointerEvents = 'none';
}

// Check game result
function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
            continue;
        }
        if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusMessage.textContent = `Player ${currentPlayer} Wins!`;
        showPopupMessage(`Player ${currentPlayer} Wins!`);
        gameActive = false;
        return;
    }

    if (!gameState.includes('')) {
        statusMessage.textContent = 'Game is a Draw!';
        showPopupMessage('Game is a Draw!');
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusMessage.textContent = `Player ${currentPlayer}'s Turn`;
}

// Function to show the winner popup
function showPopupMessage(message) {
    popupMessage.textContent = message;
    winnerPopup.classList.add('show'); // Show the popup

    setTimeout(() => {
        winnerPopup.classList.remove('show'); // Hide popup after 3 seconds
        resetGame(); // Reset the game
    }, 3000); // 3000ms = 3 seconds
}

// Minimax Algorithm to make the computer play optimally
function computerMoveHard() {
    statusMessage.textContent = "Computer is thinking...";
    
    setTimeout(() => {
        let bestScore = -Infinity;
        let bestMove;

        // Find the best move using the Minimax algorithm
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'O'; // Assume computer is 'O'
                let score = minimax(gameState, 0, false);
                gameState[i] = ''; // Undo move
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        // Make the computer's best move
        const cell = cells[bestMove];
        updateCell(cell, bestMove);
        checkResult();
    }, 1000); // 1000 milliseconds = 1 second delay
}

// Minimax Algorithm to determine the best move
function minimax(boardState, depth, isMaximizing) {
    let winner = checkWinner();
    if (winner !== null) {
        if (winner === 'O') return 1;
        if (winner === 'X') return -1;
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === '') {
                boardState[i] = 'O';
                let score = minimax(boardState, depth + 1, false);
                boardState[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i] === '') {
                boardState[i] = 'X';
                let score = minimax(boardState, depth + 1, true);
                boardState[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check for a winner or a tie in Minimax
function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return gameState[a];
        }
    }

    if (!gameState.includes('')) {
        return 'tie';
    }

    return null;
}

// Reset the game
resetBtn.addEventListener('click', resetGame);

function resetGame() {
    currentPlayer = 'X';
    gameActive = true;
    gameState.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.pointerEvents = 'auto';
    });
    statusMessage.textContent = `Player ${currentPlayer}'s Turn`;
}
