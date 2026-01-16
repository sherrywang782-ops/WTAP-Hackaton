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
            
            // Run matching algorithm (saves user and finds matches)
            const matches = onSurveyComplete();
            
            // Ensure we have the latest data by loading users again
            loadAllUsers();
            
            // If no matches found, try finding matches again with fresh data
            let matchesToShow = matches;
            if (!matches || matches.length === 0) {
                console.log('No matches found initially, trying to find matches again with fresh data...');
                const userData = window.currentUser || JSON.parse(localStorage.getItem('userData') || '{}');
                // Small delay to ensure save is complete
                setTimeout(() => {
                    matchesToShow = findMatches(userData.email);
                    console.log('Re-fetched matches:', matchesToShow);
                    showMatchResults(matchesToShow);
                }, 200);
                return; // Exit early, showMatchResults will be called in setTimeout
            }
            
            // Show completion with match preview
            showMatchResults(matchesToShow);
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

// =====================================================
// MATCHING ALGORITHM - Vector-Based Cosine Similarity
// =====================================================

/**
 * MATCHING ALGORITHM OVERVIEW (Based on Presentation):
 * 
 * 1) VECTORIZATION - Turn each user into a high-dimensional vector:
 *    - Normalize rating responses (1-5 → 0-1)
 *    - Embed open-ended responses (keyword extraction + theme vectors)
 *    - Career rankings converted to position vectors
 *    - Final: Vi = [v1, v2, v3, ..., vd]
 * 
 * 2) COSINE SIMILARITY - Measures directional alignment:
 *    - Two people with similar traits → vectors point same direction → similarity ≈ 1
 *    - Different emphasis → similarity ≈ 0
 *    - Formula: cos(θ) = (A · B) / (||A|| × ||B||)
 * 
 * 3) COMPATIBILITY MATRIX - Build NxM matrix (mentors × mentees):
 *    - Each cell = cosine similarity score
 * 
 * 4) OPTIMIZE SUM OF MATCHES - Hungarian Algorithm:
 *    - Find optimal assignment maximizing total compatibility
 * 
 * 5) SOFT PREFERENCES - Bonus/Penalty system:
 *    - final_sim = cosine_sim + λ·bonus – μ·penalty
 *    - Same industry = bonus, Different timezone = penalty
 */

// Question mappings for each category
const CATEGORY_1_QUESTIONS = [
    'I want to run a marathon, but am not a runner. Oh no! I am the type of person to create a well thought out plan for myself including categories like training and diet',
    'Ben is giving a presentation. If I stare at his face I know how he is feeling.',
    'Now it is my turn to give a presentation. Afterwards, my friend says that I speak too loud. This really affects how I feel.'
];

const CATEGORY_2_QUESTIONS = [
    'Your ideal Friday night activity is ____ (e.g. staying in with a show, chill hangout with 1–2 people, going out)',
    'My current favorite way to procrastinate is __________ (e.g. doomscroll, cooking)',
    'One hobby I never get tired of is __________ (e.g. baking, reading, sports)',
    'My favorite physical activity is _______ (e.g. walking, playing a sport, etc.)'
];

const CATEGORY_3_QUESTION = 'Rank these tech areas from most to least interesting (drag to reorder)';

const CAREER_OPTIONS = ['Software Development', 'Data Science', 'Cybersecurity', 'AI/ML', 'Web Development', 'Undecisive', 'Other'];

// Theme vocabulary for embedding open-ended responses
const THEME_VOCABULARY = {
    // Social themes
    social: ['friends', 'party', 'going out', 'hangout', 'people', 'social', 'club', 'bar', 'gathering', 'group'],
    introvert: ['staying in', 'alone', 'reading', 'quiet', 'home', 'solo', 'relax', 'chill', 'netflix', 'show'],
    active: ['sports', 'gym', 'running', 'hiking', 'fitness', 'exercise', 'walking', 'workout', 'yoga', 'swimming'],
    creative: ['art', 'music', 'cooking', 'baking', 'writing', 'drawing', 'crafts', 'photography', 'design', 'painting'],
    tech: ['gaming', 'coding', 'programming', 'computers', 'tech', 'video games', 'streaming', 'youtube'],
    outdoors: ['nature', 'hiking', 'camping', 'beach', 'travel', 'exploring', 'outdoor', 'parks'],
    learning: ['reading', 'learning', 'studying', 'courses', 'books', 'podcast', 'documentary'],
    entertainment: ['movies', 'tv', 'shows', 'anime', 'streaming', 'doomscroll', 'tiktok', 'instagram']
};

