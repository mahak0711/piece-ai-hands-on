const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
const timeDisplay = document.getElementById('timeDisplay');
const moveCountDisplay = document.getElementById('moveCount');

let player, maze, timer, moveCount, gameStarted, gameTime, mazeSize = 10;
let movingObstacles = [], powerUps = [];
let mazeSolved = false;
let level = 1;

startBtn.addEventListener('click', startGame);

function startGame() {
    moveCount = 0;
    mazeSolved = false;
    gameStarted = true;
    gameTime = 0;
    level = 1;
    timeDisplay.textContent = gameTime;
    moveCountDisplay.textContent = moveCount;
    
    startBtn.disabled = true;
    
    canvas.width = 500;
    canvas.height = 500;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player = {
        x: 50,
        y: 50,
        size: 20,
        color: 'blue',
        speed: 20,
        shield: false
    };

    generateMaze(level);
    drawMaze();
    drawPlayer();

    timer = setInterval(updateGame, 1000);
    
    window.addEventListener('keydown', movePlayer);
}

function generateMaze(level) {
    mazeSize = 10 + level;  // Increase maze size with level
    maze = Array(mazeSize).fill(null).map(() => Array(mazeSize).fill(0));
    
    // Add moving obstacles
    movingObstacles = [];
    for (let i = 0; i < level; i++) {
        movingObstacles.push({
            x: Math.floor(Math.random() * mazeSize),
            y: Math.floor(Math.random() * mazeSize),
            direction: Math.random() > 0.5 ? 1 : -1,
            size: 20,
            color: 'red'
        });
    }
    
    // Add power-ups
    powerUps = [];
    for (let i = 0; i < level; i++) {
        powerUps.push({
            x: Math.floor(Math.random() * mazeSize),
            y: Math.floor(Math.random() * mazeSize),
            size: 15,
            type: Math.random() > 0.5 ? 'speed' : 'shield',
            color: 'green'
        });
    }

    // Generate walls
    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            maze[i][j] = Math.random() > 0.7 ? 1 : 0;
        }
    }

    maze[0][0] = 0;
    maze[mazeSize-1][mazeSize-1] = 0;
}

function drawMaze() {
    const cellSize = canvas.width / mazeSize;
    
    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            ctx.fillStyle = maze[i][j] === 1 ? 'black' : 'white';
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }

    // Draw moving obstacles
    movingObstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x * cellSize, obstacle.y * cellSize, obstacle.size, obstacle.size);
    });

    // Draw power-ups
    powerUps.forEach(powerUp => {
        ctx.fillStyle = powerUp.color;
        ctx.beginPath();
        ctx.arc(powerUp.x * cellSize + cellSize / 2, powerUp.y * cellSize + cellSize / 2, powerUp.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x + player.size / 2, player.y + player.size / 2, player.size / 2, 0, Math.PI * 2);
    ctx.fill();
}

function movePlayer(event) {
    if (mazeSolved) return;

    const cellSize = canvas.width / mazeSize;
    const currentX = Math.floor(player.x / cellSize);
    const currentY = Math.floor(player.y / cellSize);

    switch(event.key) {
        case 'ArrowUp':
            if (currentY > 0 && maze[currentY - 1][currentX] === 0) player.y -= player.speed;
            break;
        case 'ArrowDown':
            if (currentY < mazeSize - 1 && maze[currentY + 1][currentX] === 0) player.y += player.speed;
            break;
        case 'ArrowLeft':
            if (currentX > 0 && maze[currentY][currentX - 1] === 0) player.x -= player.speed;
            break;
        case 'ArrowRight':
            if (currentX < mazeSize - 1 && maze[currentY][currentX + 1] === 0) player.x += player.speed;
            break;
    }

    // Check for power-up collection
    checkPowerUps(currentX, currentY);

    moveCount++;
    moveCountDisplay.textContent = moveCount;
    drawGame();
}

function checkPowerUps(currentX, currentY) {
    const cellSize = canvas.width / mazeSize;
    powerUps.forEach((powerUp, index) => {
        if (currentX === powerUp.x && currentY === powerUp.y) {
            // Apply power-up
            if (powerUp.type === 'speed') {
                player.speed += 10;
                playSound('speed');
            } else if (powerUp.type === 'shield') {
                player.shield = true;
                playSound('shield');
            }
            powerUps.splice(index, 1);
        }
    });
}

function updateGame() {
    if (gameStarted) {
        gameTime++;
        timeDisplay.textContent = gameTime;

        // Move obstacles
        movingObstacles.forEach(obstacle => {
            obstacle.x += obstacle.direction;
            if (obstacle.x >= mazeSize || obstacle.x < 0) {
                obstacle.direction *= -1; // Change direction when hitting wall
            }
        });

        // Check win condition
        checkWinCondition();
    }
}

function checkWinCondition() {
    const cellSize = canvas.width / mazeSize;
    const currentX = Math.floor(player.x / cellSize);
    const currentY = Math.floor(player.y / cellSize);

    if (currentX ===
