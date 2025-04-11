// Plant Growth Stages
const GROWTH_STAGES = [
    {
        name: 'Sprout',
        icon: 'fa-seedling',
        minLevel: 1,
        health: 100
    },
    {
        name: 'Sapling',
        icon: 'fa-leaf',
        minLevel: 5,
        health: 100
    },
    {
        name: 'Young Tree',
        icon: 'fa-tree',
        minLevel: 10,
        health: 100
    },
    {
        name: 'Mature Tree',
        icon: 'fa-tree fa-lg',
        minLevel: 15,
        health: 100
    },
    {
        name: 'Ancient Tree',
        icon: 'fa-tree fa-2x',
        minLevel: 20,
        health: 100
    }
];

// Health decay rates (per day)
const HEALTH_DECAY_RATE = 20; // Lose 20% health per day without focus sessions
const HEALTH_GAIN_PER_SESSION = 25; // Gain 25% health per focus session

// DOM Elements
const plantContainer = document.getElementById('plant-container');
const currentPlant = document.getElementById('current-plant');
const growthStage = document.getElementById('growth-stage');
const plantHealth = document.getElementById('plant-health');
const nextStage = document.getElementById('next-stage');
const currentLevel = document.getElementById('current-level');
const currentXp = document.getElementById('current-xp');
const nextLevelXp = document.getElementById('next-level-xp');
const xpProgress = document.getElementById('xp-progress');
const focusMinutes = document.getElementById('focus-minutes');
const currentStreak = document.getElementById('current-streak');
const achievementsCount = document.getElementById('achievements-count');
const activityFeed = document.getElementById('activity-feed');

// Update plant display
function updatePlantDisplay(user) {
    if (!user) return;

    // Find current growth stage
    const currentStage = GROWTH_STAGES.reduce((prev, curr) => {
        return (user.level >= curr.minLevel && curr.minLevel >= prev.minLevel) ? curr : prev;
    }, GROWTH_STAGES[0]);

    // Update plant icon and stage name
    currentPlant.className = `fas ${currentStage.icon} text-6xl text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`;
    growthStage.textContent = currentStage.name;

    // Find next stage
    const nextGrowthStage = GROWTH_STAGES.find(stage => stage.minLevel > user.level) || currentStage;
    nextStage.textContent = `${nextGrowthStage.name} (Level ${nextGrowthStage.minLevel})`;

    // Update health based on streak
    const lastActivity = new Date(user.lastActivity || user.lastLogin);
    const daysSinceActivity = Math.floor((new Date() - lastActivity) / (1000 * 60 * 60 * 24));
    const healthLoss = Math.min(100, daysSinceActivity * HEALTH_DECAY_RATE);
    const currentHealth = Math.max(0, 100 - healthLoss);

    // Update health bar
    plantHealth.style.width = `${currentHealth}%`;
    if (currentHealth < 30) {
        plantHealth.classList.remove('bg-primary');
        plantHealth.classList.add('bg-red-500');
    } else {
        plantHealth.classList.remove('bg-red-500');
        plantHealth.classList.add('bg-primary');
    }

    // Add wilting effect if health is low
    if (currentHealth < 50) {
        currentPlant.style.filter = `opacity(${currentHealth}%)`;
        currentPlant.style.transform = `translate(-50%, -50%) rotate(${(50 - currentHealth) / 2}deg)`;
    } else {
        currentPlant.style.filter = '';
        currentPlant.style.transform = 'translate(-50%, -50%)';
    }
}

// Update progress displays
function updateProgressDisplays(user) {
    if (!user) return;

    // Update level and XP
    currentLevel.textContent = user.level;
    currentXp.textContent = user.xp;
    const nextLevelXpRequired = Math.floor(1000 * Math.pow(1.5, user.level - 1));
    nextLevelXp.textContent = nextLevelXpRequired;
    
    // Update XP progress bar
    const progress = (user.xp / nextLevelXpRequired) * 100;
    xpProgress.style.width = `${Math.min(100, progress)}%`;

    // Update stats
    focusMinutes.textContent = user.focusMinutes || 0;
    currentStreak.textContent = user.streak || 0;
    achievementsCount.textContent = (user.achievements || []).length;
}

// Add activity to feed
function addActivity(activity) {
    const activityElement = document.createElement('div');
    activityElement.className = 'flex items-center space-x-4 p-4 bg-gray-50 rounded-lg';

    const icon = document.createElement('div');
    icon.className = 'w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center';
    icon.innerHTML = `<i class="fas ${activity.icon} text-primary"></i>`;

    const content = document.createElement('div');
    content.className = 'flex-1';
    content.innerHTML = `
        <div class="font-medium">${activity.title}</div>
        <div class="text-sm text-gray-600">${activity.description}</div>
    `;

    const time = document.createElement('div');
    time.className = 'text-sm text-gray-500';
    time.textContent = activity.time;

    activityElement.appendChild(icon);
    activityElement.appendChild(content);
    activityElement.appendChild(time);

    activityFeed.insertBefore(activityElement, activityFeed.firstChild);
}

// Subscribe to user state updates
window.antidoteServices.eventBus.subscribe(
    window.antidoteServices.EventTypes.USER_STATE_UPDATE,
    (data) => {
        updatePlantDisplay(data.user);
        updateProgressDisplays(data.user);
    }
);

// Subscribe to timer completion
window.antidoteServices.eventBus.subscribe(
    window.antidoteServices.EventTypes.TIMER_COMPLETE,
    (data) => {
        const user = window.antidoteServices.getCurrentUser();
        if (user) {
            addActivity({
                icon: 'fa-clock',
                title: 'Focus Session Completed',
                description: `Completed a ${Math.floor(data.duration / 60)} minute focus session`,
                time: 'Just now'
            });
        }
    }
);

// Initial update
document.addEventListener('DOMContentLoaded', () => {
    const user = window.antidoteServices.getCurrentUser();
    if (user) {
        updatePlantDisplay(user);
        updateProgressDisplays(user);
    }
});
