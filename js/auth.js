const mockUsers = {
    'demo': {
        username: 'demo',
        password: 'demo123',
        level: 1,
        xp: 0,
        streak: 0,
        achievements: [],
        focusMinutes: 0,
        lastLogin: null
    }
};

// XP and Level constants
const XP_PER_MINUTE = 10;
const XP_PER_ACHIEVEMENT = 100;
const XP_STREAK_BONUS = 50;
const XP_TO_LEVEL_MULTIPLIER = 1.5;

// Calculate XP needed for next level
function getXPForLevel(level) {
    return Math.floor(1000 * Math.pow(XP_TO_LEVEL_MULTIPLIER, level - 1));
}

// Handle sign in
function handleSignIn(username, password) {
    const user = mockUsers[username];
    if (user && user.password === password) {
        // Simulate successful login
        if (window.antidoteServices && window.antidoteServices.login) {
            window.antidoteServices.login(username, password);
            return true;
        }
    }
    return false;
}

// Add XP and check for level up
function addXP(amount) {
    const currentUser = window.antidoteServices.getCurrentUser();
    if (!currentUser) return;

    currentUser.xp += amount;
    const nextLevelXP = getXPForLevel(currentUser.level + 1);

    if (currentUser.xp >= nextLevelXP) {
        currentUser.level++;
        showLevelUpAnimation();
        checkNewAchievements();
    }

    // Update user state
    window.antidoteServices.eventBus.publish(
        window.antidoteServices.EventTypes.USER_STATE_UPDATE,
        { user: currentUser }
    );
}

// Show level up animation
function showLevelUpAnimation() {
    const currentUser = window.antidoteServices.getCurrentUser();
    if (!currentUser) return;

    const levelUpEl = document.createElement('div');
    levelUpEl.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-50';
    levelUpEl.innerHTML = `
        <div class="text-4xl font-bold text-primary animate-bounce mb-2">
            Level Up!
        </div>
        <div class="text-xl text-gray-700">
            You've reached level ${currentUser.level}
        </div>
    `;

    document.body.appendChild(levelUpEl);
    
    // Add particles effect
    createParticles();

    setTimeout(() => {
        levelUpEl.remove();
    }, 3000);
}

// Create particle effect
function createParticles() {
    const colors = ['#2F855A', '#66A80F', '#975A16'];
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-2 h-2 rounded-full';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = '50%';
        particle.style.top = '50%';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 2;
        const distance = 100 + Math.random() * 100;
        
        particle.animate([
            { transform: 'translate(-50%, -50%)' },
            {
                transform: `translate(
                    calc(-50% + ${Math.cos(angle) * distance}px),
                    calc(-50% + ${Math.sin(angle) * distance}px)
                )`,
                opacity: 0
            }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
    }
}

// Check for new achievements
function checkNewAchievements() {
    const currentUser = window.antidoteServices.getCurrentUser();
    if (!currentUser) return;

    const achievements = [
        {
            id: 'first_session',
            title: 'First Steps',
            description: 'Complete your first focus session',
            condition: user => user.focusMinutes > 0
        },
        {
            id: 'level_5',
            title: 'Growing Strong',
            description: 'Reach level 5',
            condition: user => user.level >= 5
        },
        {
            id: 'streak_7',
            title: 'Consistency is Key',
            description: 'Maintain a 7-day streak',
            condition: user => user.streak >= 7
        }
    ];

    achievements.forEach(achievement => {
        if (!currentUser.achievements.includes(achievement.id) &&
            achievement.condition(currentUser)) {
            currentUser.achievements.push(achievement.id);
            showAchievementAnimation(achievement);
            addXP(XP_PER_ACHIEVEMENT);
        }
    });
}

// Show achievement animation
function showAchievementAnimation(achievement) {
    const achievementEl = document.createElement('div');
    achievementEl.className = 'fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 transform translate-x-full transition-transform duration-500';
    achievementEl.innerHTML = `
        <div class="flex items-center">
            <div class="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <i class="fas fa-trophy text-white text-xl"></i>
            </div>
            <div class="ml-4">
                <div class="font-semibold text-gray-900">${achievement.title}</div>
                <div class="text-sm text-gray-600">${achievement.description}</div>
            </div>
        </div>
    `;

    document.body.appendChild(achievementEl);
    
    // Animate in
    setTimeout(() => {
        achievementEl.style.transform = 'translate(0)';
    }, 100);

    // Animate out
    setTimeout(() => {
        achievementEl.style.transform = 'translate(110%)';
        setTimeout(() => achievementEl.remove(), 500);
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signin-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (handleSignIn(username, password)) {
                window.location.href = 'dashboard.html';
            } else {
                // Show error animation
                const inputs = form.querySelectorAll('input');
                inputs.forEach(input => {
                    input.classList.add('animate-shake');
                    setTimeout(() => input.classList.remove('animate-shake'), 500);
                });
            }
        });
    }

    // Add shake animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .animate-shake {
            animation: shake 0.2s ease-in-out 0s 2;
        }
    `;
    document.head.appendChild(style);
});

// Subscribe to focus session events
if (window.antidoteServices && window.antidoteServices.eventBus) {
    window.antidoteServices.eventBus.subscribe(
        window.antidoteServices.EventTypes.TIMER_COMPLETE,
        (data) => {
            const currentUser = window.antidoteServices.getCurrentUser();
            if (currentUser && data.duration) {
                const minutesFocused = Math.floor(data.duration / 60);
                currentUser.focusMinutes += minutesFocused;
                addXP(minutesFocused * XP_PER_MINUTE);
            }
        }
    );
}

// Make functions available globally
window.handleSignIn = handleSignIn;