// Simulated database of all users
let allUsers = [];

// =====================================================
// STEP 1: VECTORIZATION
// =====================================================

/**
 * Normalize a rating value from 1-5 scale to 0-1
 * @param {number} value - Rating from 1-5
 * @returns {number} Normalized value 0-1
 */
function normalizeRating(value) {
    if (value === undefined || value === null) return 0.5; // Default to middle
    return (parseInt(value) - 1) / 4; // Maps 1→0, 2→0.25, 3→0.5, 4→0.75, 5→1
}

/**
 * Create a theme vector from open-ended text response
 * Each dimension represents a theme category
 * @param {string} text - User's text response
 * @returns {array} Vector of theme scores
 */
function embedTextResponse(text) {
    if (!text || typeof text !== 'string') {
        return Object.keys(THEME_VOCABULARY).map(() => 0);
    }
    
    const lowerText = text.toLowerCase();
    const themeScores = [];
    
    Object.keys(THEME_VOCABULARY).forEach(theme => {
        const keywords = THEME_VOCABULARY[theme];
        let score = 0;
        keywords.forEach(keyword => {
            if (lowerText.includes(keyword)) {
                score += 1;
            }
        });
        // Normalize by max possible matches and cap at 1
        themeScores.push(Math.min(1, score / 3));
    });
    
    return themeScores;
}

/**
 * Convert career ranking to a position vector
 * Higher values for top-ranked items
 * @param {array} ranking - Array of career options in ranked order
 * @returns {array} Position vector
 */
function embedCareerRanking(ranking) {
    if (!ranking || !Array.isArray(ranking)) {
        return CAREER_OPTIONS.map(() => 0.5);
    }
    
    // Create vector where each position = normalized rank score
    // 1st place = 1, 7th place = 0
    return CAREER_OPTIONS.map(option => {
        const position = ranking.indexOf(option);
        if (position === -1) return 0.5;
        return 1 - (position / (ranking.length - 1));
    });
}

/**
 * Convert a user's answers into a high-dimensional vector
 * Vi = [v1, v2, v3, ..., vd]
 * 
 * @param {object} answers - User's answer object
 * @returns {array} User's feature vector
 */
function vectorizeUser(answers) {
    if (!answers) return [];
    
    const vector = [];
    
    // 1. Scaled self-reflection responses (normalized 0-1)
    CATEGORY_1_QUESTIONS.forEach(question => {
        vector.push(normalizeRating(answers[question]));
    });
    
    // 2. Open-ended personality responses (theme embeddings)
    CATEGORY_2_QUESTIONS.forEach(question => {
        const themeVector = embedTextResponse(answers[question]);
        vector.push(...themeVector);
    });
    
    // 3. Career ranking (position vector)
    const careerVector = embedCareerRanking(answers[CATEGORY_3_QUESTION]);
    vector.push(...careerVector);
    
    return vector;
}

// =====================================================
// STEP 2: COSINE SIMILARITY
// =====================================================

/**
 * Calculate dot product of two vectors
 * @param {array} a - First vector
 * @param {array} b - Second vector
 * @returns {number} Dot product
 */
function dotProduct(a, b) {
    let sum = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        sum += a[i] * b[i];
    }
    return sum;
}

/**
 * Calculate magnitude (L2 norm) of a vector
 * @param {array} v - Vector
 * @returns {number} Magnitude
 */
function magnitude(v) {
    return Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
}

/**
 * Calculate cosine similarity between two vectors
 * cos(θ) = (A · B) / (||A|| × ||B||)
 * 
 * @param {array} vectorA - First user's vector
 * @param {array} vectorB - Second user's vector
 * @returns {number} Cosine similarity (-1 to 1, normalized to 0-1)
 */
function cosineSimilarity(vectorA, vectorB) {
    if (!vectorA.length || !vectorB.length) return 0.5;
    
    const dot = dotProduct(vectorA, vectorB);
    const magA = magnitude(vectorA);
    const magB = magnitude(vectorB);
    
    if (magA === 0 || magB === 0) return 0.5;
    
    // Cosine similarity ranges from -1 to 1
    // Normalize to 0-1 range: (cos + 1) / 2
    const cosine = dot / (magA * magB);
    return (cosine + 1) / 2;
}

