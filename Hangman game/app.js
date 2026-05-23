// ==========================================================================
// HANGMAN GAME ENGINE
// ==========================================================================

// Predefined list of 5 words (consistent with the original scope)
const WORDS = ["python", "hangman", "developer", "computer", "science"];
const MAX_LIVES = 6;

// Game State variables
let secretWord = "";
let guessedLetters = new Set();
let incorrectGuesses = 0;
let winStreak = 0;
let totalWins = 0;
let totalGames = 0;

// SVG Body Parts mapping (sequential reveal)
const BODY_PARTS_IDS = [
    "part-head",
    "part-torso",
    "part-arm-left",
    "part-arm-right",
    "part-leg-left",
    "part-leg-right"
];

// DOM Elements
const wordDisplay = document.getElementById("word-display");
const keyboardContainer = document.getElementById("keyboard-container");
const messageBanner = document.getElementById("message-banner");
const heartsContainer = document.getElementById("hearts-container");
const gameModal = document.getElementById("game-modal");

// Scoreboard Elements
const statStreak = document.getElementById("stat-streak");
const statWins = document.getElementById("stat-wins");
const statRatio = document.getElementById("stat-ratio");

// Modal Elements
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const secretWordReveal = document.getElementById("secret-word-reveal");
const modalAttempts = document.getElementById("modal-attempts");
const modalStreak = document.getElementById("modal-streak");
const btnPlayAgain = document.getElementById("btn-play-again");
const btnResetStats = document.getElementById("btn-reset-stats");

// ==========================================================================
// CORE GAME INITIALIZATION & STATS PERSISTENCE
// ==========================================================================

// Load persistent stats from localStorage
function loadStats() {
    winStreak = parseInt(localStorage.getItem("hangman_streak")) || 0;
    totalWins = parseInt(localStorage.getItem("hangman_wins")) || 0;
    totalGames = parseInt(localStorage.getItem("hangman_total_games")) || 0;
    updateScoreboardUI();
}

// Save current stats to localStorage
function saveStats() {
    localStorage.setItem("hangman_streak", winStreak.toString());
    localStorage.setItem("hangman_wins", totalWins.toString());
    localStorage.setItem("hangman_total_games", totalGames.toString());
    updateScoreboardUI();
}

// Clear localStorage and reset game states
function resetStats() {
    localStorage.removeItem("hangman_streak");
    localStorage.removeItem("hangman_wins");
    localStorage.removeItem("hangman_total_games");
    winStreak = 0;
    totalWins = 0;
    totalGames = 0;
    updateScoreboardUI();
    closeModal();
    initGame();
    showMessage("Scoreboard statistics reset!", false);
}

// Update the header stats widgets
function updateScoreboardUI() {
    statStreak.textContent = winStreak;
    statWins.textContent = totalWins;
    
    const ratio = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;
    statRatio.textContent = `${ratio}%`;
}

// Start a fresh game session
function initGame() {
    // Choose a random word
    secretWord = WORDS[Math.floor(Math.random() * WORDS.length)].toLowerCase();
    guessedLetters.clear();
    incorrectGuesses = 0;

    // Reset UI banners & messages
    showMessage("Guess a letter to start playing!", false);
    
    // Clear and redraw dynamic parts
    renderWordDisplay();
    renderHeartsUI();
    renderKeyboard();
    resetHangmanSVG();
    
    // Close modal if open
    closeModal();
}

// ==========================================================================
// RENDER & DRAW FUNCTIONS
// ==========================================================================

// Render the letters display panel
function renderWordDisplay() {
    wordDisplay.innerHTML = "";
    
    for (const char of secretWord) {
        const box = document.createElement("div");
        box.classList.add("letter-box");
        
        if (guessedLetters.has(char)) {
            box.textContent = char.toUpperCase();
            box.classList.add("revealed");
        } else {
            box.textContent = "";
        }
        
        wordDisplay.appendChild(box);
    }
}

// Render the on-screen virtual keyboard buttons
function renderKeyboard() {
    keyboardContainer.innerHTML = "";
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    
    for (const char of alphabet) {
        const keyButton = document.createElement("button");
        keyButton.classList.add("key");
        keyButton.textContent = char.toUpperCase();
        keyButton.id = `key-${char}`;
        
        keyButton.addEventListener("click", () => handleGuess(char));
        keyboardContainer.appendChild(keyButton);
    }
}

// Draw red hearts representing remaining incorrect guesses
function renderHeartsUI() {
    heartsContainer.innerHTML = "";
    const remainingLives = MAX_LIVES - incorrectGuesses;
    
    for (let i = 0; i < MAX_LIVES; i++) {
        const heart = document.createElement("span");
        heart.classList.add("heart-icon");
        heart.textContent = "❤️";
        
        if (i >= remainingLives) {
            heart.classList.add("lost");
        }
        
        heartsContainer.appendChild(heart);
    }
}

// Reset and hide SVG hangman elements
function resetHangmanSVG() {
    // Hide standard parts
    BODY_PARTS_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove("visible");
    });
    
    // Hide defeated dead eyes
    const deadEyes = document.getElementById("part-dead-eyes");
    if (deadEyes) deadEyes.classList.remove("visible");
}

