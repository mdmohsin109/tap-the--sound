// Game state variables
let currentUnit = null;
let currentBlendIndex = 0;
let currentWordIndex = 0;
let score = 0;
let totalQuestions = 0;
let completedQuestions = 0;
let selectedWordElement = null;
let gameData = {};

// DOM Elements
const unitSelect = document.getElementById('unit-select');
const wordChoicesContainer = document.getElementById('word-choices');
const playSoundButton = document.getElementById('play-sound');
const nextQuestionButton = document.getElementById('next-question');
const feedbackElement = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const progressFill = document.getElementById('progress-fill');
const levelCompleteModal = document.getElementById('level-complete');
const finalScoreElement = document.getElementById('final-score');
const replayLevelButton = document.getElementById('replay-level');

// Speech synthesis
const synth = window.speechSynthesis;

// Initialize the game
function initGame() {
    // Check if level4Data exists (from the imported JS file)
    if (typeof level4Data !== 'undefined') {
        gameData = level4Data;
        populateUnitSelector();
        setInitialUnit();
        setupEventListeners();
    } else {
        console.error('Game data not loaded!');
        alert('Error loading game data!');
    }
}

// Populate unit selector dropdown
function populateUnitSelector() {
    for (const unit in gameData) {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        unitSelect.appendChild(option);
    }
}

// Set initial unit
function setInitialUnit() {
    if (unitSelect.options.length > 0) {
        currentUnit = unitSelect.options[0].value;
        unitSelect.value = currentUnit;
        resetUnitProgress();
        prepareQuestion();
    }
}

// Setup event listeners
function setupEventListeners() {
    unitSelect.addEventListener('change', handleUnitChange);
    playSoundButton.addEventListener('click', playCurrentWord);
    nextQuestionButton.addEventListener('click', goToNextQuestion);
    replayLevelButton.addEventListener('click', replayLevel);
}

// Handle unit change
function handleUnitChange() {
    currentUnit = unitSelect.value;
    resetUnitProgress();
    prepareQuestion();
}

// Reset unit progress
function resetUnitProgress() {
    currentBlendIndex = 0;
    currentWordIndex = 0;
    completedQuestions = 0;
    updateProgressBar();
}

// Prepare a new question
function prepareQuestion() {
    clearFeedback();
    removeWordSelection();
    
    if (!currentUnit || !gameData[currentUnit]) return;
    
    // Get current blend data
    const blendData = gameData[currentUnit][currentBlendIndex];
    if (!blendData) return;
    
    // Calculate total questions for progress bar
    totalQuestions = gameData[currentUnit].reduce((sum, blend) => sum + blend.words.length, 0);
    
    // Get current word
    const correctWord = blendData.words[currentWordIndex];
    
    // Generate word choices (1 correct + 2-4 incorrect from same unit)
    const wordChoices = generateWordChoices(correctWord);
    
    // Display word choices
    displayWordChoices(wordChoices, correctWord);
    
    // Enable/disable next button
    nextQuestionButton.disabled = selectedWordElement !== null;
}

// Generate word choices (1 correct + 2-4 incorrect)
function generateWordChoices(correctWord) {
    const choices = [correctWord];
    const allWordsInUnit = [];
    
    // Collect all words from the current unit
    gameData[currentUnit].forEach(blend => {
        blend.words.forEach(word => {
            if (word !== correctWord) {
                allWordsInUnit.push(word);
            }
        });
    });
    
    // Shuffle and select 2-4 incorrect words
    const shuffled = allWordsInUnit.sort(() => 0.5 - Math.random());
    const numIncorrect = Math.min(3, shuffled.length); // Between 2-4 choices total
    
    for (let i = 0; i < numIncorrect; i++) {
        choices.push(shuffled[i]);
    }
    
    // Shuffle choices
    return choices.sort(() => 0.5 - Math.random());
}

// Display word choices
function displayWordChoices(choices, correctWord) {
    // Clear previous choices
    wordChoicesContainer.innerHTML = '';
    
    // Create word choice elements
    choices.forEach(word => {
        const wordElement = document.createElement('div');
        wordElement.className = 'word-choice';
        wordElement.textContent = word;
        wordElement.dataset.word = word;
        wordElement.dataset.correct = (word === correctWord).toString();
        
        // Add click handler
        wordElement.addEventListener('click', handleWordSelection);
        
        wordChoicesContainer.appendChild(wordElement);
    });
}

