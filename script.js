// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const tileSize = 40;  // size of each tile
const gridWidth = 10; // Grid width (number of tiles)
const gridHeight = 10; // Grid height (number of tiles)
let player = { x: 0, y: 0, color: 'blue' };  // Player initial position and color
let goal = { x: 9, y: 9, color: 'green' };  // Goal initial position and color
let obstacles = [];  // Array to hold obstacle positions
let moveCount = 0;  // Track number of moves
let gameInterval;  // To store game time interval

// Grid Setup: Adjust the canvas size according to the grid
canvas.width = gridWidth * tileSize;
canvas.height = gridHeight * tileSize;

// Generate random obstacles on the grid
function generateObstacles() {
    obstacles = [];
    let numberOfObstacles = 15;  // Adjust the number of obstacles here

    // Ensure the player and goal aren't on the same tile as an obstacle
    while (obstacles.length < numberOfObstacles) {
        let x = Math.floor(Math.random() * gridWidth);
        let y = Math.floor(Math.random() * gridHeight);

        // Avoid placing obstacles where the player or goal is
        if ((x !== player.x || y !== player.y) && (x !== goal.x || y !== goal.y)) {
            obstacles.push({ x, y });
        }
    }
}

// Draw the grid (background, player, goal, obstacles)
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the grid lines
    ctx.strokeStyle = "#ccc";
    for (let x = 0; x < gridWidth; x++) {
        for (let y = 0; y < gridHeight; y++) {
            ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }

    // Draw obstacles
    ctx.fillStyle = 'black';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x * tileSize, obstacle.y * tileSize, tileSize, tileSize);
    });

    // Draw the goal
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x * tileSize, goal.y * tileSize, tileSize, tileSize);

    // Draw the player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

// Move player
function movePlayer(direction) {
    let newX = player.x;
    let newY = player.y;

    // Update player position based on direction
    if (direction === 'up') {
        newY--;
    } else if (direction === 'down') {
        newY++;
    } else if (direction === 'left') {
        newX--;
    } else if (direction === 'right') {
        newX++;
    }

    // Check if the new position is within bounds and not on an obstacle
    if (newX >= 0 && newX < gridWidth && newY >= 0 && newY < gridHeight) {
        // Check if it's an obstacle
        if (!obstacles.some(obstacle => obstacle.x === newX && obstacle.y === newY)) {
            player.x = newX;
            player.y = newY;
            moveCount++;
        }
    }
    draw();
    checkGameStatus();
}

// Check if the player reached the goal
function checkGameStatus() {
    if (player.x === goal.x && player.y === goal.y) {
        alert(`You win! Total Moves: ${moveCount}`);
        clearInterval(gameInterval); // Stop the timer
    }
}

// Start a new game
function startGame() {
    player = { x: 0, y: 0, color: 'blue' };  // Reset player position
    goal = { x: 9, y: 9, color: 'green' };  // Reset goal position
    obstacles = [];
    moveCount = 0;  // Reset move count
    generateObstacles();  // Generate obstacles
    draw();  // Draw initial state of the game

    // Start the timer
    let time = 0;
    gameInterval = setInterval(() => {
        time++;
        document.getElementById('timeDisplay').textContent = time;
    }, 1000);
}

// Add event listeners for keyboard controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        movePlayer('up');
    } else if (event.key === 'ArrowDown') {
        movePlayer('down');
    } else if (event.key === 'ArrowLeft') {
        movePlayer('left');
    } else if (event.key === 'ArrowRight') {
        movePlayer('right');
    }
});

// Initialize the game
document.getElementById('startBtn').addEventListener('click', startGame);

// Initial game setup
generateObstacles();
draw();
