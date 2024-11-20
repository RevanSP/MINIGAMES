document.addEventListener('DOMContentLoaded', () => {
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const buttons = document.querySelectorAll('.button');
    const message = document.getElementById('message');
    const startButton = document.getElementById('startButton');

    const colors = ['red', 'blue', 'green', 'yellow'];
    let sequence = [], playerSequence = [], isPlaying = false, canClick = false;
    let gamepadIndex = null;

    const playstationButtons = { 'circle': 0, 'cross': 1, 'triangle': 2, 'square': 3 };
    const xboxButtons = { 'b': 0, 'x': 1, 'a': 2, 'y': 3 };

    fullscreenBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen().catch(console.error);
        }
    });

    startButton.addEventListener('click', () => {
        if (!isPlaying) startGame();
    });

    function startGame() {
        sequence = [];
        playerSequence = [];
        isPlaying = true;
        canClick = false;
        message.textContent = 'Watch the sequence!';
        addToSequence();
        playSequence();
    }

    function addToSequence() {
        sequence.push(colors[Math.floor(Math.random() * colors.length)]);
    }

    function playSequence() {
        let index = 0;
        const interval = setInterval(() => {
            if (index >= sequence.length) {
                clearInterval(interval);
                playerSequence = [];
                message.textContent = 'Your turn!';
                canClick = true;
                enableButtons();
            } else {
                flashColor(sequence[index++]);
            }
        }, 1000);
    }

    function flashColor(color) {
        const button = document.getElementById(color);
        button.classList.add('flash');
        setTimeout(() => button.classList.remove('flash'), 500);
    }

    function handleButtonClick(event) {
        if (isPlaying && canClick && !playerSequence.includes(event.target.id)) {
            handleChoice(event.target.id);
        }
    }

    function handleChoice(color) {
        playerSequence.push(color);
        flashColor(color);
        if (checkSequence()) {
            if (playerSequence.length === sequence.length) {
                disableButtons();
                message.textContent = 'Correct! Next round!';
                setTimeout(() => {
                    addToSequence();
                    playSequence();
                }, 1000);
            }
        } else {
            message.textContent = 'Wrong sequence! Game over!';
            isPlaying = false;
        }
    }

    function checkSequence() {
        return playerSequence.every((color, i) => color === sequence[i]);
    }

    function enableButtons() {
        buttons.forEach(button => button.addEventListener('click', handleButtonClick));
    }

    function disableButtons() {
        buttons.forEach(button => button.removeEventListener('click', handleButtonClick));
    }

    function handleGamepadInput() {
        if (gamepadIndex !== null && isPlaying && canClick) {
            const gamepad = navigator.getGamepads()[gamepadIndex];
            if (gamepad) {
                if (gamepad.buttons.length === 16) {
                    if (gamepad.buttons[playstationButtons.circle].pressed) handleChoice('red');
                    else if (gamepad.buttons[playstationButtons.cross].pressed) handleChoice('blue');
                    else if (gamepad.buttons[playstationButtons.triangle].pressed) handleChoice('green');
                    else if (gamepad.buttons[playstationButtons.square].pressed) handleChoice('yellow');
                } else {
                    if (gamepad.buttons[xboxButtons.b].pressed) handleChoice('red');
                    else if (gamepad.buttons[xboxButtons.x].pressed) handleChoice('blue');
                    else if (gamepad.buttons[xboxButtons.a].pressed) handleChoice('green');
                    else if (gamepad.buttons[xboxButtons.y].pressed) handleChoice('yellow');
                }
            }
        }
    }

    window.addEventListener('gamepadconnected', (e) => {
        gamepadIndex = e.gamepad.index;
        console.log('Gamepad connected:', e.gamepad);
    });

    window.addEventListener('gamepaddisconnected', (e) => {
        if (gamepadIndex === e.gamepad.index) gamepadIndex = null;
        console.log('Gamepad disconnected:', e.gamepad);
    });

    setInterval(handleGamepadInput, 100);
});