// Sequentially animate & display incorrect body parts
function updateHangmanSVG() {
    // Loop through how many body parts should be visible
    for (let i = 0; i < incorrectGuesses; i++) {
        if (i < BODY_PARTS_IDS.length) {
            const partEl = document.getElementById(BODY_PARTS_IDS[i]);
            if (partEl) partEl.classList.add("visible");
        }
    }
    
    // If dead (6 incorrect guesses), show the dead-eyes cross lines
    if (incorrectGuesses >= MAX_LIVES) {
        const deadEyes = document.getElementById("part-dead-eyes");
        if (deadEyes) deadEyes.classList.add("visible");
    }
}

// Display messages in the info/warning banner
function showMessage(msg, isError) {
    messageBanner.textContent = msg;
    if (isError) {
        messageBanner.style.color = "var(--accent-red)";
        messageBanner.classList.add("shake");
        // Remove shake class after animation completes so it can be re-triggered
        setTimeout(() => {
            messageBanner.classList.remove("shake");
        }, 400);
    } else {
        messageBanner.style.color = "var(--text-secondary)";
    }
}

// ==========================================================================
// CORE GAME PLAY LOGIC
// ==========================================================================

// Process user guess (triggered by virtual click or physical key)
function handleGuess(letter) {
    // Sanitize input
    letter = letter.toLowerCase();
    
    // Safety check if game is finished or key is already guessed
    if (guessedLetters.has(letter) || incorrectGuesses >= MAX_LIVES || isGameWon()) {
        return;
    }
    
    // Add letter to the guessed set
    guessedLetters.add(letter);
    
    // Disable virtual key button and apply color styling
    const keyButton = document.getElementById(`key-${letter}`);
    if (keyButton) {
        keyButton.disabled = true;
    }
    
    // Check if letter is present in the secret word
    if (secretWord.includes(letter)) {
        if (keyButton) keyButton.classList.add("correct");
        showMessage(`Great guess! '${letter.toUpperCase()}' is in the word.`, false);
        renderWordDisplay();
        
        // Check for immediate Victory
        if (isGameWon()) {
            handleGameOver(true);
        }
    } else {
        if (keyButton) keyButton.classList.add("incorrect");
        incorrectGuesses++;
        showMessage(`Incorrect! '${letter.toUpperCase()}' is not in the word.`, true);
        renderHeartsUI();
        updateHangmanSVG();
        
        // Check for immediate Defeat
        if (incorrectGuesses >= MAX_LIVES) {
            handleGameOver(false);
        }
    }
}

// Helper checking if all word characters have been guessed
function isGameWon() {
    return [...secretWord].every(char => guessedLetters.has(char));
}

// Handle the end game states (Win / Loss)
function handleGameOver(isWin) {
    totalGames++;
    
    if (isWin) {
        totalWins++;
        winStreak++;
        showModal(true);
    } else {
        winStreak = 0;
        showModal(false);
    }
    
    saveStats();
}

// Handle physical keyboard keydown events
function handlePhysicalKeyboard(e) {
    // Do not capture keys if modal/game over overlay is showing
    if (!gameModal.classList.contains("hidden")) {
        // Space or Enter lets you play again when game over
        if (e.key === "Enter" || e.key === " ") {
            initGame();
        }
        return;
    }
    
    const key = e.key.toLowerCase();
    
    // Match only clean standard single alpha letters
    if (key.length === 1 && key >= "a" && key <= "z") {
        if (guessedLetters.has(key)) {
            showMessage(`You already guessed '${key.toUpperCase()}'!`, true);
        } else {
            handleGuess(key);
        }
    }
}

// ==========================================================================
// MODAL / VIEW CONTROL FUNCTIONS
// ==========================================================================

// Display the end game modal summary
function showModal(isWin) {
    gameModal.classList.remove("hidden");
    
    // Modal Title & Icons
    if (isWin) {
        modalIcon.textContent = "🎉";
        modalTitle.textContent = "YOU WON!";
        modalTitle.style.background = "linear-gradient(135deg, var(--text-primary) 30%, var(--accent-green) 100%)";
        modalTitle.style.webkitBackgroundClip = "text";
    } else {
        modalIcon.textContent = "💀";
        modalTitle.textContent = "GAME OVER";
        modalTitle.style.background = "linear-gradient(135deg, var(--text-primary) 30%, var(--accent-red) 100%)";
        modalTitle.style.webkitBackgroundClip = "text";
    }
    
    // Reveal secret word
    secretWordReveal.textContent = secretWord.toUpperCase();
    
    // Populate scoreboard metrics
    modalAttempts.textContent = `${guessedLetters.size} total`;
    modalStreak.textContent = winStreak;
}

// Dismiss the game modal
function closeModal() {
    gameModal.classList.add("hidden");
}

// ==========================================================================
// EVENT LISTENERS & SETUP
// ==========================================================================

// Game button action listeners
btnPlayAgain.addEventListener("click", initGame);
btnResetStats.addEventListener("click", resetStats);

// Physical keyboard listeners
document.addEventListener("keydown", handlePhysicalKeyboard);

// Start the application lifecycle
document.addEventListener("DOMContentLoaded", () => {
    loadStats();
    initGame();
});