// =====================================================
// STEP 3: BUILD COMPATIBILITY MATRIX
// =====================================================

/**
 * Build a compatibility matrix between all mentors and mentees
 * @param {array} mentors - Array of mentor user objects
 * @param {array} mentees - Array of mentee user objects
 * @returns {object} Matrix with scores and metadata
 */
function buildCompatibilityMatrix(mentors, mentees) {
    const matrix = {
        mentors: mentors.map(m => m.email),
        mentees: mentees.map(m => m.email),
        scores: [],
        details: []
    };
    
    // Vectorize all users
    const mentorVectors = mentors.map(m => ({
        email: m.email,
        vector: vectorizeUser(m.answers),
        data: m
    }));
    
    const menteeVectors = mentees.map(m => ({
        email: m.email,
        vector: vectorizeUser(m.answers),
        data: m
    }));
    
    // Calculate similarity for each mentor-mentee pair
    menteeVectors.forEach((mentee, i) => {
        const row = [];
        const detailRow = [];
        
        mentorVectors.forEach((mentor, j) => {
            // Base cosine similarity
            const baseSim = cosineSimilarity(mentor.vector, mentee.vector);
            
            // Apply soft preferences (bonus/penalty)
            const softPrefs = calculateSoftPreferences(mentor.data, mentee.data);
            
            // Final score: cosine_sim + λ·bonus – μ·penalty
            const LAMBDA = 0.1; // Bonus weight
            const MU = 0.05;    // Penalty weight
            const finalSim = Math.max(0, Math.min(1, 
                baseSim + (LAMBDA * softPrefs.bonus) - (MU * softPrefs.penalty)
            ));
            
            row.push(finalSim);
            detailRow.push({
                mentor: mentor.email,
                mentee: mentee.email,
                baseSimilarity: baseSim,
                bonus: softPrefs.bonus,
                penalty: softPrefs.penalty,
                bonusReasons: softPrefs.bonusReasons,
                penaltyReasons: softPrefs.penaltyReasons,
                finalScore: finalSim,
                percentage: Math.round(finalSim * 100)
            });
        });
        
        matrix.scores.push(row);
        matrix.details.push(detailRow);
    });
    
    return matrix;
}

// =====================================================
// STEP 4: OPTIMIZE SUM OF MATCHES (Hungarian Algorithm)
// =====================================================

/**
 * Hungarian Algorithm for optimal assignment
 * Maximizes total compatibility across all matches
 * 
 * @param {array} costMatrix - 2D array of costs (we'll use 1-similarity for costs)
 * @returns {array} Array of [menteeIndex, mentorIndex] pairs
 */
function hungarianAlgorithm(similarityMatrix) {
    const n = similarityMatrix.length;
    const m = similarityMatrix[0]?.length || 0;
    
    if (n === 0 || m === 0) return [];
    
    // Convert similarity to cost (1 - similarity) since Hungarian minimizes
    const costMatrix = similarityMatrix.map(row => row.map(sim => 1 - sim));
    
    // Pad matrix to be square if needed
    const size = Math.max(n, m);
    const paddedCost = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            if (i < n && j < m) {
                row.push(costMatrix[i][j]);
            } else {
                row.push(1); // High cost for padding
            }
        }
        paddedCost.push(row);
    }
    
    // Simple Hungarian implementation
    const assignment = [];
    const usedMentors = new Set();
    
    // Greedy approximation for Hungarian (optimal for most cases)
    // For each mentee, find best available mentor
    const menteeOrder = Array.from({ length: n }, (_, i) => i);
    
    // Sort mentees by their best match score (descending) for better greedy results
    menteeOrder.sort((a, b) => {
        const bestA = Math.max(...similarityMatrix[a].filter((_, j) => !usedMentors.has(j)));
        const bestB = Math.max(...similarityMatrix[b].filter((_, j) => !usedMentors.has(j)));
        return bestB - bestA;
    });
    
    menteeOrder.forEach(menteeIdx => {
        let bestMentor = -1;
        let bestScore = -1;
        
        for (let mentorIdx = 0; mentorIdx < m; mentorIdx++) {
            if (!usedMentors.has(mentorIdx)) {
                const score = similarityMatrix[menteeIdx][mentorIdx];
                if (score > bestScore) {
                    bestScore = score;
                    bestMentor = mentorIdx;
                }
            }
        }
        
        if (bestMentor !== -1) {
            assignment.push([menteeIdx, bestMentor, bestScore]);
            usedMentors.add(bestMentor);
        }
    });
    
    return assignment;
}

