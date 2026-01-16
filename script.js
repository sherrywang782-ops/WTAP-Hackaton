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
    const emailInput = document.getElementById('emailInput');
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
    clearPasscodeInputs();
    emailInput.value = '';
    passcodeError.textContent = '';
    passcodeError.classList.remove('show');
    
    // Show the screen
    passcodeScreen.classList.add('active');
    
    // Focus email input after a short delay to ensure screen is visible
    setTimeout(() => {
        emailInput.focus();
    }, 100);
    
    // Store the role for later use
    passcodeScreen.setAttribute('data-role', role);
}

function clearPasscodeInputs() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`passcodeDigit${i}`).value = '';
    }
}

function getPasscode() {
    let passcode = '';
    for (let i = 1; i <= 4; i++) {
        passcode += document.getElementById(`passcodeDigit${i}`).value || '';
    }
    return passcode;
}

function hidePasscodeScreen() {
    const passcodeScreen = document.getElementById('passcodeScreen');
    passcodeScreen.classList.remove('active');
}

function validatePasscode(passcode, email, role) {
    // Validate email
    if (!email || email.trim() === '') {
        return { valid: false, message: 'Please enter your email address' };
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return { valid: false, message: 'Please enter a valid email address' };
    }
    
    // Validate passcode
    if (passcode.length !== 4) {
        return { valid: false, message: 'Please enter a 4-digit passcode' };
    }
    
    // Check if all digits are numbers
    if (!/^\d{4}$/.test(passcode)) {
        return { valid: false, message: 'Passcode must contain only numbers' };
    }
    
    // Hardcoded: always accept any 4-digit passcode with valid email
    return { valid: true, message: '' };
}

// Store user data for tracking answers
function storeUserData(email, role, passcode) {
    const userData = {
        email: email.trim(),
        role: role,
        passcode: passcode,
        answers: {},
        timestamp: new Date().toISOString()
    };
    
    // Store in localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Also store in a global variable for easy access
    window.currentUser = userData;
    
    console.log('User data stored:', userData);
}

// Set up passcode screen event listeners
document.addEventListener('DOMContentLoaded', function() {
    const passcodeScreen = document.getElementById('passcodeScreen');
    const backButton = document.getElementById('backButton');
    const passcodeSubmit = document.getElementById('passcodeSubmit');
    const passcodeError = document.getElementById('passcodeError');
    
    // Get email input
    const emailInput = document.getElementById('emailInput');
    
    // Email input Enter key support
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            // Move focus to first passcode digit
            document.getElementById('passcodeDigit1').focus();
        }
    });
    
    // Get all digit inputs
    const digitInputs = [];
    for (let i = 1; i <= 4; i++) {
        digitInputs.push(document.getElementById(`passcodeDigit${i}`));
    }
    
    // Set up digit input handlers
    digitInputs.forEach((input, index) => {
        // Only allow numbers
        input.addEventListener('input', function(e) {
            // Remove any non-numeric characters
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // If a digit was entered, move to next input
            if (this.value.length > 0 && index < 3) {
                digitInputs[index + 1].focus();
            }
            
            // Auto-submit when all 4 digits are filled
            if (getPasscode().length === 4) {
                // Small delay to ensure the last digit is set
                setTimeout(() => {
                    passcodeSubmit.click();
                }, 100);
            }
        });
        
        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '' && index > 0) {
                // Move to previous input and clear it
                digitInputs[index - 1].focus();
                digitInputs[index - 1].value = '';
            }
        });
        
        // Handle paste
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = (e.clipboardData || window.clipboardData).getData('text');
            const digits = pastedData.replace(/[^0-9]/g, '').slice(0, 4);
            
            // Fill inputs with pasted digits
            for (let i = 0; i < digits.length && i < 4; i++) {
                digitInputs[i].value = digits[i];
            }
            
            // Focus the next empty input or the last one
            const nextEmptyIndex = digits.length < 4 ? digits.length : 3;
            digitInputs[nextEmptyIndex].focus();
            
            // Auto-submit if all 4 digits are filled
            if (digits.length === 4) {
                setTimeout(() => {
                    passcodeSubmit.click();
                }, 100);
            }
        });
        
        // Handle arrow keys
        input.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                digitInputs[index - 1].focus();
            } else if (e.key === 'ArrowRight' && index < 3) {
                e.preventDefault();
                digitInputs[index + 1].focus();
            }
        });
    });
    
    // Back button
    backButton.addEventListener('click', function() {
        hidePasscodeScreen();
    });
    
    // Submit button
    passcodeSubmit.addEventListener('click', function() {
        console.log('Submit button clicked');
        
        const role = passcodeScreen.getAttribute('data-role');
        const passcode = getPasscode();
        const email = document.getElementById('emailInput').value.trim();
        
        console.log('Role:', role, 'Passcode:', passcode, 'Email:', email);
        
        const validation = validatePasscode(passcode, email, role);
        
        console.log('Validation result:', validation);
        
        if (validation.valid) {
            // Hide error
            passcodeError.classList.remove('show');
            
            // Store user data (email, role, passcode) for tracking answers
            storeUserData(email, role, passcode);
            
            // Hide passcode screen and show category animation
            hidePasscodeScreen();
            // Start with first category
            const firstCategory = Object.keys(surveyQuestions)[0];
            console.log('Starting category:', firstCategory);
            showCategoryScreen(firstCategory);
        } else {
            // Show error
            console.log('Validation failed:', validation.message);
            passcodeError.textContent = validation.message;
            passcodeError.classList.add('show');
            clearPasscodeInputs();
            document.getElementById('emailInput').focus();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && passcodeScreen.classList.contains('active')) {
            hidePasscodeScreen();
        }
    });
});

