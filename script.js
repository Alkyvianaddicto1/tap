const tapArea = document.getElementById('tap-area');
const scoreDisplay = document.getElementById('score');
const progressBar = document.getElementById('progress-bar');
const levelDisplay = document.getElementById('level');
const message = document.getElementById('message');
const playButton = document.getElementById('play-button');
const loadingScreen = document.getElementById('loading-screen');
const gameWrapper = document.getElementById('game-wrapper');
const moneyDisplay = document.getElementById('money'); // Display for money
const playerNameDisplay = document.getElementById('player-name'); // Display for player name

const tapSound = document.getElementById('tap-sound');

let score = 0;
let level = 1;
let maxTaps = 100; // Starting max taps for level 1
let nextLevelThreshold = 100; // 100 taps per level
let cooldownTime = 1800; // Cooldown time in seconds (30 minutes = 1800 seconds)
let maxLevel = 100; // Maximum level
let money = 0; // Player's money earned
let playerName = ''; // Player's name
let email = ''; // Player's email address

function loadGame() {
  const savedEmail = localStorage.getItem('email');
  
  if (savedEmail) {
    // Fetch player progress from the backend API
    fetch(`http://localhost:5000/get-progress/${savedEmail}`)
      .then(response => response.json())
      .then(data => {
        if (data.playerName) {
          // Update UI with saved data
          playerName = data.playerName;
          email = data.email;
          score = data.score;
          level = data.level;
          maxTaps = data.maxTaps;
          money = data.money;

          playerNameDisplay.textContent = `Player: ${playerName}`;
          scoreDisplay.textContent = score;
          levelDisplay.textContent = `Level ${level}`;
          progressBar.style.width = `${(score / maxTaps) * 100}%`;
          moneyDisplay.textContent = `$${money.toFixed(2)}`;
        }
      })
      .catch(error => console.error('Error loading progress:', error));
  } else {
    promptForPlayerInfo(); // Prompt for email if not found in LocalStorage
  }
}

function saveGame() {
  const playerData = {
    playerName,
    email,
    score,
    level,
    maxTaps,
    money
  };

  // Save player progress to the backend API
  fetch('http://localhost:5000/save-progress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(playerData)
  })
    .then(response => response.json())
    .then(data => console.log('Progress saved:', data))
    .catch(error => console.error('Error saving progress:', error));
}

function promptForPlayerInfo() {
  const playerNameInput = prompt("Please enter your player name:");
  playerName = playerNameInput.trim() || "Player";

  const emailInput = prompt("Please enter your email address for daily updates:");
  if (validateEmail(emailInput)) {
    email = emailInput.trim();
    localStorage.setItem('email', email);
    localStorage.setItem('playerName', playerName);
    playerNameDisplay.textContent = `Player: ${playerName}`;
    
    // Simulate sending email update
    sendEmailUpdate();
    saveGame(); // Save progress after first login
  } else {
    alert("Invalid email address.");
  }
}

function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
}

// Simulate sending email update
function sendEmailUpdate() {
  alert(`Daily progress update sent to ${email}!\n\nProgress:\nLevel: ${level}\nScore: ${score}\nMoney: $${money.toFixed(2)}`);
}

// Call loadGame when the page is ready
window.onload = loadGame;

// Load Game Progress from LocalStorage
function loadGame() {
  const savedScore = localStorage.getItem('score');
  const savedLevel = localStorage.getItem('level');
  const savedProgress = localStorage.getItem('progress');
  const savedMoney = localStorage.getItem('money');
  const savedPlayerName = localStorage.getItem('playerName');
  const savedEmail = localStorage.getItem('email');

  if (savedScore && savedLevel && savedProgress && savedMoney && savedPlayerName && savedEmail) {
    score = parseInt(savedScore, 10);
    level = parseInt(savedLevel, 10);
    maxTaps = parseInt(savedProgress, 10);
    money = parseFloat(savedMoney);
    playerName = savedPlayerName;
    email = savedEmail;

    // Update the game with saved progress
    scoreDisplay.textContent = score;
    levelDisplay.textContent = `Level ${level}`;
    progressBar.style.width = `${(score / maxTaps) * 100}%`;
    moneyDisplay.textContent = `$${money.toFixed(2)}`;
    playerNameDisplay.textContent = `Player: ${playerName}`;

    if (score >= maxTaps) {
      message.textContent = "Game Over! You've reached the tap limit.";
      tapArea.style.pointerEvents = 'none';
    }

    // Simulate daily email updates
    sendEmailUpdate();
  } else {
    promptForPlayerInfo(); // Prompt for player info if no saved progress exists
  }
}

// Save Game Progress to LocalStorage
function saveGame() {
  localStorage.setItem('score', score);
  localStorage.setItem('level', level);
  localStorage.setItem('progress', maxTaps);
  localStorage.setItem('money', money.toFixed(2)); // Save money to localStorage
  localStorage.setItem('playerName', playerName); // Save player name
  localStorage.setItem('email', email); // Save email to localStorage
}

