document.addEventListener("DOMContentLoaded", function () {
    // Get all buttons
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

    // Initialize Xbox, PlayStation, and Not Connected button elements
    const xboxButton = document.querySelector('.btn.btn-success.btn-sm');
    const playStationButton = document.querySelector('.btn.btn-primary.btn-sm');
    const notConnectedButton = document.querySelector('.btn.btn-dark.btn-sm');
    const notConnectedIcon = notConnectedButton.querySelector('i');

    let focusedIndex = 0; // Track the current index in the sequence
    let lastActionTime = 0; // To keep track of the last action time
    const debounceTime = 200; // Time in milliseconds to debounce actions

    function setFocus(index) {
        // Ensure the index is within bounds
        if (index < 0 || index >= allButtons.length) return;

        // Remove border from previously focused button
        if (allButtons[focusedIndex]) {
            allButtons[focusedIndex].style.border = "none";
        }

        // Highlight the currently focused button if d-pad is being used
        if (index >= 0 && index < allButtons.length) {
            allButtons[index].style.border = "1px solid gray";
        }
        focusedIndex = index;
    }

    function handleGamepadInput() {
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0];
        const currentTime = Date.now();
        let dpadUsed = false; // Flag to track if d-pad was used

        if (gamepad) {
            // Enable Xbox and PlayStation buttons and disable Not Connected button
            xboxButton.disabled = false;
            playStationButton.disabled = false;
            notConnectedButton.disabled = true;
            notConnectedIcon.classList.replace('bi-x-circle-fill', 'bi-check-circle-fill');
            notConnectedButton.setAttribute('title', 'Connected');
            notConnectedButton.setAttribute('data-bs-original-title', 'Connected'); // Update tooltip text dynamically

            // Check if debounce time has passed
            if (currentTime - lastActionTime > debounceTime) {
                if (gamepad.buttons[14].pressed) { // d-pad left
                    // Move focus to the previous button in sequence
                    if (focusedIndex > 0) {
                        setFocus(focusedIndex - 1);
                        lastActionTime = currentTime; // Update the last action time
                        dpadUsed = true; // Mark d-pad as used
                    }
                }
                if (gamepad.buttons[15].pressed) { // d-pad right
                    // Move focus to the next button in sequence
                    if (focusedIndex < allButtons.length - 1) {
                        setFocus(focusedIndex + 1);
                        lastActionTime = currentTime; // Update the last action time
                        dpadUsed = true; // Mark d-pad as used
                    }
                }

                // D-pad up and down for scrolling
                if (gamepad.buttons[12].pressed) { // d-pad up
                    window.scrollBy(0, -50); // Scroll up by 50 pixels
                    lastActionTime = currentTime; // Update the last action time
                    dpadUsed = true; // Mark d-pad as used
                }
                if (gamepad.buttons[13].pressed) { // d-pad down
                    window.scrollBy(0, 50); // Scroll down by 50 pixels
                    lastActionTime = currentTime; // Update the last action time
                    dpadUsed = true; // Mark d-pad as used
                }

                if (gamepad.buttons[0].pressed) { // A button or similar for selection
                    if (allButtons[focusedIndex]) {
                        allButtons[focusedIndex].click();
                        lastActionTime = currentTime; // Update the last action time
                    }
                }

                // Check if B button (Xbox) or Triangle button (PS) is pressed
                if (gamepad.buttons[1].pressed || gamepad.buttons[3].pressed) { // B button (Xbox) or Triangle button (PS)
                    const closeButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
                    closeButtons.forEach(button => button.click());
                    lastActionTime = currentTime; // Update the last action time
                }
            }

            // Remove border if d-pad was not used
            if (!dpadUsed) {
                setFocus(focusedIndex); // Ensure the current focus is maintained
            }
        } else {
            // No controller connected, disable Xbox and PlayStation buttons
            xboxButton.disabled = true;
            playStationButton.disabled = true;
            notConnectedButton.disabled = false;
            notConnectedIcon.classList.replace('bi-check-circle-fill', 'bi-x-circle-fill');
            notConnectedButton.setAttribute('title', 'Not Connected');
            notConnectedButton.setAttribute('data-bs-original-title', 'Not Connected'); // Update tooltip text dynamically

            // Remove border from all buttons
            allButtons.forEach(button => button.style.border = "none");
        }

        requestAnimationFrame(handleGamepadInput);
    }

    // Initialize focus on the first button if available
    if (allButtons.length > 0) {
        setFocus(0); // Start with the first button in the sequence
    }

    handleGamepadInput();
});

// Function to toggle dark/light mode
document.getElementById('mode-toggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');

    // Change button icon based on the current mode
    const isDarkMode = document.body.classList.contains('dark-mode');
    this.innerHTML = isDarkMode ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
});

// Function to toggle fullscreen mode
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

// Update the fullscreen button icon on page load if in fullscreen
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
