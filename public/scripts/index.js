document.addEventListener("DOMContentLoaded", function () {
    const allButtons = [
        document.getElementById('play-flappyball'),
        document.getElementById('info-flappyball'),
        document.getElementById('play-memorygame'),
        document.getElementById('info-memorygame'),
        document.getElementById('play-rockpaperscissors'),
        document.getElementById('info-rockpaperscissors'),
        document.getElementById('play-simonsays'),
        document.getElementById('info-simonsays'),
        document.getElementById('play-snakegame'),
        document.getElementById('info-snakegame'),
        document.getElementById('play-tictactoe'),
        document.getElementById('info-tictactoe'),
        document.getElementById('play-whackamole'),
        document.getElementById('info-whackamole'),
    ];

    const xboxButton = document.querySelector('.btn.btn-success.btn-sm');
    const playStationButton = document.querySelector('.btn.btn-primary.btn-sm');
    const notConnectedButton = document.querySelector('.btn.btn-dark.btn-sm');
    const notConnectedIcon = notConnectedButton.querySelector('i');

    let focusedIndex = 0; 
    let lastActionTime = 0; 
    const debounceTime = 200; 

    function setFocus(index) {
        if (index < 0 || index >= allButtons.length) return;

        if (allButtons[focusedIndex]) {
            allButtons[focusedIndex].style.border = "none";
        }

        if (index >= 0 && index < allButtons.length) {
            allButtons[index].style.border = "1px solid gray";
        }
        focusedIndex = index;
    }

    function handleGamepadInput() {
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0];
        const currentTime = Date.now();
        let dpadUsed = false; 

        if (gamepad) {
            xboxButton.disabled = false;
            playStationButton.disabled = false;
            notConnectedButton.disabled = true;
            notConnectedIcon.classList.replace('bi-x-circle-fill', 'bi-check-circle-fill');
            notConnectedButton.setAttribute('title', 'Connected');
            notConnectedButton.setAttribute('data-bs-original-title', 'Connected');

            if (currentTime - lastActionTime > debounceTime) {
                if (gamepad.buttons[14].pressed) { 
                    if (focusedIndex > 0) {
                        setFocus(focusedIndex - 1);
                        lastActionTime = currentTime;
                        dpadUsed = true; 
                    }
                }
                if (gamepad.buttons[15].pressed) { 
                    if (focusedIndex < allButtons.length - 1) {
                        setFocus(focusedIndex + 1);
                        lastActionTime = currentTime; 
                        dpadUsed = true;
                    }
                }

                if (gamepad.buttons[12].pressed) {
                    window.scrollBy(0, -50); 
                    lastActionTime = currentTime; 
                    dpadUsed = true; 
                }
                if (gamepad.buttons[13].pressed) { 
                    window.scrollBy(0, 50);
                    lastActionTime = currentTime; 
                    dpadUsed = true; 
                }

                if (gamepad.buttons[0].pressed) { 
                    if (allButtons[focusedIndex]) {
                        allButtons[focusedIndex].click();
                        lastActionTime = currentTime;
                    }
                }

                if (gamepad.buttons[1].pressed || gamepad.buttons[3].pressed) { 
                    const closeButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
                    closeButtons.forEach(button => button.click());
                    lastActionTime = currentTime; 
                }
            }

            if (!dpadUsed) {
                setFocus(focusedIndex); 
            }
        } else {
            xboxButton.disabled = true;
            playStationButton.disabled = true;
            notConnectedButton.disabled = false;
            notConnectedIcon.classList.replace('bi-check-circle-fill', 'bi-x-circle-fill');
            notConnectedButton.setAttribute('title', 'Not Connected');
            notConnectedButton.setAttribute('data-bs-original-title', 'Not Connected'); 

            allButtons.forEach(button => button.style.border = "none");
        }

        requestAnimationFrame(handleGamepadInput);
    }

    if (allButtons.length > 0) {
        setFocus(0); 
    }

    handleGamepadInput();
});

document.getElementById('mode-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');

    const isDarkMode = document.body.classList.contains('dark-mode');
    this.innerHTML = isDarkMode ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
});

document.getElementById('fullscreen-toggle').addEventListener('click', function () {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
        });
        this.innerHTML = '<i class="bi bi-fullscreen-exit"></i>';
    } else {
        document.exitFullscreen().catch(err => {
            console.error(`Error attempting to exit fullscreen mode: ${err.message} (${err.name})`);
        });
        this.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
    }
});

document.addEventListener('fullscreenchange', function () {
    const fullscreenButton = document.getElementById('fullscreen-toggle');
    if (document.fullscreenElement) {
        fullscreenButton.innerHTML = '<i class="bi bi-fullscreen-exit"></i>';
    } else {
        fullscreenButton.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});
