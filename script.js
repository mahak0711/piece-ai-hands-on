// Game variables
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let startButton = document.getElementById('startBtn');
let timeDisplay = document.getElementById('timeDisplay');
let moveCountDisplay = document.getElementById('moveCount');
let gameInterval;
let gameTime = 0;
let moveCount = 0;
let gameStarted = false;

// Game settings
canvas.width = 400;
canvas.height = 400;
let player = { x: 0, y: 0, size: 20, color: 'blue' };
let goal = { x: 380, y: 380, size: 20, color: 'green' };

// Key listener for player movement
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

document.addEventListener('keydown', (event) => {
    if (event.key in keys) {
        keys[event.key] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
});

// Start game
startButton.addEventListener('click', () => {
    if (!gameStarted) {
        startGame();
    }
});

// Start the game
function startGame() {
    gameStarted = true;
    startButton.disabled = true;
    moveCount = 0;
    gameTime = 0;
    timeDisplay.textContent = gameTime;
    moveCountDisplay.textContent = moveCount;
    player.x = 0;
    player.y = 0;
    gameInterval = setInterval(updateGame, 1000 / 60);  // 60 FPS
    setInterval(() => { gameTime++; timeDisplay.textContent = gameTime; }, 1000);  // Update time every second
}

// Update game state
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    drawPlayer();
    drawGoal();
    checkGoalReached();
}

// Draw the player on the canvas
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Draw the goal on the canvas
function drawGoal() {
    ctx.fillStyle = goal.color;
    ctx.fillRect(goal.x, goal.y, goal.size, goal.size);
}

// Move the player based on key inputs
function movePlayer() {
    if (keys.ArrowUp && player.y > 0) player.y -= 5;
    if (keys.ArrowDown && player.y < canvas.height - player.size) player.y += 5;
    if (keys.ArrowLeft && player.x > 0) player.x -= 5;
    if (keys.ArrowRight && player.x < canvas.width - player.size) player.x += 5;
    if (keys.ArrowUp || keys.ArrowDown || keys.ArrowLeft || keys.ArrowRight) {
        moveCount++;
        moveCountDisplay.textContent = moveCount;
    }
}

// Check if the player has reached the goal
function checkGoalReached() {
    if (player.x < goal.x + goal.size && player.x + player.size > goal.x && player.y < goal.y + goal.size && player.y + player.size > goal.y) {
        clearInterval(gameInterval);
        alert('Congratulations! You reached the goal!');
        startButton.disabled = false;
        gameStarted = false;
    }
}
