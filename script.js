// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const tileSize = 40;  // size of each tile
let player = { x: 0, y: 0, color: 'blue' };  // Player initial position and color
let goal = { x: 9, y: 9, color: 'green' };  // Goal initial position and color
let obstacles = [];  // Array to hold obstacle positions
let moveCount = 0;  // Track number of moves
let gameInterval;  // To store game time interval

// Grid dimensions
const gridWidth = 10;
const gridHeight = 10;

// Game state
let gameStarted = false;
let enableObstacles = false;

// Event listeners
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('obstaclesToggle').addEventListener('change', toggleObstacles);

// Function to initialize game
function initGame() {
    // Set canvas size based on grid size and tile size
    canvas.width = gridWidth * tileSize;
    canvas.height = gridHeight * tileSize;

    // Reset variables
    player = { x: 0, y: 0, color: 'blue' };
    goal = { x: gridWidth - 1, y: gridHeight - 1, color: 'green' };
    obstacles = [];
    moveCount = 0;

    // Generate obstacles if enabled
    if (enableObstacles) {
        generateObstacles();
    }

    // Clear previous game state
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Start the game
function startGame() {
    if (gameStarted) return;  // Don't start multiple games

    gameStarted = true;
    document.getElementById('startBtn').disabled = true;  // Disable the start button
    document.getElementById('obstaclesToggle').disabled = true;  // Disable obstacle toggle

    initGame();
    drawBoard();
    updateTime();
}

// Toggle obstacles based on checkbox
function toggleObstacles() {
    enableObstacles = document.getElementById('obstaclesToggle').checked;
    if (gameStarted) {
        initGame();  // Reinitialize game when obstacles toggle changes
        drawBoard();
    }
}

// Generate obstacles at random positions
function generateObstacles() {
    const numObstacles = 10;  // You can adjust the number of obstacles
    while (obstacles.length < numObstacles) {
        let x = Math.floor(Math.random() * gridWidth);
        let y = Math.floor(Math.random() * gridHeight);
        if ((x !== player.x || y !== player.y) && (x !== goal.x || y !== goal.y)) {
            obstacles.push({ x, y });
        }
    }
}

// Draw the game board
function drawBoard() {
    // Clear the board
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);

    // Draw the goal
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x * tileSize, goal.y * tileSize, tileSize, tileSize);

    // Draw obstacles if enabled
    if (enableObstacles) {
        ctx.fillStyle = 'black';
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x * tileSize, obstacle.y * tileSize, tileSize, tileSize);
        });
    }
}

// Update the timer
function updateTime() {
    let time = 0;
    gameInterval = setInterval(() => {
        if (gameStarted) {
            time++;
            document.getElementById('timeDisplay').textContent = time;
        }
    }, 1000);
}

// Move player based on key presses
document.addEventListener('keydown', movePlayer);

function movePlayer(e) {
    if (!gameStarted) return;

    let newX = player.x;
    let newY = player.y;

    if (e.key === 'ArrowUp' && player.y > 0) newY--;
    if (e.key === 'ArrowDown' && player.y < gridHeight - 1) newY++;
    if (e.key === 'ArrowLeft' && player.x > 0) newX--;
    if (e.key === 'ArrowRight' && player.x < gridWidth - 1) newX++;

    // Check if new position is blocked by obstacle
    if (obstacles.some(obstacle => obstacle.x === newX && obstacle.y === newY)) return;

    player.x = newX;
    player.y = newY;
    moveCount++;

    document.getElementById('moveCount').textContent = moveCount;

    // Check if player reached the goal
    if (player.x === goal.x && player.y === goal.y) {
        clearInterval(gameInterval);  // Stop the timer
        alert('You reached the goal!');
        gameStarted = false;
        document.getElementById('startBtn').disabled = false;  // Enable the start button again
        document.getElementById('obstaclesToggle').disabled = false;  // Enable obstacle toggle
    }

    drawBoard();
}
