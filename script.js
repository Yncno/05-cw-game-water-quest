// Game configuration and state variables
const GOAL_CANS = 20;        // Total items needed to collect to win
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;           // Holds the interval for spawning items
let timerInterval;           // Holds the interval for the timer
let timeLeft = 30;           // 30-second timer

const winMessages = [
  "Amazing! You saved the day!",
  "Water hero! You did it!",
  "Victory! The village thanks you!",
  "You crushed it! Hydration for all!"
];
const loseMessages = [
  "Try again! The village needs more water!",
  "Almost there! Give it another shot!",
  "Keep going! You can do it!",
  "Don't give up! Hydration is close!"
];

function updateScore() {
  document.getElementById('current-cans').textContent = currentCans;
}

function updateTimer() {
  document.getElementById('timer').textContent = timeLeft;
}

function launchConfetti() {
  const colors = ['#FFC907', '#2E9DF7', '#8BD1CB', '#4FCB53', '#FF902A', '#F5402C', '#159A48', '#F16061'];
  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-40px';
    confetti.style.transform = `rotateZ(${Math.random()*360}deg)`;
    confetti.style.animationDelay = (Math.random() * 0.7) + 's';
    confetti.style.animationDuration = (1.2 + Math.random()*0.7) + 's';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
  }
}

function showEndMessage() {
  const overlay = document.getElementById('end-overlay');
  const msgSpan = document.getElementById('end-message');
  let msgArr, msg;
  if (currentCans >= GOAL_CANS) {
    msgArr = winMessages;
    setTimeout(launchConfetti, 200); // Launch confetti if win
  } else {
    msgArr = loseMessages;
  }
  msg = msgArr[Math.floor(Math.random() * msgArr.length)];
  msgSpan.textContent = msg;
  overlay.style.display = 'flex';
}

function hideEndOverlay() {
  document.getElementById('end-overlay').style.display = 'none';
  // Remove any remaining confetti
  document.querySelectorAll('.confetti-piece').forEach(e => e.remove());
}

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));
  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
  // Add click handler for the can
  const can = randomCell.querySelector('.water-can');
  if (can) {
    can.addEventListener('click', function(e) {
      if (!gameActive) return;
      currentCans++;
      updateScore();
      // Remove the can so it can't be clicked again
      can.parentElement.innerHTML = '';
    });
  }
}

// Shows an animated countdown before the game starts
function showCountdown(callback) {
  const overlay = document.getElementById('countdown-overlay');
  const numberSpan = document.getElementById('countdown-number');
  const sequence = ['1', '2', '3', 'Go!'];
  let idx = 0;
  overlay.style.display = 'flex';
  function next() {
    numberSpan.textContent = sequence[idx];
    numberSpan.className = 'show';
    setTimeout(() => {
      numberSpan.className = 'hide';
      setTimeout(() => {
        idx++;
        if (idx < sequence.length) {
          next();
        } else {
          overlay.style.display = 'none';
          numberSpan.className = '';
          callback();
        }
      }, 350);
    }, 700);
  }
  next();
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active
  function realStart() {
    gameActive = true;
    currentCans = 0;
    timeLeft = 30;
    updateScore();
    updateTimer();
    document.getElementById('achievements').textContent = '';
    hideEndOverlay();
    createGrid(); // Set up the game grid
    spawnInterval = setInterval(spawnWaterCan, 1000); // Spawn water cans every second
    timerInterval = setInterval(function() {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }
  showCountdown(realStart);
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timerInterval); // Stop timer
  showEndMessage();
}

// Set up click handler for the start button
// Allow restarting the game
document.getElementById('start-game').addEventListener('click', function() {
  if (!gameActive) {
    startGame();
  }
});

// Add restart button handler
setTimeout(() => {
  const overlay = document.getElementById('end-overlay');
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target.id === 'restart-game') {
        hideEndOverlay();
        startGame();
      }
    });
  }
}, 100);
