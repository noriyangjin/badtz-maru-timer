let timers = {};
let sound;  // Declare a variable for the audio element
let hasStarted = false;  // Flag to ensure audio is preloaded only once

// Function to preload the sound and create the audio element
function preloadSound() {
    sound = new Audio('pop1am.mp3');  // Replace with your sound file path
    sound.load();  // Preload the sound file
}

// Function to start the timer
function startTimer(timerId) {
    const inputElement = document.getElementById(`timerInput${timerId}`);
    const displayElement = document.getElementById(`timerDisplay${timerId}`);
    
    // Hide the GIF overlay every time a new timer is started
    hideGif();

    if (!timers[timerId] || timers[timerId].isPaused) {
        let inputMinutes = parseInt(inputElement.value);
        if (isNaN(inputMinutes) || inputMinutes <= 0) return;
        timers[timerId] = { timeRemaining: inputMinutes * 60, isPaused: false };
    }
    
    clearInterval(timers[timerId].interval);
    timers[timerId].interval = setInterval(() => updateTimer(timerId), 1000);
    timers[timerId].isPaused = false;

    // Preload sound the first time the timer starts
    if (!hasStarted) {
        preloadSound();  // Preload the audio when the timer starts
        hasStarted = true;  // Set flag to true after first interaction
    }
}

// Function to update the timer
function updateTimer(timerId) {
    if (!timers[timerId] || timers[timerId].timeRemaining <= 0) {
        clearInterval(timers[timerId].interval);
        document.getElementById(`timerDisplay${timerId}`).innerText = "Time's up!";
        
        // Play the sound when the timer finishes
        playSound();
        
        // Show the GIF only when the timer finishes
        showGif();

        return;
    }
    
    const minutes = Math.floor(timers[timerId].timeRemaining / 60);
    const seconds = timers[timerId].timeRemaining % 60;
    document.getElementById(`timerDisplay${timerId}`).innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    timers[timerId].timeRemaining--;
}

// Function to pause the timer
function pauseTimer(timerId) {
    if (timers[timerId]) {
        clearInterval(timers[timerId].interval);
        timers[timerId].isPaused = true;
    }
}

// Function to reset the timer
function resetTimer(timerId) {
    if (timers[timerId]) {
        clearInterval(timers[timerId].interval);
        document.getElementById(`timerDisplay${timerId}`).innerText = "00:00";
        timers[timerId] = null;
    }

    // Hide the GIF when resetting
    hideGif();
}

// Function to play the sound when the timer finishes
function playSound() {
    if (sound) {
        sound.volume = 1.0; // Adjust the volume here (80% of the max volume)
        sound.play().catch((e) => {
            console.error('Audio playback failed:', e);
        });
    } else {
        console.error("Sound is not loaded!");
    }
}

// Function to show the GIF when the timer finishes
function showGif() {
    const gifOverlay = document.getElementById('gifOverlay');
    gifOverlay.style.display = 'flex'; // Show the GIF overlay
    
    // Hide the GIF overlay after 14 seconds
    setTimeout(() => {
        gifOverlay.style.display = 'none';
    }, 14000);  // 14 seconds (14000 milliseconds)
}

// Function to hide the GIF overlay
function hideGif() {
    const gifOverlay = document.getElementById('gifOverlay');
    gifOverlay.style.display = 'none'; // Ensure the GIF overlay is hidden at the start
}

// Ensure the GIF overlay is hidden when the page loads
window.onload = function() {
    hideGif();
}
