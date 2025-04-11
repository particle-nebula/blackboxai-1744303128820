// DOM Elements
const focusToggle = document.getElementById('focus-toggle');
const toggleBg = document.getElementById('toggle-bg');
const toggleCircle = document.getElementById('toggle-circle');
const statusText = document.getElementById('status-text');
const focusIcon = document.getElementById('focus-icon');
const blockIndicator = document.getElementById('block-indicator');
const strictModeBtn = document.getElementById('strict-mode');
const gentleModeBtn = document.getElementById('gentle-mode');
const reminderSettings = document.getElementById('reminder-settings');
const reminderFrequency = document.getElementById('reminder-frequency');
const reminderStyle = document.getElementById('reminder-style');

// State
let isFocusModeActive = false;
let currentMode = 'strict'; // 'strict' or 'gentle'
let reminderInterval = null;
let reminderMessages = {
    gentle: [
        "Have you finished your work?",
        "Are you still being productive?",
        "Taking a quick break might help",
        "Remember your priorities"
    ],
    motivational: [
        "You're doing great, stay focused!",
        "Keep pushing forward!",
        "Every minute counts!",
        "You've got this!"
    ],
    goal: [
        "Remember your goals!",
        "Think about what you want to achieve",
        "Stay on track with your objectives",
        "Your future self will thank you"
    ]
};

// Load state from localStorage
function loadState() {
    const savedState = localStorage.getItem('focusMode');
    if (savedState) {
        const state = JSON.parse(savedState);
        isFocusModeActive = state.isActive;
        currentMode = state.mode || 'strict';
        updateUI(isFocusModeActive);
        focusToggle.checked = isFocusModeActive;
        updateModeSelection();
    }
}

// Save state to localStorage
function saveState() {
    const state = {
        isActive: isFocusModeActive,
        mode: currentMode
    };
    localStorage.setItem('focusMode', JSON.stringify(state));
}

// Switch focus mode
function switchMode(mode) {
    currentMode = mode;
    updateModeSelection();
    
    // Clear any existing reminder interval
    if (reminderInterval) {
        clearInterval(reminderInterval);
        reminderInterval = null;
    }
    
    // Show/hide reminder settings
    reminderSettings.classList.toggle('hidden', mode === 'strict');
    
    // Update icon based on mode
    const icon = focusIcon.querySelector('i');
    icon.className = mode === 'strict' ? 
        'fas fa-shield-alt text-4xl text-gray-400' :
        'fas fa-bell text-4xl text-gray-400';
        
    saveState();
}

// Update mode selection UI
function updateModeSelection() {
    strictModeBtn.classList.toggle('bg-primary', currentMode === 'strict');
    strictModeBtn.classList.toggle('text-white', currentMode === 'strict');
    gentleModeBtn.classList.toggle('bg-secondary', currentMode === 'gentle');
    gentleModeBtn.classList.toggle('text-white', currentMode === 'gentle');
}

