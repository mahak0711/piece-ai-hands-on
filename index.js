const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startGameButton = document.getElementById('start-game');
const restartButton = document.getElementById('restart-btn');
const stepsDisplay = document.getElementById('steps');
const gameOverMessage = document.getElementById('game-over');
const instructionsOverlay = document.getElementById('instructions-overlay');

let player = { x: 50, y: 50, size: 20, color: 'red' };
let maze = [];
let steps = 0;
let mazeSize = 10;
let gameOver = false;
let gameStarted = false;

function drawPlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before redrawing
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fill();
}

function drawMaze() {
    // Draw the maze using black for walls and white for paths
    const cellSize = canvas.width / mazeSize;
    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            ctx.fillStyle = maze[i][j] === 1 ? 'black' : 'white';
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }
}

function generateMaze() {
    maze = [];
    for (let i = 0; i < mazeSize; i++) {
        maze[i] = [];
        for (let j = 0; j < mazeSize; j++) {
            maze[i][j] = Math.random() > 0.7 ? 1 : 0; // Random walls and paths
        }
    }
    maze[0][0] = 0; // Starting point
    maze[mazeSize - 1][mazeSize - 1] = 0; // Exit point
}

function movePlayer(event) {
    if (gameOver) return;

    const cellSize = canvas.width / mazeSize;
    const currentX = Math.floor(player.x / cellSize);
    const currentY = Math.floor(player.y / cellSize);

    switch(event.key) {
        case 'ArrowUp':
            if (currentY > 0 && maze[currentY - 1][currentX] === 0) player.y -= 20;
            break;
        case 'ArrowDown':
            if (currentY < mazeSize - 1 && maze[currentY + 1][currentX] === 0) player.y += 20;
            break;
        case 'ArrowLeft':
            if (currentX > 0 && maze[currentY][currentX - 1] === 0) player.x -= 20;
            break;
        case 'ArrowRight':
            if (currentX < mazeSize - 1 && maze[currentY][currentX + 1] === 0) player.x += 20;
            break;
    }

    steps++;
    stepsDisplay.textContent = steps;
    drawMaze();
    drawPlayer();
    checkWinCondition();
}

function checkWinCondition() {
    const cellSize = canvas.width / mazeSize;
    const currentX = Math.floor(player.x / cellSize);
    const currentY = Math.floor(player.y / cellSize);

    if (currentX === mazeSize - 1 && currentY === mazeSize - 1) {
        gameOver = true;
        gameOverMessage.style.display = 'block';
        restartButton.style.display = 'block';
    }
}

function startGame() {
    gameStarted = true;
    gameOver = false;
    steps = 0;
    stepsDisplay.textContent = steps;
    generateMaze();
    canvas.width = 500;
    canvas.height = 500;
    drawMaze();
    drawPlayer();
    gameOverMessage.style.display = 'none';
    restartButton.style.display = 'none';

    document.addEventListener('keydown', movePlayer);
}

function restartGame() {
    player = { x: 50, y: 50, size: 20, color: 'red' };
    gameStarted = false;
    gameOver = false;
    instructionsOverlay.style.display = 'flex';
}

startGameButton.addEventListener('click', function() {
    instructionsOverlay.style.display = 'none';
    startGame();
});

restartButton.addEventListener('click', restartGame);
