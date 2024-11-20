document.getElementById('fullscreenBtn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(console.error);
    } else {
        document.exitFullscreen();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const gridCount = canvas.width / gridSize;

    let snake = [{ x: 10, y: 10 }];
    let direction = { x: 0, y: 0 };
    let food = { x: 5, y: 5 };
    let score = 0;

    let gamepadIndex = null;
    let lastUpdateTime = 0;
    const frameInterval = 100; 

    function gameLoop(timestamp) {
        if (timestamp - lastUpdateTime >= frameInterval) {
            moveSnake();
            if (checkCollision()) resetGame();
            else if (snake[0].x === food.x && snake[0].y === food.y) {
                score++;
                snake.push({});
                placeFood();
            }
            drawGame();
            lastUpdateTime = timestamp;
        }
        handleGamepadInput();
        requestAnimationFrame(gameLoop);
    }

    function drawGame() {
        ctx.fillStyle = '#1e1f20';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#FFE873';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? '#306998' : '#FFD43B';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });

        document.getElementById('score').textContent = score;
    }

    function moveSnake() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        snake.unshift(head);
        snake.pop();
    }

    function changeDirection(event) {
        const { keyCode } = event;
        const { x, y } = direction;
        if (keyCode === 37 && x === 0) direction = { x: -1, y: 0 }; 
        else if (keyCode === 38 && y === 0) direction = { x: 0, y: -1 };
        else if (keyCode === 39 && x === 0) direction = { x: 1, y: 0 }; 
        else if (keyCode === 40 && y === 0) direction = { x: 0, y: 1 }; 
    }

    function checkCollision() {
        const { x, y } = snake[0];
        return x < 0 || x >= gridCount || y < 0 || y >= gridCount || snake.slice(1).some(segment => segment.x === x && segment.y === y);
    }

    function placeFood() {
        food = { x: Math.floor(Math.random() * gridCount), y: Math.floor(Math.random() * gridCount) };
    }

    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        direction = { x: 0, y: 0 };
        score = 0;
        placeFood();
    }

    function handleGamepadInput() {
        if (gamepadIndex !== null) {
            const gamepad = navigator.getGamepads()[gamepadIndex];
            if (gamepad) {
                const [xAxis, yAxis] = gamepad.axes;
                if (xAxis < -0.5 && direction.x === 0) direction = { x: -1, y: 0 }; 
                else if (xAxis > 0.5 && direction.x === 0) direction = { x: 1, y: 0 }; 
                else if (yAxis < -0.5 && direction.y === 0) direction = { x: 0, y: -1 };
                else if (yAxis > 0.5 && direction.y === 0) direction = { x: 0, y: 1 }; 
            }
        }
    }

    window.addEventListener('gamepadconnected', (event) => {
        gamepadIndex = event.gamepad.index;
        console.log('Gamepad connected:', event.gamepad);
    });

    window.addEventListener('gamepaddisconnected', (event) => {
        if (gamepadIndex === event.gamepad.index) gamepadIndex = null;
        console.log('Gamepad disconnected:', event.gamepad);
    });

    document.addEventListener('keydown', changeDirection);

    const buttonControls = {
        'upBtn': { x: 0, y: -1 },
        'downBtn': { x: 0, y: 1 },
        'leftBtn': { x: -1, y: 0 },
        'rightBtn': { x: 1, y: 0 }
    };

    Object.entries(buttonControls).forEach(([id, dir]) => {
        document.getElementById(id).addEventListener('click', () => {
            if (direction.x === 0 && dir.x !== 0 || direction.y === 0 && dir.y !== 0) {
                direction = dir;
            }
        });
    });

    requestAnimationFrame(gameLoop);
});