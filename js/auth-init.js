document.addEventListener('DOMContentLoaded', () => {
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const navUsername = document.getElementById('nav-username');
    const navLevel = document.getElementById('nav-level');
    const logoutBtn = document.getElementById('logout-btn');

    // Check if user is logged in
    function updateAuthUI() {
        if (window.antidoteServices && window.antidoteServices.getCurrentUser) {
            const user = window.antidoteServices.getCurrentUser();
            if (user) {
                // Show user profile
                if (authButtons && userProfile) {
                    authButtons.classList.add('hidden');
                    userProfile.classList.remove('hidden');
                    userProfile.classList.add('flex');
                }
                
                // Update user info
                if (navUsername) {
                    navUsername.textContent = user.username;
                }
                if (navLevel) {
                    navLevel.textContent = user.level;
                }
            } else {
                // Show auth buttons
                if (authButtons && userProfile) {
                    authButtons.classList.remove('hidden');
                    userProfile.classList.remove('flex');
                    userProfile.classList.add('hidden');
                }
            }
        }
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (window.antidoteServices && window.antidoteServices.logout) {
                window.antidoteServices.logout();
                window.location.href = 'signin.html';
            }
        });
    }

    // Subscribe to auth state changes
    if (window.antidoteServices && window.antidoteServices.eventBus) {
        window.antidoteServices.eventBus.subscribe(
            window.antidoteServices.EventTypes.USER_STATE_UPDATE,
            updateAuthUI
        );
    }

    // Initial auth check
    updateAuthUI();
});
