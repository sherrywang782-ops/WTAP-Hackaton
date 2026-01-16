// Role selection functionality
document.addEventListener('DOMContentLoaded', function() {
    const roleCards = document.querySelectorAll('.role-card');
    const roleButtons = document.querySelectorAll('.role-button');

    // Add click handlers to cards and buttons
    roleCards.forEach(card => {
        const role = card.getAttribute('data-role');
        
        // Card click handler
        card.addEventListener('click', function() {
            handleRoleSelection(role);
        });

        // Button click handler (stop propagation to prevent double trigger)
        const button = card.querySelector('.role-button');
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            handleRoleSelection(role);
        });

        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleRoleSelection(role);
            }
        });
    });

    // Add hover sound effect (optional - can be removed if not needed)
    roleCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add a subtle animation class
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });
    });
});

function handleRoleSelection(role) {
    // Add visual feedback
    const selectedCard = document.querySelector(`[data-role="${role}"]`);
    
    // Create a ripple effect
    createRippleEffect(selectedCard);
    
    // Log the selection
    console.log(`Selected role: ${role}`);
    
    // Show passcode screen for mentor and mentee, planner goes to different page
    if (role === 'mentor' || role === 'mentee') {
        showPasscodeScreen(role);
    } else if (role === 'planner') {
        // Planner goes to planner dashboard (to be implemented)
        showSelectionMessage(role);
        // TODO: Navigate to planner dashboard
    }
}

function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.width = '0px';
    ripple.style.height = '0px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.transition = 'width 0.6s, height 0.6s, opacity 0.6s';
    ripple.style.opacity = '1';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    // Trigger animation
    setTimeout(() => {
        ripple.style.width = '400px';
        ripple.style.height = '400px';
        ripple.style.opacity = '0';
    }, 10);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showSelectionMessage(role) {
    // Create a temporary notification
    const message = document.createElement('div');
    message.textContent = `You selected: ${role.charAt(0).toUpperCase() + role.slice(1)}! 🎉`;
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.left = '50%';
    message.style.transform = 'translateX(-50%)';
    message.style.background = 'linear-gradient(135deg, #8B5CF6, #EC4899)';
    message.style.color = 'white';
    message.style.padding = '1rem 2rem';
    message.style.borderRadius = '50px';
    message.style.fontWeight = '600';
    message.style.zIndex = '1000';
    message.style.boxShadow = '0 10px 30px rgba(139, 92, 246, 0.4)';
    message.style.animation = 'fadeInDown 0.5s ease-out';
    
    document.body.appendChild(message);
    
    // Remove message after 2 seconds
    setTimeout(() => {
        message.style.animation = 'fadeOutUp 0.5s ease-out';
        setTimeout(() => {
            message.remove();
        }, 500);
    }, 2000);
}

// Passcode screen functionality
function showPasscodeScreen(role) {
    const passcodeScreen = document.getElementById('passcodeScreen');
    const passcodeTitle = document.getElementById('passcodeTitle');
    const passcodeSubtitle = document.getElementById('passcodeSubtitle');
    const passcodeIcon = document.getElementById('passcodeIcon');
    const passcodeInput = document.getElementById('passcodeInput');
    const passcodeError = document.getElementById('passcodeError');
    
    // Update content based on role
    if (role === 'mentor') {
        passcodeTitle.textContent = 'Enter Event Passcode';
        passcodeSubtitle.textContent = 'Enter the passcode to join as a mentor and start making a difference!';
        passcodeIcon.textContent = '🎓';
    } else if (role === 'mentee') {
        passcodeTitle.textContent = 'Enter Event Passcode';
        passcodeSubtitle.textContent = 'Enter the passcode to find your perfect mentor and begin your journey!';
        passcodeIcon.textContent = '🌟';
    }
    
    // Clear previous input and error
    passcodeInput.value = '';
    passcodeError.textContent = '';
    passcodeError.classList.remove('show');
    
    // Show the screen
    passcodeScreen.classList.add('active');
    passcodeInput.focus();
    
    // Store the role for later use
    passcodeScreen.setAttribute('data-role', role);
}

function hidePasscodeScreen() {
    const passcodeScreen = document.getElementById('passcodeScreen');
    passcodeScreen.classList.remove('active');
}

function validatePasscode(passcode, role) {
    // TODO: Replace with actual API call to validate passcode
    // For now, accept any non-empty passcode (you'll implement real validation later)
    if (passcode.trim().length === 0) {
        return { valid: false, message: 'Please enter a passcode' };
    }
    
    // Example validation - replace with actual check
    // This is just a placeholder
    return { valid: true, message: '' };
}

// Set up passcode screen event listeners
document.addEventListener('DOMContentLoaded', function() {
    const passcodeScreen = document.getElementById('passcodeScreen');
    const backButton = document.getElementById('backButton');
    const passcodeInput = document.getElementById('passcodeInput');
    const passcodeSubmit = document.getElementById('passcodeSubmit');
    const passcodeError = document.getElementById('passcodeError');
    
    // Back button
    backButton.addEventListener('click', function() {
        hidePasscodeScreen();
    });
    
    // Submit button
    passcodeSubmit.addEventListener('click', function() {
        const role = passcodeScreen.getAttribute('data-role');
        const passcode = passcodeInput.value.trim();
        
        const validation = validatePasscode(passcode, role);
        
        if (validation.valid) {
            // Hide error
            passcodeError.classList.remove('show');
            
            // TODO: Navigate to the matching event page with the passcode
            console.log(`Passcode validated for ${role}: ${passcode}`);
            
            // For now, show success message
            showSelectionMessage(`${role} - Passcode accepted!`);
            hidePasscodeScreen();
            
            // TODO: Navigate to matching event page
            // window.location.href = `/matching-event?role=${role}&passcode=${passcode}`;
        } else {
            // Show error
            passcodeError.textContent = validation.message;
            passcodeError.classList.add('show');
            passcodeInput.focus();
        }
    });
    
    // Enter key support
    passcodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            passcodeSubmit.click();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && passcodeScreen.classList.contains('active')) {
            hidePasscodeScreen();
        }
    });
});

// Add fadeOutUp animation to CSS dynamically (or add to CSS file)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOutUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-30px);
        }
    }
`;
document.head.appendChild(style);

