
// Timer Constants
let WORK_TIME = 25 * 60; // 25 minutes in seconds
let SHORT_BREAK = 5 * 60; // 5 minutes in seconds
let LONG_BREAK = 15 * 60; // 15 minutes in seconds
const SESSIONS_BEFORE_LONG_BREAK = 4;

// User Progress Elements
const userLevelDisplay = document.getElementById('user-level');
const usernameDisplay = document.getElementById('username-display');
const levelDisplay = document.getElementById('level-display');
const xpDisplay = document.getElementById('xp-display');
const nextLevelXpDisplay = document.getElementById('next-level-xp');
const xpProgress = document.getElementById('xp-progress');
const dailyFocusTime = document.getElementById('daily-focus-time');
const dailyXpGained = document.getElementById('daily-xp-gained');
const focusProgress = document.getElementById('focus-progress');
const xpDailyProgress = document.getElementById('xp-daily-progress');

// Timer Settings Elements
const customMinutesInput = document.getElementById('custom-minutes');
const breakMinutesInput = document.getElementById('break-minutes');
const presetButtons = document.querySelectorAll('.preset-btn');

// Daily Progress State
let dailyStats = {
    focusMinutes: 0,
    xpGained: 0,
    lastUpdate: new Date().toDateString()
};

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

// Show notification with XP gain
function showNotification(message, xpGain = 0) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300';
    
    let content = message;
    if (xpGain > 0) {
        content += `
            <div class="flex items-center mt-2 text-sm">
                <i class="fas fa-star text-yellow-300 mr-2"></i>
                <span>+${xpGain} XP</span>
            </div>
        `;
    }
    
    notification.innerHTML = content;
    document.body.appendChild(notification);

    // Add floating XP animation if there's XP gain
    if (xpGain > 0) {
        const xpFloat = document.createElement('div');
        xpFloat.className = 'fixed text-xl font-bold text-yellow-400';
        xpFloat.style.left = `${Math.random() * 60 + 20}%`;
        xpFloat.style.bottom = '20%';
        xpFloat.textContent = `+${xpGain} XP`;
        
        // Add glow effect
        xpFloat.style.textShadow = '0 0 10px rgba(250, 204, 21, 0.5)';
        
        document.body.appendChild(xpFloat);

        // Animate XP floating up
        xpFloat.animate([
            { transform: 'translateY(0)', opacity: 1 },
            { transform: 'translateY(-100px)', opacity: 0 }
        ], {
            duration: 1500,
            easing: 'ease-out'
        }).onfinish = () => xpFloat.remove();
    }

    // Slide out notification
    setTimeout(() => {
        notification.style.transform = 'translateY(200%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add celebration effect
function showCelebration() {
    // Create and append canvas for confetti
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    // Adjust canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    // Confetti particles
    const particles = [];
    const colors = ['#2F855A', '#66A80F', '#975A16', '#047857'];

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 5 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * Math.PI * 2,
            spin: Math.random() * 0.2 - 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let complete = true;
        particles.forEach(particle => {
            particle.y += particle.speed;
            particle.angle += particle.spin;

            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.angle);
            ctx.fillStyle = particle.color;
            ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            ctx.restore();

            if (particle.y < canvas.height) complete = false;
        });

        if (!complete) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }

    animate();
}