// Prompt for Player Name and Email
function promptForPlayerInfo() {
  const storedName = localStorage.getItem('playerName');
  const storedEmail = localStorage.getItem('email');

  if (!storedName || !storedEmail) {
    const playerNameInput = prompt("Please enter your player name:");
    if (playerNameInput && playerNameInput.trim() !== '') {
      playerName = playerNameInput.trim();
    } else {
      playerName = "Player"; // Default name if the user leaves it blank
    }

    const emailInput = prompt("Please enter your email address for daily updates:");
    if (emailInput && validateEmail(emailInput)) {
      email = emailInput.trim();
    } else {
      alert("Invalid email address. You must enter a valid email.");
      return;
    }

    localStorage.setItem('playerName', playerName);
    localStorage.setItem('email', email);
    playerNameDisplay.textContent = `Player: ${playerName}`;

    sendEmailUpdate(); // Send an email update immediately after the first login
  } else {
    playerName = storedName;
    email = storedEmail;
    playerNameDisplay.textContent = `Player: ${playerName}`;
  }
}

// Validate Email Format
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
}

// Simulate Sending Email Update
function sendEmailUpdate() {
  if (email) {
    // Simulate an email being sent with a delay (you would normally use an email API here)
    console.log(`Sending email to ${email}...`);
    const message = `Hello ${playerName},\n\nYour current game progress:\nLevel: ${level}\nScore: ${score}\nMoney Earned: $${money.toFixed(2)}\n\nKeep playing and earning!`;
    console.log("Email Content: ", message);

    // Simulate a daily email by showing a message
    alert(`Daily progress update sent to ${email}!\n\nProgress:\nLevel: ${level}\nScore: ${score}\nMoney: $${money.toFixed(2)}`);
  }
}

// Reset the Game
function resetGame() {
  score = 0;
  level = 1;
  maxTaps = 100; // Reset maxTaps to 100 for level 1
  nextLevelThreshold = 100;
  money = 0; // Reset money
  scoreDisplay.textContent = score;
  levelDisplay.textContent = `Level ${level}`;
  progressBar.style.width = '0%';
  moneyDisplay.textContent = `$${money.toFixed(2)}`; // Display initial money
  tapArea.style.pointerEvents = 'auto';
  message.textContent = '';
  saveGame(); // Save the reset state
}

// Update Level and Progress
function updateLevel() {
  if (score >= nextLevelThreshold && level < maxLevel) {
    level++;
    maxTaps += 100; // Each level requires 100 more taps
    nextLevelThreshold = level * 100; // Next level requires (level * 100) taps
    levelDisplay.textContent = `Level ${level}`;
    saveGame();

    // Play cooldown timer after each level-up
    message.textContent = `Level ${level} attained! Next level in ${cooldownTime / 60} minutes.`;
    setTimeout(() => {
      message.textContent = ''; // Clear message after cooldown
      tapArea.style.pointerEvents = 'auto'; // Enable tapping again
    }, cooldownTime * 1000); // Cooldown before enabling tap area
    tapArea.style.pointerEvents = 'none'; // Disable tap area during cooldown

    if (level >= maxLevel) {
      message.textContent = "Congratulations! You've reached the highest level!";
      tapArea.style.pointerEvents = 'none';
      setTimeout(() => {
        message.textContent = `Game will reset in ${cooldownTime / 60} minutes.`;
        setTimeout(resetGame, cooldownTime * 1000); // Reset game after cooldown
      }, cooldownTime * 1000);
    }
  }
}

// Calculate and update money earned
function updateMoney() {
  // For every 100 taps, the player earns 0.01 dollars
  if (score % 100 === 0 && score !== 0) { // Prevent earning money from the initial score of 0
    money += 0.01; // Earn money
    moneyDisplay.textContent = `$${money.toFixed(2)}`; // Update money display
  }
}

window.onload = () => {
  setTimeout(() => {
    loadingScreen.style.display = 'none';
    gameWrapper.style.display = 'block';
    loadGame(); // Load saved progress
  }, 3000);
};

// Play Button Event
playButton.addEventListener('click', () => {
  playButton.style.display = 'none';
  document.getElementById('game-container').style.display = 'block';

  // If the player has saved progress, skip reset
  if (localStorage.getItem('score')) {
    return; // Don't reset, continue from saved progress
  } else {
    resetGame(); // Reset the game when starting for the first time
  }
});

// Tap Area Event
tapArea.addEventListener('click', () => {
  if (tapArea.style.pointerEvents === 'none') {
    return; // Prevent taps during cooldown
  }

  score++;
  scoreDisplay.textContent = score;
  updateLevel();
  updateMoney();
  progressBar.style.width = `${(score / maxTaps) * 100}%`;

  // Play sound on tap
  tapSound.play();
  saveGame(); // Save progress after every tap
});