// Survey Questions Data
const surveyQuestions = {
    'Category 1: Self-Reflection': [
        { type: 'slider', text: 'I want to run a marathon, but am not a runner. Oh no! I am the type of person to create a well thought out plan for myself including categories like training and diet' },
        { type: 'slider', text: 'Ben is giving a presentation. If I stare at his face I know how he is feeling.' },
        { type: 'slider', text: 'Now it is my turn to give a presentation. Afterwards, my friend says that I speak too loud. This really affects how I feel.' }
    ],
    'Category 2: Your Vibe ✨': [
        { type: 'fillblank', text: 'Your ideal Friday night activity is ____ (e.g. staying in with a show, chill hangout with 1–2 people, going out)' },
        { type: 'fillblank', text: 'My current favorite way to procrastinate is __________ (e.g. doomscroll, cooking)' },
        { type: 'fillblank', text: 'One hobby I never get tired of is __________ (e.g. baking, reading, sports)' },
        { type: 'fillblank', text: 'My favorite physical activity is _______ (e.g. walking, playing a sport, etc.)' }
    ],
    'Category 3: Career Interests 💼': [
        { type: 'ranking', text: 'Rank these tech areas from most to least interesting (drag to reorder)', options: ['Software Development', 'Data Science', 'Cybersecurity', 'AI/ML', 'Web Development', 'Undecisive', 'Other'] }
    ]
};

// Category metadata
const categoryMetadata = {
    'Category 1: Self-Reflection': {
        number: 1,
        name: 'Self-Reflection',
        icon: '🧘'
    },
    'Category 2: Your Vibe ✨': {
        number: 2,
        name: 'Your Vibe ✨',
        icon: '✨'
    },
    'Category 3: Career Interests 💼': {
        number: 3,
        name: 'Career Interests 💼',
        icon: '💼'
    }
};

// Track current question state
let currentCategory = null;
let currentQuestionIndex = 0;
let currentQuestions = [];