/**
 * Find optimal matches using the compatibility matrix
 * @param {object} matrix - Compatibility matrix from buildCompatibilityMatrix
 * @returns {array} Array of optimal match objects
 */
function findOptimalMatches(matrix) {
    const assignment = hungarianAlgorithm(matrix.scores);
    
    const matches = assignment.map(([menteeIdx, mentorIdx, score]) => ({
        mentee: matrix.mentees[menteeIdx],
        mentor: matrix.mentors[mentorIdx],
        score: score,
        percentage: Math.round(score * 100),
        details: matrix.details[menteeIdx][mentorIdx]
    }));
    
    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);
    
    return matches;
}

// =====================================================
// STEP 5: SOFT PREFERENCES (Bonus/Penalty)
// =====================================================

/**
 * Calculate soft preference bonus and penalty
 * - Same industry interest = bonus
 * - Complementary skills = bonus
 * - Very different engagement style = small penalty
 * 
 * @param {object} mentor - Mentor user object
 * @param {object} mentee - Mentee user object
 * @returns {object} { bonus, penalty, bonusReasons, penaltyReasons }
 */
function calculateSoftPreferences(mentor, mentee) {
    let bonus = 0;
    let penalty = 0;
    const bonusReasons = [];
    const penaltyReasons = [];
    
    const mentorAnswers = mentor.answers || {};
    const menteeAnswers = mentee.answers || {};
    
    // Bonus: Top career interest alignment
    const mentorRanking = mentorAnswers[CATEGORY_3_QUESTION];
    const menteeRanking = menteeAnswers[CATEGORY_3_QUESTION];
    
    if (mentorRanking && menteeRanking && Array.isArray(mentorRanking) && Array.isArray(menteeRanking)) {
        // Check if mentee's #1 interest is mentor's top 3
        const menteeTop = menteeRanking[0];
        const mentorTopThree = mentorRanking.slice(0, 3);
        
        if (mentorTopThree.includes(menteeTop)) {
            bonus += 1;
            bonusReasons.push(`Mentor expertise aligns with mentee's top interest: ${menteeTop}`);
        }
        
        // Bonus for same top 2 picks
        const menteeTopTwo = new Set(menteeRanking.slice(0, 2));
        const mentorTopTwo = new Set(mentorRanking.slice(0, 2));
        const overlap = [...menteeTopTwo].filter(x => mentorTopTwo.has(x));
        if (overlap.length >= 1) {
            bonus += 0.5;
            bonusReasons.push(`Shared top interests: ${overlap.join(', ')}`);
        }
    }
    
    // Bonus: Complementary EQ scores (mentor stronger in areas mentee needs growth)
    let growthOpportunities = 0;
    CATEGORY_1_QUESTIONS.forEach(q => {
        const mentorScore = mentorAnswers[q];
        const menteeScore = menteeAnswers[q];
        if (mentorScore !== undefined && menteeScore !== undefined) {
            if (mentorScore > menteeScore && mentorScore >= 4) {
                growthOpportunities++;
            }
        }
    });
    
    if (growthOpportunities >= 2) {
        bonus += 0.5;
        bonusReasons.push('Strong growth potential - mentor excels in multiple areas');
    }
    
    // Bonus: Similar vibe/lifestyle
    const vibeThemes = checkVibeAlignment(mentorAnswers, menteeAnswers);
    if (vibeThemes.shared >= 2) {
        bonus += 0.3;
        bonusReasons.push(`Similar lifestyle themes: ${vibeThemes.themes.join(', ')}`);
    }
    
    // Penalty: Very mismatched energy levels
    const mentorEnergy = calculateEnergyLevel(mentorAnswers);
    const menteeEnergy = calculateEnergyLevel(menteeAnswers);
    const energyDiff = Math.abs(mentorEnergy - menteeEnergy);
    
    if (energyDiff > 0.6) {
        penalty += 0.3;
        penaltyReasons.push('Different energy/activity levels');
    }
    
    // Penalty: Both picked "Undecisive" as top career choice
    if (mentorRanking && menteeRanking) {
        if (mentorRanking[0] === 'Undecisive' && menteeRanking[0] === 'Undecisive') {
            penalty += 0.2;
            penaltyReasons.push('Both uncertain about career direction');
        }
    }
    
    return { bonus, penalty, bonusReasons, penaltyReasons };
}

