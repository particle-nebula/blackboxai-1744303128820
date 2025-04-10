// DOM Elements
const goalForm = document.getElementById('goal-form');
const activeGoalsContainer = document.getElementById('active-goals');
const goalModal = document.getElementById('goal-modal');
const goalModalContent = document.getElementById('goal-modal-content');

// State
let goals = [];

// Load goals from localStorage
function loadGoals() {
    const savedGoals = localStorage.getItem('smartGoals');
    if (savedGoals) {
        goals = JSON.parse(savedGoals);
        renderGoals();
    }
}

// Save goals to localStorage
function saveGoals() {
    localStorage.setItem('smartGoals', JSON.stringify(goals));
}

// Format date for display
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Calculate progress percentage
function calculateProgress(goal) {
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const startDate = new Date(goal.createdAt);
    const totalDays = (deadline - startDate) / (1000 * 60 * 60 * 24);
    const daysElapsed = (today - startDate) / (1000 * 60 * 60 * 24);
    
    // Calculate progress based on goal type
    let progress;
    switch (goal.measureType) {
        case 'sessions':
            progress = (goal.currentValue / goal.targetValue) * 100;
            break;
        case 'hours':
            progress = (goal.currentValue / goal.targetValue) * 100;
            break;
        case 'streak':
            progress = (goal.currentValue / goal.targetValue) * 100;
            break;
        default:
            progress = (daysElapsed / totalDays) * 100;
    }
    
    return Math.min(Math.max(progress, 0), 100);
}