// Category and Survey Screen Functions
function showCategoryScreen(categoryKey) {
    const categoryScreen = document.getElementById('categoryScreen');
    const categoryNumber = document.getElementById('categoryNumber');
    const categoryTitle = document.getElementById('categoryTitle');
    const categoryIcon = document.getElementById('categoryIcon');
    
    // Update category display
    const metadata = categoryMetadata[categoryKey];
    if (metadata) {
        categoryNumber.textContent = `Category ${metadata.number}`;
        categoryTitle.textContent = metadata.name;
        categoryIcon.textContent = metadata.icon;
    }
    
    categoryScreen.classList.add('active');
    
    // After 2 seconds, hide category and show survey
    setTimeout(() => {
        hideCategoryScreen();
        currentCategory = categoryKey;
        currentQuestionIndex = 0;
        currentQuestions = surveyQuestions[currentCategory];
        showSurveyScreen();
    }, 2000);
}

function hideCategoryScreen() {
    const categoryScreen = document.getElementById('categoryScreen');
    categoryScreen.classList.remove('active');
}

function showSurveyScreen() {
    const surveyScreen = document.getElementById('surveyScreen');
    const surveyQuestion = document.getElementById('surveyQuestion');
    const sliderContainer = document.getElementById('sliderContainer');
    const fillblankContainer = document.getElementById('fillblankContainer');
    const rankingContainer = document.getElementById('rankingContainer');
    
    // Check if there are questions in this category
    if (currentQuestions.length === 0) {
        // No questions in this category yet
        hideSurveyScreen();
        alert(`Category ${currentCategory} is coming soon! No questions available yet.`);
        return;
    }
    
    // Get current question
    const currentQuestion = currentQuestions[currentQuestionIndex];
    
    // Update question text and show appropriate question type
    if (currentQuestion.type === 'slider') {
        // Show slider, hide others
        sliderContainer.style.display = 'block';
        fillblankContainer.style.display = 'none';
        rankingContainer.style.display = 'none';
        surveyQuestion.style.display = 'block';
        surveyQuestion.textContent = currentQuestion.text;
        surveyScreen.classList.add('active');
        initializeSlider();
    } else if (currentQuestion.type === 'fillblank') {
        // Show fillblank, hide others
        sliderContainer.style.display = 'none';
        fillblankContainer.style.display = 'block';
        rankingContainer.style.display = 'none';
        // Show fillblank, hide slider
        sliderContainer.style.display = 'none';
        fillblankContainer.style.display = 'block';
        
        // Parse the fill-in-the-blank question
        const fillblankPrompt = document.getElementById('fillblankPrompt');
        const fillblankHint = document.getElementById('fillblankHint');
        
        // Hide the regular question text
        surveyQuestion.style.display = 'none';
        
        // Parse the question text - find text before ____
        const blankMatch = currentQuestion.text.match(/(.+?)\s*____/);
        if (blankMatch) {
            // Show the part before the blank in the prompt
            fillblankPrompt.textContent = blankMatch[1].trim() + ' ____';
            
            // Extract hint if present (text in parentheses)
            const hintMatch = currentQuestion.text.match(/\((.+?)\)/);
            if (hintMatch) {
                fillblankHint.textContent = `💡 ${hintMatch[1]}`;
                fillblankHint.style.display = 'block';
            } else {
                fillblankHint.textContent = '';
                fillblankHint.style.display = 'none';
            }
        } else {
            // No blank marker found, show full text
            fillblankPrompt.textContent = currentQuestion.text;
            fillblankHint.style.display = 'none';
        }
        
        surveyScreen.classList.add('active');
        initializeFillBlank();
    } else if (currentQuestion.type === 'ranking') {
        // Show ranking, hide others
        sliderContainer.style.display = 'none';
        fillblankContainer.style.display = 'none';
        rankingContainer.style.display = 'block';
        surveyQuestion.style.display = 'block';
        surveyQuestion.textContent = currentQuestion.text;
        surveyScreen.classList.add('active');
        initializeRanking(currentQuestion);
    } else {
        // Default: show slider
        sliderContainer.style.display = 'block';
        fillblankContainer.style.display = 'none';
        rankingContainer.style.display = 'none';
        surveyQuestion.style.display = 'block';
    }
}

