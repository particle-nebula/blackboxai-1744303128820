
// Timer Constants
const WORK_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes in seconds
const LONG_BREAK = 15 * 60; // 15 minutes in seconds
const SESSIONS_BEFORE_LONG_BREAK = 4;

// Motivational Messages
const MESSAGES = {
    work: [
        "Stay focused, you're doing great!",
        "Every minute of focus brings you closer to your goals",
        "You are stronger than your distractions",
        "The cure starts with your commitment",
        "Small steps, big results"
    ],
    break: [
        "Take a moment to breathe and reflect",
        "Rest is part of the process",
        "Recharge your mind for the next session",
        "You've earned this break!",
        "Celebrate your progress"
    ]
};

// Sound Effects
const NOTIFICATION_SOUND = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');


// DOM Elements
const timeDisplay = document.getElementById('time-display');
const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('pause-btn');
const resetButton = document.getElementById('reset-btn');
const timerProgress = document.getElementById('timer-progress');
const workSessionsDisplay = document.getElementById('work-sessions');
const shortBreaksDisplay = document.getElementById('short-breaks');
const longBreaksDisplay = document.getElementById('long-breaks');

// DOM Elements (continued)
const timerStatus = document.getElementById('timer-status');
const motivationMessage = document.getElementById('motivation-message');

// Timer State
let timeRemaining = WORK_TIME;
let isRunning = false;
let timerInterval = null;
let currentMode = 'work';
let workSessions = 0;
let shortBreaks = 0;
let longBreaks = 0;

// Get random motivational message
function getRandomMessage(type) {
    const messages = MESSAGES[type];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Update motivation message
function updateMotivationMessage() {
    const messageType = currentMode === 'work' ? 'work' : 'break';
    motivationMessage.textContent = getRandomMessage(messageType);
}

// Play notification sound
function playNotification() {
    NOTIFICATION_SOUND.play();
}

// Load saved state from localStorage
function loadState() {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
        const state = JSON.parse(savedState);
        workSessions = state.workSessions || 0;
        shortBreaks = state.shortBreaks || 0;
        longBreaks = state.longBreaks || 0;
        updateDisplays();
    }
}

// Save state to localStorage
function saveState() {
    const state = {
        workSessions,
        shortBreaks,
        longBreaks
    };
    localStorage.setItem('timerState', JSON.stringify(state));
}

// Format time to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update all displays
function updateDisplays() {
    timeDisplay.textContent = formatTime(timeRemaining);
    workSessionsDisplay.textContent = workSessions;
    shortBreaksDisplay.textContent = shortBreaks;
    longBreaksDisplay.textContent = longBreaks;
    
    // Update progress circle
    const totalTime = currentMode === 'work' ? WORK_TIME : 
                     currentMode === 'short-break' ? SHORT_BREAK : LONG_BREAK;
    const progress = (totalTime - timeRemaining) / totalTime;
    const circumference = 2 * Math.PI * 28;
    timerProgress.style.strokeDasharray = circumference;
    timerProgress.style.strokeDashoffset = circumference * (1 - progress);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateY(200%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Switch timer mode
function switchMode() {
    playNotification();
    
    if (currentMode === 'work') {
        workSessions++;
        if (workSessions % SESSIONS_BEFORE_LONG_BREAK === 0) {
            currentMode = 'long-break';
            timeRemaining = LONG_BREAK;
            longBreaks++;
            showNotification('Time for a long break!');
            timerStatus.textContent = 'Long Break';
        } else {
            currentMode = 'short-break';
            timeRemaining = SHORT_BREAK;
            shortBreaks++;
            showNotification('Time for a short break!');
            timerStatus.textContent = 'Short Break';
        }
    } else {
        currentMode = 'work';
        timeRemaining = WORK_TIME;
        showNotification('Time to focus!');
        timerStatus.textContent = 'Work Session';
    }
    
    updateMotivationMessage();
    updateDisplays();
    saveState();
}

// Timer tick function
function tick() {
    if (timeRemaining > 0) {
        timeRemaining--;
        updateDisplays();
    } else {
        // Notify integration service before switching mode
        window.antidoteServices.eventBus.publish(
            window.antidoteServices.EventTypes.TIMER_COMPLETE,
            {
                duration: currentMode === 'work' ? WORK_TIME : 
                         currentMode === 'short-break' ? SHORT_BREAK : LONG_BREAK
            }
        );
        switchMode();
    }
}

// Start timer
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startButton.style.display = 'none';
        pauseButton.style.display = 'inline-flex';
        timerInterval = setInterval(tick, 1000);
        
        // Update status and motivation on start
        timerStatus.textContent = currentMode === 'work' ? 'Work Session' : 
                                currentMode === 'short-break' ? 'Short Break' : 'Long Break';
        updateMotivationMessage();
    }
}

// Pause timer
function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        startButton.style.display = 'inline-flex';
        pauseButton.style.display = 'none';
        clearInterval(timerInterval);
    }
}

// Reset timer
function resetTimer() {
    pauseTimer();
    currentMode = 'work';
    timeRemaining = WORK_TIME;
    timerStatus.textContent = 'Work Session';
    updateMotivationMessage();
    updateDisplays();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    // Hide pause button initially
    pauseButton.style.display = 'none';
    startButton.style.display = 'inline-flex';
    
    // Initialize timer status and motivation
    timerStatus.textContent = 'Work Session';
    updateMotivationMessage();
    
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
});
