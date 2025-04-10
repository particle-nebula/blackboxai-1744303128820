// DOM Elements
const focusToggle = document.getElementById('focus-toggle');
const toggleBg = document.getElementById('toggle-bg');
const toggleCircle = document.getElementById('toggle-circle');
const statusText = document.getElementById('status-text');
const focusIcon = document.getElementById('focus-icon');
const blockIndicator = document.getElementById('block-indicator');

// State
let isFocusModeActive = false;

// Load state from localStorage
function loadState() {
    const savedState = localStorage.getItem('focusMode');
    if (savedState) {
        isFocusModeActive = JSON.parse(savedState);
        updateUI(isFocusModeActive);
        focusToggle.checked = isFocusModeActive;
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('focusMode', JSON.stringify(isFocusModeActive));
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
        { isActive: isFocusModeActive }
    );
    
    // Show notification
    showNotification(isFocusModeActive);
}

// Show notification
function showNotification(isActive) {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 ${isActive ? 'bg-primary' : 'bg-gray-700'} text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-0`;
    notification.textContent = isActive ? 'Focus Mode Activated' : 'Focus Mode Deactivated';
    
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
    focusToggle.addEventListener('change', toggleFocusMode);
});

// Handle blocked sites list interactions
document.getElementById('blocked-list').addEventListener('click', (e) => {
    const item = e.target.closest('.flex.items-center.justify-between');
    if (item && isFocusModeActive) {
        // Simulate blocking attempt
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg';
        notification.textContent = 'Access blocked while Focus Mode is active';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
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