// Handle word selection
function handleWordSelection(event) {
    // Prevent selecting if already selected
    if (selectedWordElement) return;
    
    const wordElement = event.currentTarget;
    selectedWordElement = wordElement;
    
    // Add selected visual
    wordElement.classList.add('selected');
    
    // Check if correct
    const isCorrect = wordElement.dataset.correct === 'true';
    
    // Delay to show selection first, then result
    setTimeout(() => {
        if (isCorrect) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer();
        }
        
        // Enable next button
        nextQuestionButton.disabled = false;
    }, 500);
}

// Handle correct answer
function handleCorrectAnswer() {
    // Update score
    score += 10;
    scoreElement.textContent = score;
    
    // Update selected element
    selectedWordElement.classList.add('correct');
    
    // Show feedback
    showFeedback('Correct! 🎉', 'success');
    
    // Play success sound
    playAudio('correct');
    
    // Increment completed questions
    completedQuestions++;
    updateProgressBar();
}

// Handle incorrect answer
function handleIncorrectAnswer() {
    // Update selected element
    selectedWordElement.classList.add('incorrect');
    
    // Show correct answer
    const correctElement = Array.from(wordChoicesContainer.children)
        .find(el => el.dataset.correct === 'true');
    
    if (correctElement) {
        setTimeout(() => {
            correctElement.classList.add('correct');
        }, 500);
    }
    
    // Show feedback
    showFeedback('Try again! 😊', 'error');
    
    // Play error sound
    playAudio('incorrect');
    
    // Increment completed questions
    completedQuestions++;
    updateProgressBar();
}

// Show feedback
function showFeedback(message, type) {
    feedbackElement.textContent = message;
    feedbackElement.className = `feedback ${type}`;
}

// Clear feedback
function clearFeedback() {
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';
}

// Remove word selection
function removeWordSelection() {
    selectedWordElement = null;
    
    // Remove selection from all word elements
    const wordElements = document.querySelectorAll('.word-choice');
    wordElements.forEach(el => {
        el.classList.remove('selected', 'correct', 'incorrect');
    });
}

// Go to next question
function goToNextQuestion() {
    // Move to next word
    currentWordIndex++;
    
    // If we've gone through all words in current blend
    if (currentWordIndex >= gameData[currentUnit][currentBlendIndex].words.length) {
        currentWordIndex = 0;
        currentBlendIndex++;
        
        // If we've gone through all blends in current unit
        if (currentBlendIndex >= gameData[currentUnit].length) {
            // Show level complete
            showLevelComplete();
            return;
        }
    }
    
    // Prepare next question
    prepareQuestion();
}

// Show level complete modal
function showLevelComplete() {
    finalScoreElement.textContent = score;
    levelCompleteModal.style.display = 'flex';
}

// Replay level
function replayLevel() {
    // Reset score
    score = 0;
    scoreElement.textContent = score;
    
    // Reset unit progress
    resetUnitProgress();
    
    // Hide modal
    levelCompleteModal.style.display = 'none';
    
    // Start again
    prepareQuestion();
}

// Update progress bar
function updateProgressBar() {
    const progressPercentage = (completedQuestions / totalQuestions) * 100;
    progressFill.style.width = `${progressPercentage}%`;
}

// Play current word sound
function playCurrentWord() {
    if (!currentUnit || !gameData[currentUnit][currentBlendIndex]) return;
    
    const word = gameData[currentUnit][currentBlendIndex].words[currentWordIndex];
    if (!word) return;
    
    // Add animation to button
    playSoundButton.classList.add('playing');
    
    // Use Web Speech API to speak the word
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = 0.9; // Slightly slower for kids
    utterance.pitch = 1.1; // Slightly higher pitch for kids
    
    // Remove animation when done speaking
    utterance.onend = () => {
        playSoundButton.classList.remove('playing');
    };
    
    synth.speak(utterance);
}

// Play audio effects
function playAudio(type) {
    // You could replace with actual audio files
    const sound = new Audio();
    
    if (type === 'correct') {
        // Simulate correct sound with AudioContext
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, context.currentTime);
        oscillator.frequency.setValueAtTime(880, context.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.5, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.start();
        oscillator.stop(context.currentTime + 0.5);
    } else if (type === 'incorrect') {
        // Simulate incorrect sound with AudioContext
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(330, context.currentTime);
        oscillator.frequency.setValueAtTime(220, context.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.5, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
        
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.start();
        oscillator.stop(context.currentTime + 0.3);
    }
}

// Initialize game when the DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);