function hideSurveyScreen() {
    const surveyScreen = document.getElementById('surveyScreen');
    surveyScreen.classList.remove('active');
}

// Slider value descriptions
const sliderDescriptions = {
    1: { text: 'Strongly Disagree', color: '#EF4444' }, // Red
    2: { text: 'Disagree', color: '#F97316' }, // Orange
    3: { text: 'Neutral', color: '#FBBF24' }, // Yellow
    4: { text: 'Agree', color: '#10B981' }, // Green
    5: { text: 'Strongly Agree', color: '#059669' } // Dark Green
};

// Slider update function (shared)
function updateSlider(value, slider, valueNumber, valueDescription, sliderFill) {
    const numValue = parseInt(value);
    valueNumber.textContent = numValue;
    const desc = sliderDescriptions[numValue];
    valueDescription.textContent = desc.text;
    
    // Update slider fill width based on value (0% at 1, 100% at 5)
    const percentage = ((numValue - 1) / 4) * 100;
    sliderFill.style.width = `${percentage}%`;
    sliderFill.style.background = `linear-gradient(90deg, #EF4444 0%, #F97316 25%, #FBBF24 50%, #10B981 75%, #059669 100%)`;
    
    // Update value display color
    valueDescription.style.color = desc.color;
    
    // Update slider thumb color dynamically
    slider.style.setProperty('--thumb-color', desc.color);
}

// Global slider reference
let currentSlider = null;
let sliderInitialized = false;

function initializeSlider() {
    const slider = document.getElementById('surveySlider');
    const valueNumber = document.getElementById('valueNumber');
    const valueDescription = document.getElementById('valueDescription');
    const sliderFill = document.getElementById('sliderFill');
    
    // Store slider reference
    currentSlider = slider;
    
    // Reset slider to default
    slider.value = 3;
    updateSlider(3, slider, valueNumber, valueDescription, sliderFill);
    
    // Update on slider change - only add listener once
    if (!sliderInitialized) {
        slider.addEventListener('input', function() {
            updateSlider(this.value, this, valueNumber, valueDescription, sliderFill);
        });
        
        // Next button handler - set up once
        if (!sliderInitialized) {
            const nextButton = document.getElementById('surveyNext');
            nextButton.addEventListener('click', handleNextQuestion);
        }
        
        sliderInitialized = true;
    } else {
        // Just update the slider value if already initialized
        slider.value = 3;
        updateSlider(3, slider, valueNumber, valueDescription, sliderFill);
    }
}

// Handle next question button
function handleNextQuestion() {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    let answer;
    let questionText;
    
    if (currentQuestion.type === 'slider') {
        answer = currentSlider.value;
        questionText = currentQuestion.text;
        saveAnswer(questionText, parseInt(answer));
    } else if (currentQuestion.type === 'fillblank') {
        const fillblankInput = document.getElementById('fillblankInput');
        answer = fillblankInput.value.trim();
        questionText = currentQuestion.text;
        
        if (!answer) {
            // Show error if empty
            fillblankInput.style.borderColor = '#EF4444';
            fillblankInput.focus();
            return;
        }
        
        saveAnswer(questionText, answer);
    } else if (currentQuestion.type === 'ranking') {
        // Get the ranked order
        const rankingItems = document.querySelectorAll('.ranking-item');
        answer = Array.from(rankingItems).map(item => item.getAttribute('data-option'));
        questionText = currentQuestion.text;
        saveAnswer(questionText, answer);
    }
    
    console.log(`Survey answer saved: ${answer} for question: ${questionText}`);
    
    // Move to next question
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentQuestions.length) {
        // Show next question
        showSurveyScreen();
    } else {
        // All questions in current category are done
        console.log(`All questions in ${currentCategory} completed!`);
        
        // Move to next category
        const categoryKeys = Object.keys(surveyQuestions);
        const currentIndex = categoryKeys.indexOf(currentCategory);
        const nextIndex = currentIndex + 1;
        
        if (nextIndex < categoryKeys.length) {
            // Hide survey and show next category
            hideSurveyScreen();
            const nextCategory = categoryKeys[nextIndex];
            
            // Check if next category has questions
            if (surveyQuestions[nextCategory].length > 0) {
                showCategoryScreen(nextCategory);
            } else {
                // Category exists but has no questions yet - show category screen anyway
                showCategoryScreen(nextCategory);
            }
        } else {
            // All categories completed
            hideSurveyScreen();
            alert('Thank you for completing all categories! 🎉');
        }
    }
}

