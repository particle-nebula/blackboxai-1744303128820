const { handleSignIn } = require('./auth.js');

function testLogin() {
    const username = 'demo';
    const password = 'demo123';
    
    const loginSuccess = handleSignIn(username, password);
    
    if (loginSuccess) {
        console.log('Login successful: User is now logged in.');
    } else {
        console.log('Login failed: Invalid credentials');
    }
}

// Run the test
testLogin();