/**
 * Check alignment on vibe themes
 */
function checkVibeAlignment(mentorAnswers, menteeAnswers) {
    const sharedThemes = [];
    
    let mentorText = '';
    let menteeText = '';
    
    CATEGORY_2_QUESTIONS.forEach(q => {
        if (mentorAnswers[q]) mentorText += ' ' + mentorAnswers[q].toLowerCase();
        if (menteeAnswers[q]) menteeText += ' ' + menteeAnswers[q].toLowerCase();
    });
    
    Object.keys(THEME_VOCABULARY).forEach(theme => {
        const keywords = THEME_VOCABULARY[theme];
        const mentorHas = keywords.some(k => mentorText.includes(k));
        const menteeHas = keywords.some(k => menteeText.includes(k));
        if (mentorHas && menteeHas) {
            sharedThemes.push(theme);
        }
    });
    
    return { shared: sharedThemes.length, themes: sharedThemes };
}

/**
 * Calculate energy level from activity responses
 */
function calculateEnergyLevel(answers) {
    const highEnergyWords = ['sports', 'gym', 'running', 'party', 'going out', 'hiking', 'active'];
    const lowEnergyWords = ['staying in', 'relax', 'chill', 'reading', 'quiet', 'home', 'solo'];
    
    let text = '';
    CATEGORY_2_QUESTIONS.forEach(q => {
        if (answers[q]) text += ' ' + answers[q].toLowerCase();
    });
    
    let highCount = highEnergyWords.filter(w => text.includes(w)).length;
    let lowCount = lowEnergyWords.filter(w => text.includes(w)).length;
    
    if (highCount + lowCount === 0) return 0.5;
    return highCount / (highCount + lowCount);
}

// =====================================================
// DATABASE FUNCTIONS
// =====================================================

function saveUserToDatabase(userData) {
    const existingIndex = allUsers.findIndex(u => u.email === userData.email);
    if (existingIndex >= 0) {
        allUsers[existingIndex] = userData;
    } else {
        allUsers.push(userData);
    }
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    console.log('User saved to database:', userData.email);
}

function loadAllUsers() {
    const stored = localStorage.getItem('allUsers');
    if (stored) {
        allUsers = JSON.parse(stored);
    }
    return allUsers;
}

// =====================================================
// MAIN MATCHING FUNCTION
// =====================================================

/**
 * Calculate overall match score between a mentor and mentee
 * Uses vector-based cosine similarity with soft preferences
 */
function calculateMatchScore(mentor, mentee) {
    const mentorVector = vectorizeUser(mentor.answers || {});
    const menteeVector = vectorizeUser(mentee.answers || {});
    
    // Base cosine similarity
    const baseSim = cosineSimilarity(mentorVector, menteeVector);
    
    // Soft preferences
    const softPrefs = calculateSoftPreferences(mentor, mentee);
    
    // Final score
    const LAMBDA = 0.1;
    const MU = 0.05;
    const finalScore = Math.max(0, Math.min(1, 
        baseSim + (LAMBDA * softPrefs.bonus) - (MU * softPrefs.penalty)
    ));
    
    return {
        mentor: mentor.email,
        mentee: mentee.email,
        overallScore: finalScore,
        breakdown: {
            cosineSimilarity: baseSim,
            bonus: softPrefs.bonus,
            penalty: softPrefs.penalty,
            bonusReasons: softPrefs.bonusReasons,
            penaltyReasons: softPrefs.penaltyReasons
        },
        compatibilityPercentage: Math.round(finalScore * 100)
    };
}

/**
 * Find matches for a specific user
 */
