// Fullscreen Toggle
const fullscreenBtn = document.getElementById('fullscreenBtn');
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.error(`Error: ${err.message}`));
    } else {
        document.exitFullscreen();
    }
});

// Game Variables
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const scoreBoard = document.getElementById('score');
let lastHole;
let timeUp = false;
let score = 0;

// Helper Functions
const randomTime = (min, max) => Math.round(Math.random() * (max - min) + min);
const randomHole = (holes) => {
    let hole;
    do {
        hole = holes[Math.floor(Math.random() * holes.length)];
    } while (hole === lastHole);
    lastHole = hole;
    return hole;
};

// Game Functions
const peep = () => {
    const time = randomTime(200, 1000);
    const hole = randomHole(holes);
    hole.querySelector('.mole').classList.add('up');
    setTimeout(() => {
        hole.querySelector('.mole').classList.remove('up');
        if (!timeUp) peep();
    }, time);
};

const startGame = () => {
    score = 0;
    scoreBoard.textContent = score;
    timeUp = false;
    peep();
    setTimeout(() => timeUp = true, 10000);
};

const bonk = (e) => {
    if (e.isTrusted) {
        score++;
        e.currentTarget.classList.remove('up');
        scoreBoard.textContent = score;
    }
};

moles.forEach(mole => mole.addEventListener('click', bonk));