// Render goals in the UI
function renderGoals() {
    activeGoalsContainer.innerHTML = goals.map((goal, index) => {
        const progress = calculateProgress(goal);
        const status = progress >= 100 ? 'completed' : 
                      new Date(goal.deadline) < new Date() ? 'overdue' : 'active';
        
        return `
            <div class="border rounded-lg p-6 hover:border-primary transition-colors duration-200">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="font-semibold text-lg text-gray-900">${goal.specific}</h4>
                        <p class="text-gray-600 text-sm">${goal.relevant}</p>
                    </div>
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${
                        status === 'completed' ? 'bg-green-100 text-green-800' :
                        status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                    }">
                        ${status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>

                <div class="space-y-2">
                    <div class="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>${Math.round(progress)}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-primary h-2 rounded-full transition-all duration-300"
                             style="width: ${progress}%"></div>
                    </div>
                </div>

                <div class="mt-4 flex justify-between items-center text-sm">
                    <div class="text-gray-600">
                        <i class="far fa-calendar mr-1"></i>
                        Due ${formatDate(goal.deadline)}
                    </div>
                    <div class="space-x-2">
                        <button onclick="updateGoalProgress(${index})"
                                class="text-primary hover:text-indigo-700">
                            <i class="fas fa-plus-circle"></i>
                            Update
                        </button>
                        <button onclick="showGoalDetails(${index})"
                                class="text-gray-600 hover:text-gray-800">
                            <i class="fas fa-info-circle"></i>
                            Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Create new goal
function createGoal(event) {
    event.preventDefault();
    
    const newGoal = {
        specific: document.getElementById('goal-specific').value,
        measureType: document.getElementById('goal-measurable').value,
        targetValue: parseInt(document.getElementById('goal-target').value),
        currentValue: 0,
        achievable: document.querySelector('input[name="achievable"]:checked').value,
        relevant: document.getElementById('goal-relevant').value,
        deadline: document.getElementById('goal-deadline').value,
        reminders: {
            daily: document.querySelector('input[name="reminder-daily"]').checked,
            weekly: document.querySelector('input[name="reminder-weekly"]').checked,
            time: document.getElementById('reminder-time').value
        },
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
    };
    
    goals.unshift(newGoal);
    saveGoals();
    renderGoals();
    
    // Reset form
    event.target.reset();
    
    // Show success notification
    showNotification('Goal created successfully!');
    
    // Set up reminders
    setupReminders(newGoal);
}

// Update goal progress
function updateGoalProgress(index) {
    const goal = goals[index];
    let increment;
    
    switch (goal.measureType) {
        case 'sessions':
            increment = 1;
            break;
        case 'hours':
            increment = 0.5;
            break;
        case 'streak':
            increment = 1;
            break;
        default:
            increment = 1;
    }
    
    goal.currentValue = (goal.currentValue || 0) + increment;
    goal.lastUpdated = new Date().toISOString();
    
    saveGoals();
    renderGoals();
    
    // Check if goal is completed
    if (goal.currentValue >= goal.targetValue) {
        showNotification('Congratulations! Goal completed! 🎉');
    } else {
        showNotification('Progress updated!');
    }
}

// Show goal details
function showGoalDetails(index) {
    const goal = goals[index];
    const progress = calculateProgress(goal);
    
    goalModalContent.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-900 mb-4">${goal.specific}</h3>
        <div class="space-y-4">
            <div>
                <div class="text-sm font-medium text-gray-700">Progress</div>
                <div class="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-primary h-2 rounded-full" style="width: ${progress}%"></div>
                </div>
                <div class="mt-1 text-sm text-gray-600">${Math.round(progress)}% complete</div>
            </div>
            <div>
                <div class="text-sm font-medium text-gray-700">Target</div>
                <div class="text-sm text-gray-600">
                    ${goal.targetValue} ${goal.measureType}
                </div>
            </div>
            <div>
                <div class="text-sm font-medium text-gray-700">Current Progress</div>
                <div class="text-sm text-gray-600">
                    ${goal.currentValue || 0} ${goal.measureType}
                </div>
            </div>
            <div>
                <div class="text-sm font-medium text-gray-700">Deadline</div>
                <div class="text-sm text-gray-600">${formatDate(goal.deadline)}</div>
            </div>
            <div>
                <div class="text-sm font-medium text-gray-700">Reminders</div>
                <div class="text-sm text-gray-600">
                    ${goal.reminders.daily ? 'Daily' : ''}
                    ${goal.reminders.weekly ? 'Weekly' : ''}
                    at ${goal.reminders.time}
                </div>
            </div>
            <div>
                <div class="text-sm font-medium text-gray-700">Last Updated</div>
                <div class="text-sm text-gray-600">${formatDate(goal.lastUpdated)}</div>
            </div>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
            <button onclick="hideGoalDetails()"
                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                Close
            </button>
            <button onclick="deleteGoal(${index})"
                    class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                Delete Goal
            </button>
        </div>
    `;
    
    goalModal.classList.remove('hidden');
}

// Hide goal details modal
function hideGoalDetails() {
    goalModal.classList.add('hidden');
}

// Delete goal
function deleteGoal(index) {
    if (confirm('Are you sure you want to delete this goal?')) {
        goals.splice(index, 1);
        saveGoals();
        renderGoals();
        hideGoalDetails();
        showNotification('Goal deleted');
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = `
        fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg
        transform transition-transform duration-300 translate-y-0
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(200%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Set up reminders
function setupReminders(goal) {
    // This is a mock implementation since we can't set real notifications in a web demo
    if (goal.reminders.daily || goal.reminders.weekly) {
        console.log(`Reminder set for goal: ${goal.specific}`);
        console.log(`Time: ${goal.reminders.time}`);
        console.log(`Frequency: ${goal.reminders.daily ? 'Daily' : ''} ${goal.reminders.weekly ? 'Weekly' : ''}`);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadGoals();
    goalForm.addEventListener('submit', createGoal);
    
    // Close modal when clicking outside
    goalModal.addEventListener('click', (e) => {
        if (e.target === goalModal) {
            hideGoalDetails();
        }
    });
});

// Handle escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !goalModal.classList.contains('hidden')) {
        hideGoalDetails();
    }
});
