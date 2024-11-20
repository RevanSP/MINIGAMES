const bird = document.getElementById('bird');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const gameOverText = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');

let birdY = 250, birdVelocity = 0, score = 0, gameInterval, pipeIntervalId, gamepadIndex = null;
const gravity = 0.5, jump = -8, pipeSpeed = 3, pipeInterval = 1500, pipeWidth = 60, pipeGap = 150;
let pipes = [];

// Prevent text selection and page scrolling on mobile
gameContainer.style.touchAction = 'none';

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    startGame();
});

fullscreenBtn.addEventListener('click', () => {
    document.fullscreenElement ? document.exitFullscreen() : gameContainer.requestFullscreen();
});

// Control bird jump using keyboard spacebar
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') birdVelocity = jump;
});

// Control bird jump using touch events
gameContainer.addEventListener('touchstart', () => {
    birdVelocity = jump;
});

window.addEventListener('gamepadconnected', (event) => {
    gamepadIndex = event.gamepad.index;
    console.log('Gamepad connected:', event.gamepad);
});

window.addEventListener('gamepaddisconnected', (event) => {
    if (gamepadIndex === event.gamepad.index) gamepadIndex = null;
    console.log('Gamepad disconnected:', event.gamepad);
});

function startGame() {
    birdY = 250;
    birdVelocity = 0;
    score = 0;
    pipes = [];
    scoreDisplay.textContent = score;
    gameOverText.style.display = 'none';
    restartBtn.style.display = 'none';
    gameInterval = setInterval(gameLoop, 20);
    pipeIntervalId = setInterval(createPipe, pipeInterval);
}

function gameLoop() {
    birdVelocity += gravity;
    birdY += birdVelocity;
    bird.style.top = birdY + 'px';

    if (birdY > gameContainer.offsetHeight - bird.offsetHeight || birdY < 0) return endGame();

    pipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;
        pipe.element.style.left = pipe.x + 'px';

        if (pipe.x < -pipeWidth) {
            pipes.splice(index, 1);
            score++;
            scoreDisplay.textContent = score;
        }

        if (isCollision(bird, pipe.element)) return endGame();
    });

    checkGamepadInput();
}

function checkGamepadInput() {
    if (gamepadIndex !== null) {
        const gamepad = navigator.getGamepads()[gamepadIndex];
        if (gamepad && gamepad.buttons[0].pressed) birdVelocity = jump;
    }
}

function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (gameContainer.offsetHeight - pipeGap - 100)) + 50;

    const pipeLower = document.createElement('div');
    pipeLower.classList.add('pipe');
    pipeLower.style.height = pipeHeight + 'px';
    pipeLower.style.left = gameContainer.offsetWidth + 'px';

    const pipeUpper = document.createElement('div');
    pipeUpper.classList.add('pipe', 'upper');
    pipeUpper.style.height = (gameContainer.offsetHeight - pipeHeight - pipeGap) + 'px';
    pipeUpper.style.left = gameContainer.offsetWidth + 'px';

    gameContainer.appendChild(pipeLower);
    gameContainer.appendChild(pipeUpper);

    pipes.push({ element: pipeLower, x: gameContainer.offsetWidth });
    pipes.push({ element: pipeUpper, x: gameContainer.offsetWidth });
}

function isCollision(bird, pipe) {
    const birdRect = bird.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();

    return !(birdRect.top > pipeRect.bottom || birdRect.bottom < pipeRect.top || birdRect.left > pipeRect.right || birdRect.right < pipeRect.left);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(pipeIntervalId);
    gameOverText.style.display = 'block';
    restartBtn.style.display = 'block';
    pipes.forEach(pipe => pipe.element.remove());
    pipes = [];
}

function restartGame() {
    startGame();
}
