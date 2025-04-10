// DOM Elements
const streakCount = document.getElementById('streak-count');
const totalHours = document.getElementById('total-hours');
const totalSessions = document.getElementById('total-sessions');
const bestStreak = document.getElementById('best-streak');
const weeklyCalendar = document.getElementById('weekly-calendar');
const monthlyStats = document.getElementById('monthly-stats');
const achievements = document.getElementById('achievements');

// State
let userData = {
    currentStreak: 7,
    totalFocusHours: 42,
    completedSessions: 28,
    bestStreakDays: 14,
    focusHistory: {},
    achievements: []
};

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('streakData');
    if (savedData) {
        userData = JSON.parse(savedData);
        updateUI();
    }
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('streakData', JSON.stringify(userData));
}

// Update UI with current data
function updateUI() {
    streakCount.textContent = userData.currentStreak;
    totalHours.textContent = userData.totalFocusHours;
    totalSessions.textContent = userData.completedSessions;
    bestStreak.textContent = userData.bestStreakDays;
    
    renderWeeklyCalendar();
    updateMonthlyStats();
    checkAchievements();
}

// Render weekly calendar
function renderWeeklyCalendar() {
    weeklyCalendar.innerHTML = '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    // Add day labels
    days.forEach(day => {
        const dayLabel = document.createElement('div');
        dayLabel.className = 'text-center text-sm text-gray-600 font-medium';
        dayLabel.textContent = day;
        weeklyCalendar.appendChild(dayLabel);
    });
    
    // Add calendar squares for the current week
    days.forEach((_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - today.getDay() + index);
        const dateKey = date.toISOString().split('T')[0];
        
        const square = document.createElement('div');
        square.className = `
            aspect-square rounded-lg flex items-center justify-center
            ${dateKey in userData.focusHistory ? 'bg-primary text-white' : 'bg-gray-100'}
            ${date.toDateString() === today.toDateString() ? 'ring-2 ring-primary ring-offset-2' : ''}
        `;
        square.textContent = date.getDate();
        weeklyCalendar.appendChild(square);
    });
}

// Update monthly statistics
function updateMonthlyStats() {
    const monthlyGoals = {
        focusTime: 60, // 60 hours goal
        sessions: 40,  // 40 sessions goal
        streakDays: 30 // 30 days goal
    };
    
    const progressBars = monthlyStats.querySelectorAll('.bg-primary, .bg-secondary, .bg-accent');
    const stats = [
        (userData.totalFocusHours / monthlyGoals.focusTime) * 100,
        (userData.completedSessions / monthlyGoals.sessions) * 100,
        (userData.currentStreak / monthlyGoals.streakDays) * 100
    ];
    
    progressBars.forEach((bar, index) => {
        bar.style.width = `${Math.min(100, stats[index])}%`;
    });
}

// Check and update achievements
function checkAchievements() {
    const possibleAchievements = [
        {
            id: 'streak-7',
            name: '7-Day Streak',
            description: 'Maintained focus for a week',
            icon: 'fa-fire',
            color: 'text-orange-500',
            condition: () => userData.currentStreak >= 7
        },
        {
            id: '40-hours',
            name: '40 Hour Club',
            description: '40+ hours of focus time',
            icon: 'fa-clock',
            color: 'text-blue-500',
            condition: () => userData.totalFocusHours >= 40
        },
        {
            id: '25-sessions',
            name: 'Session Master',
            description: 'Completed 25+ focus sessions',
            icon: 'fa-star',
            color: 'text-yellow-500',
            condition: () => userData.completedSessions >= 25
        }
    ];
    
    // Check for new achievements
    possibleAchievements.forEach(achievement => {
        if (achievement.condition() && !userData.achievements.includes(achievement.id)) {
            userData.achievements.push(achievement.id);
            showAchievementNotification(achievement);
        }
    });
    
    // Render achievements
    renderAchievements(possibleAchievements);
}

// Render achievements in the UI
function renderAchievements(possibleAchievements) {
    achievements.innerHTML = '';
    
    userData.achievements.forEach(achievementId => {
        const achievement = possibleAchievements.find(a => a.id === achievementId);
        if (achievement) {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'p-4 border rounded-lg bg-gray-50';
            achievementElement.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                        <i class="fas ${achievement.icon} text-2xl ${achievement.color}"></i>
                    </div>
                    <div>
                        <div class="font-medium">${achievement.name}</div>
                        <div class="text-sm text-gray-600">${achievement.description}</div>
                    </div>
                </div>
            `;
            achievements.appendChild(achievementElement);
        }
    });
}

// Show achievement notification
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = `
        fixed bottom-4 right-4 bg-white text-gray-900 px-6 py-4 rounded-lg shadow-lg
        transform transition-transform duration-300 translate-y-0 flex items-center space-x-3
    `;
    notification.innerHTML = `
        <div class="flex-shrink-0">
            <i class="fas ${achievement.icon} text-2xl ${achievement.color}"></i>
        </div>
        <div>
            <div class="font-medium">New Achievement!</div>
            <div class="text-sm">${achievement.name}</div>
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

// Simulate focus session completion
function simulateFocusSession() {
    const today = new Date().toISOString().split('T')[0];
    
    // Update focus history
    if (!userData.focusHistory[today]) {
        userData.focusHistory[today] = {
            sessions: 0,
            hours: 0
        };
    }
    
    userData.focusHistory[today].sessions++;
    userData.focusHistory[today].hours += 0.5; // 30 minutes per session
    
    // Update total stats
    userData.completedSessions++;
    userData.totalFocusHours = parseFloat((userData.totalFocusHours + 0.5).toFixed(1));
    
    // Update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];
    
    if (userData.focusHistory[yesterdayKey]) {
        userData.currentStreak++;
    } else {
        userData.currentStreak = 1;
    }
    
    // Update best streak
    if (userData.currentStreak > userData.bestStreakDays) {
        userData.bestStreakDays = userData.currentStreak;
    }
    
    saveUserData();
    updateUI();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    
    // Simulate focus session completion every 30 seconds (for demo purposes)
    setInterval(simulateFocusSession, 30000);
});
