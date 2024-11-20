const fullscreenBtn = document.getElementById('fullscreenBtn');
const cards = document.querySelectorAll('.memory-card');
let currentIndex = 0, inputSource = null, gamepadIndex = null, lastInputTime = 0;
const inputDelay = 135;
let hasFlippedCard = false, lockBoard = false, firstCard, secondCard;

// Fullscreen toggle
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.error(`Error: ${err.message} (${err.name})`));
    } else {
        document.exitFullscreen();
    }
});

// Handle gamepad input
function handleGamepadInput() {
    const gamepad = gamepadIndex !== null ? navigator.getGamepads()[gamepadIndex] : null;
    if (gamepad && Date.now() - lastInputTime >= inputDelay) {
        lastInputTime = Date.now();
        inputSource = 'controller';

        const dpad = gamepad.axes, prevIndex = currentIndex;
        if (dpad[0] < -0.2) currentIndex = Math.max(currentIndex - 1, 0);
        else if (dpad[0] > 0.2) currentIndex = Math.min(currentIndex + 1, cards.length - 1);
        else if (dpad[1] < -0.2) currentIndex = Math.max(currentIndex - 4, 0);
        else if (dpad[1] > 0.2) currentIndex = Math.min(currentIndex + 4, cards.length - 1);

        if (gamepad.buttons[0].pressed) flipCard.call(cards[currentIndex]);
        if (currentIndex !== prevIndex) updateCardSelection();
    }
}

// Flip card logic
function flipCard() {
    if (lockBoard || this === firstCard) return;
    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

// Check if cards match
function checkForMatch() {
    firstCard.dataset.framework === secondCard.dataset.framework ? disableCards() : unflipCards();
}

// Disable matched cards
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    checkWin();
}

// Unflip non-matched cards
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500);
}

// Reset board
function resetBoard() {
    [hasFlippedCard, lockBoard, firstCard, secondCard] = [false, false, null, null];
}

// Check if player has won
function checkWin() {
    if (document.querySelectorAll('.flip').length === cards.length) {
        document.getElementById('winner').textContent = 'Congratulations! You Win!';
    }
}

// Shuffle cards
function shuffle() {
    cards.forEach(card => {
        card.style.order = Math.floor(Math.random() * cards.length);
    });
}

// Update card selection for controller
function updateCardSelection() {
    cards.forEach((card, index) => {
        card.classList.toggle('selected', index === currentIndex && inputSource === 'controller');
    });
}

// Reset game state
function resetGame() {
    // Reloads the current page
    window.location.reload();
}

// Main game loop for handling inputs
function gameLoop() {
    handleGamepadInput();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('gamepadconnected', event => gamepadIndex = event.gamepad.index);
window.addEventListener('gamepaddisconnected', event => {
    if (gamepadIndex === event.gamepad.index) gamepadIndex = null;
});

cards.forEach(card => card.addEventListener('click', flipCard));
requestAnimationFrame(gameLoop);
updateCardSelection();