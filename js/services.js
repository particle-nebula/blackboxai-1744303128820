// Integration Service for Antidote Application

// Event Types
const EventTypes = {
    TIMER_COMPLETE: 'timerComplete',
    FOCUS_MODE_CHANGE: 'focusModeChange',
    GOAL_PROGRESS: 'goalProgress',
    CHALLENGE_UPDATE: 'challengeUpdate',
    STREAK_UPDATE: 'streakUpdate',
    USER_STATE_UPDATE: 'userStateUpdate',
    AUTH_ERROR: 'authError'
};

// User state
let currentUser = null;

// Auth functions
function getCurrentUser() {
    return currentUser;
}

function login(username, password) {
    // Mock login - replace with actual backend integration
    if (username === 'demo' && password === 'demo123') {
        currentUser = {
            username: 'demo',
            level: 1,
            xp: 0,
            streak: 0,
            achievements: [],
            focusMinutes: 0,
            lastLogin: new Date()
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        eventBus.publish(EventTypes.USER_STATE_UPDATE, { user: currentUser });
        return true;
    }
    eventBus.publish(EventTypes.AUTH_ERROR, { message: 'Invalid credentials' });
    return false;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    eventBus.publish(EventTypes.USER_STATE_UPDATE, { user: null });
}

// Load saved user state
function loadUserState() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        eventBus.publish(EventTypes.USER_STATE_UPDATE, { user: currentUser });
        return true;
    }
    return false;
}

// Central Event Bus
class EventBus {
    constructor() {
        this.listeners = {};
    }

    subscribe(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    publish(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
}

// Create a single instance of EventBus
const eventBus = new EventBus();

// Integration Service
class IntegrationService {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Timer Integration
        eventBus.subscribe(EventTypes.TIMER_COMPLETE, (data) => {
            this.handleTimerComplete(data);
        });

        // Focus Mode Integration
        eventBus.subscribe(EventTypes.FOCUS_MODE_CHANGE, (data) => {
            this.handleFocusModeChange(data);
        });

        // Goal Progress Integration
        eventBus.subscribe(EventTypes.GOAL_PROGRESS, (data) => {
            this.handleGoalProgress(data);
        });
    }

    handleTimerComplete(data) {
        // Update streak
        const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
        const today = new Date().toISOString().split('T')[0];
        
        if (!streakData.focusHistory) {
            streakData.focusHistory = {};
        }
        
        if (!streakData.focusHistory[today]) {
            streakData.focusHistory[today] = {
                sessions: 0,
                hours: 0
            };
        }
        
        streakData.focusHistory[today].sessions++;
        streakData.focusHistory[today].hours += (data.duration / 3600);
        
        localStorage.setItem('streakData', JSON.stringify(streakData));
        
        // Update challenges
        const challenges = JSON.parse(localStorage.getItem('challenges') || '[]');
        challenges.forEach(challenge => {
            if (challenge.status === 'in-progress') {
                challenge.progress = Math.min(100, challenge.progress + 5);
            }
        });
        localStorage.setItem('challenges', JSON.stringify(challenges));
        
        // Update goals
        const goals = JSON.parse(localStorage.getItem('smartGoals') || '[]');
        goals.forEach(goal => {
            if (goal.measureType === 'sessions') {
                goal.currentValue++;
            } else if (goal.measureType === 'hours') {
                goal.currentValue += (data.duration / 3600);
            }
        });
        localStorage.setItem('smartGoals', JSON.stringify(goals));
        
        // Publish updates
        eventBus.publish(EventTypes.STREAK_UPDATE, streakData);
        eventBus.publish(EventTypes.CHALLENGE_UPDATE, challenges);
        eventBus.publish(EventTypes.GOAL_PROGRESS, goals);
    }

    handleFocusModeChange(data) {
        // Update timer state if focus mode is disabled
        if (!data.isActive) {
            const timerState = JSON.parse(localStorage.getItem('timerState') || '{}');
            if (timerState.isRunning) {
                timerState.isRunning = false;
                localStorage.setItem('timerState', JSON.stringify(timerState));
            }
        }
    }

    handleGoalProgress(data) {
        // Check for goal completion and trigger achievements
        const streakData = JSON.parse(localStorage.getItem('streakData') || '{}');
        data.forEach(goal => {
            if (goal.currentValue >= goal.targetValue && !streakData.achievements.includes('goal-complete')) {
                streakData.achievements.push('goal-complete');
                this.showAchievementNotification('Goal Master', 'Completed your first SMART goal!');
            }
        });
        localStorage.setItem('streakData', JSON.stringify(streakData));
    }

    showAchievementNotification(title, message) {
        const notification = document.createElement('div');
        notification.className = `
            fixed bottom-4 right-4 bg-white text-gray-900 px-6 py-4 rounded-lg shadow-lg
            transform transition-transform duration-300 translate-y-0 flex items-center space-x-3
        `;
        notification.innerHTML = `
            <div class="flex-shrink-0">
                <i class="fas fa-trophy text-2xl text-yellow-500"></i>
            </div>
            <div>
                <div class="font-medium">${title}</div>
                <div class="text-sm">${message}</div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateY(200%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Export instances
window.antidoteServices = {
    eventBus,
    EventTypes,
    integration: new IntegrationService(),
    getCurrentUser,
    login,
    logout,
    loadUserState
};

// Initialize user state
loadUserState();