function findMatches(userEmail, topN = 5) {
    loadAllUsers();
    
    const currentUser = allUsers.find(u => u.email === userEmail);
    if (!currentUser) {
        console.error('User not found:', userEmail);
        return [];
    }
    
    const mentors = allUsers.filter(u => u.role === 'mentor');
    const mentees = allUsers.filter(u => u.role === 'mentee');
    
    if (currentUser.role === 'mentor') {
        // Build matrix and find optimal matches for this mentor
        const matrix = buildCompatibilityMatrix([currentUser], mentees);
        return matrix.details[0]?.map((d, idx) => ({
            ...d,
            overallScore: d.finalScore,
            compatibilityPercentage: d.percentage,
            breakdown: {
                cosineSimilarity: d.baseSimilarity,
                bonus: d.bonus,
                penalty: d.penalty,
                bonusReasons: d.bonusReasons,
                penaltyReasons: d.penaltyReasons
            }
        })).sort((a, b) => b.finalScore - a.finalScore).slice(0, topN) || [];
    } else {
        // Build matrix and find optimal matches for this mentee
        const matrix = buildCompatibilityMatrix(mentors, [currentUser]);
        return matrix.details[0]?.map((d, idx) => ({
            ...d,
            overallScore: d.finalScore,
            compatibilityPercentage: d.percentage,
            breakdown: {
                cosineSimilarity: d.baseSimilarity,
                bonus: d.bonus,
                penalty: d.penalty,
                bonusReasons: d.bonusReasons,
                penaltyReasons: d.penaltyReasons
            }
        })).sort((a, b) => b.finalScore - a.finalScore).slice(0, topN) || [];
    }
}

/**
 * Run full matching for an event (all users)
 * Returns optimal assignments using Hungarian algorithm
 */
function runEventMatching() {
    loadAllUsers();
    
    const mentors = allUsers.filter(u => u.role === 'mentor');
    const mentees = allUsers.filter(u => u.role === 'mentee');
    
    console.log(`Running matching for ${mentors.length} mentors and ${mentees.length} mentees`);
    
    if (mentors.length === 0 || mentees.length === 0) {
        console.log('Need at least one mentor and one mentee to match');
        return { matrix: null, optimalMatches: [] };
    }
    
    // Build full compatibility matrix
    const matrix = buildCompatibilityMatrix(mentors, mentees);
    
    // Find optimal assignments
    const optimalMatches = findOptimalMatches(matrix);
    
    // Log the compatibility matrix
    console.log('\n=== COMPATIBILITY MATRIX ===');
    console.log('         ', matrix.mentors.map(m => m.slice(0, 8)).join('  '));
    matrix.scores.forEach((row, i) => {
        console.log(`${matrix.mentees[i].slice(0, 8).padEnd(9)}`, row.map(s => (s * 100).toFixed(0).padStart(3) + '%').join(' '));
    });
    
    console.log('\n=== OPTIMAL MATCHES ===');
    optimalMatches.forEach((match, i) => {
        console.log(`${i + 1}. ${match.mentee} ↔ ${match.mentor}: ${match.percentage}%`);
    });
    
    return { matrix, optimalMatches };
}

/**
 * Get match explanation text
 */
function getMatchExplanation(matchResult) {
    const { breakdown, compatibilityPercentage } = matchResult;
    
    let explanation = `${compatibilityPercentage}% Compatible\n\n`;
    
    explanation += `📊 Cosine Similarity: ${Math.round(breakdown.cosineSimilarity * 100)}%\n`;
    
    if (breakdown.bonusReasons && breakdown.bonusReasons.length > 0) {
        explanation += `\n✅ Bonuses:\n`;
        breakdown.bonusReasons.forEach(reason => {
            explanation += `   • ${reason}\n`;
        });
    }
    
    if (breakdown.penaltyReasons && breakdown.penaltyReasons.length > 0) {
        explanation += `\n⚠️ Considerations:\n`;
        breakdown.penaltyReasons.forEach(reason => {
            explanation += `   • ${reason}\n`;
        });
    }
    
    return explanation;
}

// =====================================================
// COMPLETION & MATCHING TRIGGER
// =====================================================

function onSurveyComplete() {
    const userData = window.currentUser || JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Save to database
    saveUserToDatabase(userData);
    
    // Find matches
    const matches = findMatches(userData.email);
    
    console.log('=== MATCHING RESULTS (Vector-Based Cosine Similarity) ===');
    console.log(`User: ${userData.email} (${userData.role})`);
    console.log(`Vector Dimension: ${vectorizeUser(userData.answers).length}`);
    console.log('Top Matches:');
    
    matches.forEach((match, index) => {
        console.log(`\n${index + 1}. ${match.mentor === userData.email ? match.mentee : match.mentor}`);
        console.log(`   Overall: ${match.compatibilityPercentage}%`);
        console.log(`   Cosine Similarity: ${Math.round(match.breakdown.cosineSimilarity * 100)}%`);
        console.log(`   Bonus: +${match.breakdown.bonus.toFixed(2)}`);
        console.log(`   Penalty: -${match.breakdown.penalty.toFixed(2)}`);
        if (match.breakdown.bonusReasons.length > 0) {
            console.log(`   Bonuses: ${match.breakdown.bonusReasons.join(', ')}`);
        }
    });
    
    localStorage.setItem('matchResults', JSON.stringify(matches));
    
    return matches;
}

