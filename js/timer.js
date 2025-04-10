
// Timer Constants
const WORK_TIME = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK = 5 * 60; // 5 minutes in seconds
const LONG_BREAK = 15 * 60; // 15 minutes in seconds
const SESSIONS_BEFORE_LONG_BREAK = 4;

// DOM Elements
const timeDisplay = document.getElementById('time-display');
const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('pause-btn');
const resetButton = document.getElementById('reset-btn');
const timerProgress = document.getElementById('timer-progress');
const workSessionsDisplay = document.getElementById('work-sessions');
const shortBreaksDisplay = document.getElementById('short-breaks');
const longBreaksDisplay = document.getElementById('long-breaks');

// Timer State
let timeRemaining = WORK_TIME;
let isRunning = false;
let timerInterval = null;
let currentMode = 'work';
let workSessions = 0;
let shortBreaks = 0;
let longBreaks = 0;

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
    if (currentMode === 'work') {
        workSessions++;
        if (workSessions % SESSIONS_BEFORE_LONG_BREAK === 0) {
            currentMode = 'long-break';
            timeRemaining = LONG_BREAK;
            longBreaks++;
            showNotification('Time for a long break!');
        } else {
            currentMode = 'short-break';
            timeRemaining = SHORT_BREAK;
            shortBreaks++;
            showNotification('Time for a short break!');
        }
    } else {
        currentMode = 'work';
        timeRemaining = WORK_TIME;
        showNotification('Time to focus!');
    }
    
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
    updateDisplays();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    // Hide pause button initially
    pauseButton.style.display = 'none';
    startButton.style.display = 'inline-flex';
    
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
});