// Switch timer mode
function switchMode() {
    playNotification();
    
    if (currentMode === 'work') {
        // Calculate XP earned for completed work session
        const xpEarned = Math.floor(WORK_TIME / 60) * 10; // 10 XP per minute
        
        // Update daily stats
        dailyStats.focusMinutes += Math.floor(WORK_TIME / 60);
        dailyStats.xpGained += xpEarned;
        saveDailyStats();
        updateDailyProgress();
        
        workSessions++;
        if (workSessions % SESSIONS_BEFORE_LONG_BREAK === 0) {
            currentMode = 'long-break';
            timeRemaining = LONG_BREAK;
            longBreaks++;
            showNotification('Time for a long break!', xpEarned);
            timerStatus.textContent = 'Long Break';
            // Extra XP bonus for completing 4 sessions
            const bonusXP = 50;
            dailyStats.xpGained += bonusXP;
            saveDailyStats();
            showCelebration();
            setTimeout(() => {
                showNotification('Bonus XP for completing 4 sessions!', bonusXP);
                updateDailyProgress();
            }, 1500);
        } else {
            currentMode = 'short-break';
            timeRemaining = SHORT_BREAK;
            shortBreaks++;
            showNotification('Time for a short break!', xpEarned);
            timerStatus.textContent = 'Short Break';
        }
        
        // Update user progress if authenticated
        if (window.antidoteServices && window.antidoteServices.eventBus) {
            window.antidoteServices.eventBus.publish(
                window.antidoteServices.EventTypes.TIMER_COMPLETE,
                { 
                    duration: WORK_TIME,
                    xpEarned: xpEarned + (workSessions % SESSIONS_BEFORE_LONG_BREAK === 0 ? 50 : 0)
                }
            );
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
    
    // Add sparkle effect to timer display
    addSparkleEffect();
}

// Add sparkle effect to timer
function addSparkleEffect() {
    const sparkleContainer = document.createElement('div');
    sparkleContainer.style.position = 'absolute';
    sparkleContainer.style.inset = '0';
    sparkleContainer.style.pointerEvents = 'none';
    
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'absolute w-1 h-1 bg-yellow-300 rounded-full';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animation = `sparkle ${0.5 + Math.random()}s ease-in-out`;
        sparkleContainer.appendChild(sparkle);
    }
    
    timeDisplay.parentElement.appendChild(sparkleContainer);
    
    // Add sparkle animation style if not already added
    if (!document.querySelector('#sparkle-style')) {
        const style = document.createElement('style');
        style.id = 'sparkle-style';
        style.textContent = `
            @keyframes sparkle {
                0%, 100% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => sparkleContainer.remove(), 1000);
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

// Update timer durations
function updateTimerDurations() {
    if (!isRunning) {
        const workMinutes = parseInt(customMinutesInput.value);
        const breakMinutes = parseInt(breakMinutesInput.value);
        
        if (workMinutes >= 1 && workMinutes <= 120 && breakMinutes >= 1 && breakMinutes <= 30) {
            WORK_TIME = workMinutes * 60;
            SHORT_BREAK = breakMinutes * 60;
            timeRemaining = WORK_TIME;
            updateDisplays();
            showNotification('Timer settings updated');
        }
    } else {
        showNotification('Cannot update settings while timer is running');
    }
}

// Handle preset selection
function handlePresetSelection(duration, breakTime) {
    if (!isRunning) {
        customMinutesInput.value = duration;
        breakMinutesInput.value = breakTime;
        updateTimerDurations();
    } else {
        showNotification('Cannot change preset while timer is running');
    }
}

// Load daily stats from localStorage
function loadDailyStats() {
    const saved = localStorage.getItem('dailyStats');
    if (saved) {
        const stats = JSON.parse(saved);
        if (stats.lastUpdate === new Date().toDateString()) {
            dailyStats = stats;
        } else {
            // Reset stats for new day
            dailyStats = {
                focusMinutes: 0,
                xpGained: 0,
                lastUpdate: new Date().toDateString()
            };
        }
        updateDailyProgress();
    }
}

// Save daily stats to localStorage
function saveDailyStats() {
    localStorage.setItem('dailyStats', JSON.stringify(dailyStats));
}

// Update daily progress displays
function updateDailyProgress() {
    dailyFocusTime.textContent = `${dailyStats.focusMinutes} minutes`;
    dailyXpGained.textContent = `${dailyStats.xpGained} XP`;
    
    // Update progress bars (assuming daily goals of 120 minutes and 1000 XP)
    focusProgress.style.width = `${Math.min(100, (dailyStats.focusMinutes / 120) * 100)}%`;
    xpDailyProgress.style.width = `${Math.min(100, (dailyStats.xpGained / 1000) * 100)}%`;
}

// Update user progress displays
function updateUserProgress() {
    if (window.antidoteServices && window.antidoteServices.getCurrentUser) {
        const user = window.antidoteServices.getCurrentUser();
        if (user) {
            usernameDisplay.textContent = user.username;
            userLevelDisplay.textContent = user.level;
            levelDisplay.textContent = user.level;
            xpDisplay.textContent = `${user.xp} XP`;
            
            const nextLevelXP = Math.floor(1000 * Math.pow(1.5, user.level - 1));
            nextLevelXpDisplay.textContent = `${nextLevelXP} XP`;
            
            // Update XP progress bar
            const progress = (user.xp / nextLevelXP) * 100;
            xpProgress.style.width = `${Math.min(100, progress)}%`;
            
            // Add pulse animation if close to level up
            if (progress >= 90) {
                xpProgress.classList.add('animate-pulse');
            } else {
                xpProgress.classList.remove('animate-pulse');
            }
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    loadDailyStats();
    
    // Hide pause button initially
    pauseButton.style.display = 'none';
    startButton.style.display = 'inline-flex';
    
    // Initialize timer status and motivation
    timerStatus.textContent = 'Work Session';
    updateMotivationMessage();
    
    // Timer control listeners
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
    
    // Timer settings listeners
    customMinutesInput.addEventListener('change', updateTimerDurations);
    breakMinutesInput.addEventListener('change', updateTimerDurations);
    
    // Preset button listeners
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const duration = parseInt(button.dataset.duration);
            const breakTime = parseInt(button.dataset.break);
            handlePresetSelection(duration, breakTime);
        });
    });
    
    // Initialize user progress
    updateUserProgress();
    
    // Subscribe to user state updates
    if (window.antidoteServices && window.antidoteServices.eventBus) {
        window.antidoteServices.eventBus.subscribe(
            window.antidoteServices.EventTypes.USER_STATE_UPDATE,
            () => {
                updateUserProgress();
            }
        );
    }
});
