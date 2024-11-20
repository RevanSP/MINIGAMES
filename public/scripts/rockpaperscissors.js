const fullscreenBtn = document.getElementById('fullscreenBtn');
const choices = document.querySelectorAll('.choice');
const resultDiv = document.getElementById('result');
const scoreDiv = document.getElementById('score');
let playerScore = 0;
let computerScore = 0;
let gamepadIndex = null;
let lastGamepadInput = null;

const controllerButtons = {
    playstation: { 'cross': 0, 'circle': 1, 'triangle': 2 },
    xbox: { 'a': 0, 'b': 1, 'y': 3 }
};

fullscreenBtn.addEventListener('click', () => {
    document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(console.error);
});

choices.forEach(choice => choice.addEventListener('click', e => playGame(e.currentTarget.id)));

function playGame(playerChoice) {
    const computerChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
    const winner = getWinner(playerChoice, computerChoice);
    showResult(winner, playerChoice, computerChoice);
    updateScore(winner);
}

function getWinner(player, computer) {
    if (player === computer) return 'draw';
    return (player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper') ? 'player' : 'computer';
}

function showResult(winner, player, computer) {
    resultDiv.textContent = winner === 'draw'
        ? `It's a draw! You both chose ${capitalize(player)}.`
        : winner === 'player'
            ? `You win! ${capitalize(player)} beats ${capitalize(computer)}.`
            : `You lose! ${capitalize(computer)} beats ${capitalize(player)}.`;
}

function updateScore(winner) {
    if (winner === 'player') playerScore++;
    else if (winner === 'computer') computerScore++;
    scoreDiv.textContent = `Player: ${playerScore} | Computer: ${computerScore}`;
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function resetGame() {
    playerScore = computerScore = 0;
    scoreDiv.textContent = 'Player: 0 | Computer: 0';
    resultDiv.textContent = 'Make your choice!';
}

function checkGamepadInput() {
    if (gamepadIndex === null) return;
    const gamepad = navigator.getGamepads()[gamepadIndex];
    if (!gamepad) return;

    const buttons = gamepad.buttons.length === 16 ? controllerButtons.playstation : controllerButtons.xbox;
    Object.keys(buttons).forEach(key => {
        if (gamepad.buttons[buttons[key]].pressed) {
            if (lastGamepadInput !== key) {
                lastGamepadInput = key;
                handleChoice(key);
            }
        } else if (lastGamepadInput === key) {
            lastGamepadInput = null;
        }
    });
}

function handleChoice(key) {
    const choicesMap = {
        'cross': 'rock', 'circle': 'paper', 'triangle': 'scissors',
        'a': 'rock', 'b': 'paper', 'y': 'scissors'
    };
    const playerChoice = choicesMap[key];
    playGame(playerChoice);
}

window.addEventListener('gamepadconnected', event => gamepadIndex = event.gamepad.index);
window.addEventListener('gamepaddisconnected', event => {
    if (gamepadIndex === event.gamepad.index) gamepadIndex = null;
    lastGamepadInput = null;
});

setInterval(checkGamepadInput, 100);