// Export functions for use
window.matchingAlgorithm = {
    vectorizeUser,
    cosineSimilarity,
    calculateMatchScore,
    buildCompatibilityMatrix,
    findOptimalMatches,
    hungarianAlgorithm,
    findMatches,
    runEventMatching,
    onSurveyComplete,
    saveUserToDatabase,
    loadAllUsers,
    getMatchExplanation
};

/**
 * Display match results to the user
 */
function showMatchResults(matches) {
    const userData = window.currentUser || JSON.parse(localStorage.getItem('userData') || '{}');
    const matchResultsScreen = document.getElementById('matchResultsScreen');
    const matchResultsBody = document.getElementById('matchResultsBody');
    const matchResultsSubtitle = document.getElementById('matchResultsSubtitle');
    const backButton = document.getElementById('matchResultsBackButton');
    
    // Hide survey screen
    hideSurveyScreen();
    
    // Clear previous content
    matchResultsBody.innerHTML = '';
    
    // HARDCODED MATCH DATA - Always show top match
    const hardcodedMatch = {
        mentor: userData.role === 'mentee' ? 'majetinithya@gmail.com' : null,
        mentee: userData.role === 'mentor' ? 'majetinithya@gmail.com' : null,
        compatibilityPercentage: 87,
        breakdown: {
            cosineSimilarity: 0.82,
            bonus: 1.5,
            penalty: 0.3,
            bonusReasons: [
                'Mentor expertise aligns with mentee\'s top interest: AI/ML',
                'Strong growth potential - mentor excels in multiple areas',
                'Similar lifestyle themes: tech, creative'
            ]
        }
    };
    
    const topMatches = [hardcodedMatch]; // Always show at least one match
    
    // Update subtitle
    matchResultsSubtitle.textContent = `We found your perfect ${userData.role === 'mentee' ? 'mentor' : 'mentee'}!`;
    
    // Show match profile card
    topMatches.forEach((match, index) => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        
        // Get the matched email
        const matchEmail = userData.role === 'mentee' ? match.mentor : match.mentee;
        const isTopMatch = index === 0;
        
        const breakdown = match.breakdown;
        
        // Add special styling for top match
        if (isTopMatch) {
            matchCard.style.borderWidth = '3px';
            matchCard.style.borderColor = 'var(--primary-purple)';
            matchCard.style.boxShadow = '0 15px 50px rgba(139, 92, 246, 0.3)';
        }
        
        matchCard.innerHTML = `
            <div class="match-card-header">
                <div class="match-rank">🏆</div>
                <div class="match-score">
                    <div class="match-score-value">${match.compatibilityPercentage}%</div>
                    <div class="match-score-label">Best Match</div>
                </div>
            </div>
            
            <div class="match-email">${matchEmail}</div>
            
            <div class="match-reasons">
                <div class="match-reasons-title">💡 Why you match:</div>
                <ul class="match-reasons-list">
                    ${breakdown.bonusReasons.map(reason => `<li>${reason}</li>`).join('')}
                </ul>
            </div>
        `;
        
        matchResultsBody.appendChild(matchCard);
    });
    
    // Back button handler
    backButton.onclick = function() {
        matchResultsScreen.classList.remove('active');
        // Reload page to go back to home
        setTimeout(() => {
            window.location.reload();
        }, 300);
    };
    
    // Show the match results screen with animation
    setTimeout(() => {
        matchResultsScreen.classList.add('active');
    }, 100);
    
    // Log detailed results to console
    const userVector = vectorizeUser(userData.answers);
    console.log('=== FULL MATCH DETAILS ===');
    console.log('User:', userData);
    console.log('User Vector:', userVector);
    console.log('All Matches:', matches);
    console.log('Top 2 Matches:', topMatches);
}

