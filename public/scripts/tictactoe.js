const fullscreenBtn = document.getElementById('fullscreenBtn');
const cells = document.querySelectorAll('.cell');
const winnerText = document.getElementById('winner');
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill('');
let currentPlayer = 'X';
let playerSymbol = 'X';
let botSymbol = 'O';
let gameActive = true;
let selectedIndex = 0;
let lastUpdate = 0;
const DEBOUNCE_TIME = 200;
let playerSelected = false;
let gamepadInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    document.querySelectorAll('.player-choice button').forEach(button => {
        button.addEventListener('click', () => setPlayer(button.getAttribute('data-symbol')));
    });

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));

    window.addEventListener("gamepadconnected", () => {
        console.log("Gamepad connected!");
        document.body.classList.add('gamepad-active');
        pollGamepad();
    });

    window.addEventListener("gamepaddisconnected", () => {
        console.log("Gamepad disconnected!");
        document.body.classList.remove('gamepad-active');
    });


    updateSelectedCell(selectedIndex);
});

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.error(`Error: ${err.message}`));
    } else {
        document.exitFullscreen();
    }
}

function pollGamepad() {
    if (gamepadInterval) {
        clearInterval(gamepadInterval);
    }

    gamepadInterval = setInterval(() => {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gp = gamepads[0]; 

        if (gp) {
            const now = Date.now();
            const dpadUp = gp.buttons[12].pressed; 
            const dpadDown = gp.buttons[13].pressed; 
            const dpadLeft = gp.buttons[14].pressed; 
            const dpadRight = gp.buttons[15].pressed;
            const l1 = gp.buttons[4].pressed; 
            const r1 = gp.buttons[5].pressed; 

            if (dpadUp && now - lastUpdate > DEBOUNCE_TIME) {
                changeSelection(-3);
                lastUpdate = now;
            }
            if (dpadDown && now - lastUpdate > DEBOUNCE_TIME) {
                changeSelection(3);
                lastUpdate = now;
            }
            if (dpadLeft && now - lastUpdate > DEBOUNCE_TIME) {
                changeSelection(-1);
                lastUpdate = now;
            }
            if (dpadRight && now - lastUpdate > DEBOUNCE_TIME) {
                changeSelection(1);
                lastUpdate = now;
            }

            if (gp.buttons[0].pressed) { 
                handleCellClick({ target: cells[selectedIndex] });
            }

            if (l1 && now - lastUpdate > DEBOUNCE_TIME) {
                setPlayer('X');
                lastUpdate = now;
            }

            if (r1 && now - lastUpdate > DEBOUNCE_TIME) { 
                setPlayer('O');
                lastUpdate = now;
            }
        }
    }, 100);
}


function changeSelection(delta) {
    const newIndex = Math.max(0, Math.min(8, selectedIndex + delta));
    updateSelectedCell(newIndex);
}

function updateSelectedCell(newIndex) {
    if (document.body.classList.contains('gamepad-active')) {
        cells[selectedIndex].classList.remove('selected');
        selectedIndex = newIndex;
        cells[selectedIndex].classList.add('selected');
    }
}


function setPlayer(symbol) {
    if (!gameActive || playerSelected) return;

    playerSymbol = symbol;
    botSymbol = symbol === 'X' ? 'O' : 'X';
    currentPlayer = 'X';
    document.querySelector('.player-choice').style.display = 'none';
    playerSelected = true;

    if (playerSymbol === 'O') botTurn();
}

function handleCellClick(e) {
    if (!playerSelected || !gameActive || currentPlayer !== playerSymbol) return;

    const index = e.target.getAttribute('data-index');
    if (board[index]) return;

    updateBoard(index, currentPlayer);
    checkResult();

    if (gameActive) botTurn();
}

function updateBoard(index, player) {
    board[index] = player;
    cells[index].textContent = player;
}

function checkResult() {
    const roundWon = winningConditions.some(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);

    if (roundWon) {
        winnerText.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        winnerText.textContent = 'Draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function botTurn() {
    if (!gameActive) return;

    setTimeout(() => {
        const move = getBestMove();
        updateBoard(move, botSymbol);
        checkResult();
        currentPlayer = playerSymbol;
    }, 500);
}

function getBestMove() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = botSymbol;
            if (checkWin(botSymbol)) return i;
            board[i] = '';
        }
    }

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = playerSymbol;
            if (checkWin(playerSymbol)) return i;
            board[i] = '';
        }
    }

    const availableMoves = board.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function checkWin(player) {
    return winningConditions.some(condition => condition.every(index => board[index] === player));
}

function resetGame() {
    board.fill('');
    gameActive = true;
    currentPlayer = 'X';
    winnerText.textContent = '';
    cells.forEach(cell => cell.textContent = '');
    document.querySelector('.player-choice').style.display = 'block';
    playerSelected = false;
}