// Get random reminder message
function getRandomMessage() {
    const style = reminderStyle.value;
    const messages = reminderMessages[style];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Start reminder interval
function startReminders() {
    if (currentMode === 'gentle' && isFocusModeActive) {
        const frequency = parseInt(reminderFrequency.value) * 60 * 1000; // Convert minutes to milliseconds
        reminderInterval = setInterval(() => {
            showNotification(getRandomMessage(), 'reminder');
        }, frequency);
    }
}

// Stop reminder interval
function stopReminders() {
    if (reminderInterval) {
        clearInterval(reminderInterval);
        reminderInterval = null;
    }
}

// Update UI based on focus mode state
function updateUI(isActive) {
    // Update toggle appearance
    toggleBg.style.backgroundColor = isActive ? '#4F46E5' : '#D1D5DB';
    toggleCircle.style.transform = isActive ? 'translateX(2rem)' : 'translateX(0)';
    
    // Update status text
    statusText.textContent = isActive ? 'Focus Mode Active' : 'Focus Mode Inactive';
    statusText.className = isActive ? 'text-lg font-medium text-primary' : 'text-lg font-medium text-gray-700';
    
    // Update focus icon
    focusIcon.className = isActive ? 
        'w-24 h-24 rounded-full bg-primary flex items-center justify-center' :
        'w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center';
    
    // Update icon color
    const icon = focusIcon.querySelector('i');
    icon.className = isActive ? 
        'fas fa-shield-alt text-4xl text-white' :
        'fas fa-shield-alt text-4xl text-gray-400';
    
    // Show/hide block indicator
    blockIndicator.classList.toggle('hidden', !isActive);
}

// Toggle focus mode
function toggleFocusMode() {
    isFocusModeActive = !isFocusModeActive;
    updateUI(isFocusModeActive);
    saveState();
    
    // Notify integration service
    window.antidoteServices.eventBus.publish(
        window.antidoteServices.EventTypes.FOCUS_MODE_CHANGE,
        { 
            isActive: isFocusModeActive,
            mode: currentMode
        }
    );
    
    // Show appropriate notification
    const message = isFocusModeActive ? 
        (currentMode === 'strict' ? 'Focus Mode Activated - Distractions Blocked' : 'Focus Mode Activated - Gentle Reminders Enabled') :
        'Focus Mode Deactivated';
    showNotification(message, 'status');
    
    // Handle reminders
    if (isFocusModeActive && currentMode === 'gentle') {
        startReminders();
    } else {
        stopReminders();
    }
}

// Show notification
function showNotification(message, type = 'status') {
    const notification = document.createElement('div');
    let bgColor;
    
    switch (type) {
        case 'reminder':
            bgColor = currentMode === 'gentle' ? 'bg-secondary' : 'bg-primary';
            break;
        case 'block':
            bgColor = 'bg-red-500';
            break;
        default:
            bgColor = isFocusModeActive ? 'bg-primary' : 'bg-gray-700';
    }
    
    notification.className = `fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-0`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(200%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    
    // Mode selection listeners
    strictModeBtn.addEventListener('click', () => switchMode('strict'));
    gentleModeBtn.addEventListener('click', () => switchMode('gentle'));
    
    // Focus toggle listener
    focusToggle.addEventListener('change', () => {
        toggleFocusMode();
        if (isFocusModeActive) {
            startReminders();
        } else {
            stopReminders();
        }
    });
    
    // Reminder settings listeners
    reminderFrequency.addEventListener('change', () => {
        if (isFocusModeActive) {
            stopReminders();
            startReminders();
        }
    });
    
    reminderStyle.addEventListener('change', () => {
        if (isFocusModeActive && currentMode === 'gentle') {
            showNotification(getRandomMessage(), 'reminder');
        }
    });
});

// Handle blocked sites list interactions
document.getElementById('blocked-list').addEventListener('click', (e) => {
    const item = e.target.closest('.flex.items-center.justify-between');
    if (item && isFocusModeActive) {
        if (currentMode === 'strict') {
            showNotification('Access blocked while Focus Mode is active', 'block');
        } else {
            showNotification(getRandomMessage(), 'reminder');
        }
    }
});

// Auto-deactivate timer (simulated for demo)
let autoDeactivateTimeout;

function startAutoDeactivateTimer() {
    // Simulate task completion after 30 minutes (for demo purposes)
    autoDeactivateTimeout = setTimeout(() => {
        if (isFocusModeActive) {
            focusToggle.checked = false;
            toggleFocusMode();
        }
    }, 30 * 60 * 1000); // 30 minutes
}

function clearAutoDeactivateTimer() {
    if (autoDeactivateTimeout) {
        clearTimeout(autoDeactivateTimeout);
    }
}

// Update auto-deactivate timer when focus mode changes
focusToggle.addEventListener('change', () => {
    if (isFocusModeActive) {
        startAutoDeactivateTimer();
    } else {
        clearAutoDeactivateTimer();
    }
});
