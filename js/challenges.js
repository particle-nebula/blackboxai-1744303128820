// DOM Elements
const createChallengeBtn = document.getElementById('create-challenge-btn');
const challengeModal = document.getElementById('challenge-modal');
const challengeForm = document.getElementById('challenge-form');
const cancelChallengeBtn = document.getElementById('cancel-challenge');
const activeChallengesContainer = document.getElementById('active-challenges');
const leaderboardContainer = document.getElementById('leaderboard');

// Mock Data
let challenges = [
    {
        id: 1,
        name: 'Weekly Focus Sprint',
        description: 'Complete 20 Pomodoro sessions this week',
        status: 'in-progress',
        participants: [
            { id: 1, avatar: 'https://i.pravatar.cc/100?img=1' },
            { id: 2, avatar: 'https://i.pravatar.cc/100?img=2' },
            { id: 3, avatar: 'https://i.pravatar.cc/100?img=3' }
        ],
        timeRemaining: '3 days',
        progress: 65
    },
    {
        id: 2,
        name: 'Study Group Challenge',
        description: 'Maintain focus streak for 5 days',
        status: 'starting-soon',
        participants: [
            { id: 4, avatar: 'https://i.pravatar.cc/100?img=4' },
            { id: 5, avatar: 'https://i.pravatar.cc/100?img=5' }
        ],
        timeRemaining: 'Starts tomorrow',
        progress: 0
    }
];

// Load challenges from localStorage
function loadChallenges() {
    const savedChallenges = localStorage.getItem('challenges');
    if (savedChallenges) {
        challenges = JSON.parse(savedChallenges);
        renderChallenges();
    }
}

// Save challenges to localStorage
function saveChallenges() {
    localStorage.setItem('challenges', JSON.stringify(challenges));
}

// Render challenges in the UI
function renderChallenges() {
    activeChallengesContainer.innerHTML = challenges.map(challenge => `
        <div class="border rounded-lg p-4 hover:border-primary transition-colors duration-200">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h4 class="font-semibold text-lg text-gray-900">${challenge.name}</h4>
                    <p class="text-gray-600 text-sm">${challenge.description}</p>
                </div>
                <span class="bg-${challenge.status === 'in-progress' ? 'green' : 'yellow'}-100 
                           text-${challenge.status === 'in-progress' ? 'green' : 'yellow'}-800 
                           text-xs font-medium px-2.5 py-0.5 rounded">
                    ${challenge.status === 'in-progress' ? 'In Progress' : 'Starting Soon'}
                </span>
            </div>
            <div class="flex items-center justify-between">
                <div class="flex -space-x-2">
                    ${challenge.participants.map(participant => `
                        <img class="w-8 h-8 rounded-full border-2 border-white" 
                             src="${participant.avatar}" 
                             alt="Participant">
                    `).join('')}
                </div>
                <div class="text-sm text-gray-600">
                    <i class="far ${challenge.status === 'in-progress' ? 'fa-clock' : 'fa-calendar'} mr-1"></i>
                    ${challenge.timeRemaining}
                </div>
            </div>
            ${challenge.status === 'in-progress' ? `
                <div class="mt-4">
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-primary h-2.5 rounded-full" style="width: ${challenge.progress}%"></div>
                    </div>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Show create challenge modal
function showModal() {
    challengeModal.classList.remove('hidden');
}

// Hide create challenge modal
function hideModal() {
    challengeModal.classList.add('hidden');
}

// Create new challenge
function createChallenge(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const newChallenge = {
        id: challenges.length + 1,
        name: formData.get('challenge-name'),
        description: formData.get('challenge-description'),
        status: 'starting-soon',
        participants: [
            { id: 1, avatar: 'https://i.pravatar.cc/100?img=1' }
        ],
        timeRemaining: 'Starts tomorrow',
        progress: 0
    };
    
    challenges.unshift(newChallenge);
    saveChallenges();
    renderChallenges();
    hideModal();
    
    // Show success notification
    showNotification('Challenge created successfully!');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-0';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateY(200%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update challenge progress (simulated)
function simulateProgress() {
    challenges = challenges.map(challenge => {
        if (challenge.status === 'in-progress') {
            challenge.progress = Math.min(100, challenge.progress + Math.random() * 10);
        }
        return challenge;
    });
    
    saveChallenges();
    renderChallenges();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadChallenges();
    
    createChallengeBtn.addEventListener('click', showModal);
    cancelChallengeBtn.addEventListener('click', hideModal);
    challengeForm.addEventListener('submit', createChallenge);
    
    // Close modal when clicking outside
    challengeModal.addEventListener('click', (e) => {
        if (e.target === challengeModal) {
            hideModal();
        }
    });
    
    // Simulate progress updates every 30 seconds
    setInterval(simulateProgress, 30000);
});

// Handle escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !challengeModal.classList.contains('hidden')) {
        hideModal();
    }
});