// Initialize fill-in-the-blank question
function initializeFillBlank() {
    const fillblankInput = document.getElementById('fillblankInput');
    const fillblankUnderline = document.querySelector('.fillblank-underline');
    
    // Clear previous input
    fillblankInput.value = '';
    fillblankInput.style.borderColor = '';
    
    // Focus input with animation
    setTimeout(() => {
        fillblankInput.focus();
    }, 300);
    
    // Animate underline on focus
    fillblankInput.addEventListener('focus', function() {
        fillblankUnderline.style.width = '100%';
    });
    
    fillblankInput.addEventListener('blur', function() {
        if (!this.value) {
            fillblankUnderline.style.width = '0%';
        }
    });
    
    // Enter key to submit
    fillblankInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleNextQuestion();
        }
    });
    
    // Animate on input
    fillblankInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            this.style.borderColor = 'var(--primary-purple)';
        } else {
            this.style.borderColor = '';
        }
    });
}

// Initialize drag and drop ranking
function initializeRanking(question) {
    const rankingList = document.getElementById('rankingList');
    const rankingInstructions = document.getElementById('rankingInstructions');
    
    // Clear previous items
    rankingList.innerHTML = '';
    
    // Show instructions
    rankingInstructions.textContent = question.text;
    
    // Shuffle options for initial display
    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
    
    // Create draggable items
    shuffledOptions.forEach((option, index) => {
        const item = document.createElement('div');
        item.className = 'ranking-item';
        item.setAttribute('data-option', option);
        item.setAttribute('draggable', 'true');
        item.textContent = option;
        item.style.animationDelay = `${index * 0.1}s`;
        rankingList.appendChild(item);
    });
    
    // Add drag and drop event listeners
    const items = rankingList.querySelectorAll('.ranking-item');
    let draggedElement = null;
    
    items.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            items.forEach(i => i.classList.remove('drag-over'));
        });
        
        item.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('drag-over');
        });
        
        item.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        item.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (draggedElement !== this) {
                const allItems = Array.from(rankingList.querySelectorAll('.ranking-item'));
                const draggedIndex = allItems.indexOf(draggedElement);
                const targetIndex = allItems.indexOf(this);
                
                if (draggedIndex < targetIndex) {
                    rankingList.insertBefore(draggedElement, this.nextSibling);
                } else {
                    rankingList.insertBefore(draggedElement, this);
                }
                
                // Update visual order
                updateRankingNumbers();
            }
        });
    });
    
    // Update ranking numbers
    function updateRankingNumbers() {
        const items = rankingList.querySelectorAll('.ranking-item');
        items.forEach((item, index) => {
            item.setAttribute('data-rank', index + 1);
        });
    }
    
    updateRankingNumbers();
}

// Save answer to user's data
function saveAnswer(question, answer) {
    // Get current user data
    let userData = window.currentUser || JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (!userData.answers) {
        userData.answers = {};
    }
    
    // Store answer with question as key (can be number or string)
    userData.answers[question] = answer;
    
    // Update localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Update global variable
    window.currentUser = userData;
    
    console.log('Answer saved:', { question, answer, userData });
}

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

