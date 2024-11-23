const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
const timeDisplay = document.getElementById('timeDisplay');
const moveCountDisplay = document.getElementById('moveCount');

let player, maze, timer, moveCount, gameStarted, gameTime, mazeSize = 10;
let mazeSolved = false;

startBtn.addEventListener('click', startGame);

function startGame() {
    moveCount = 0;
    mazeSolved = false;
    gameStarted = true;
    gameTime = 0;
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
        speed: 20
    };
    
    maze = generateMaze(mazeSize);

    drawMaze();
    drawPlayer();

    timer = setInterval(updateGame, 1000);
    
    window.addEventListener('keydown', movePlayer);
}

function generateMaze(size) {
    const mazeArray = Array(size).fill(null).map(() => Array(size).fill(0));
    
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            mazeArray[i][j] = Math.random() > 0.7 ? 1 : 0;
        }
    }

    mazeArray[0][0] = 0;
    mazeArray[size-1][size-1] = 0;

    return mazeArray;
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

    moveCount++;
    moveCountDisplay.textContent = moveCount;
    drawGame();
}

function updateGame() {
    if (gameStarted) {
        gameTime++;
        timeDisplay.textContent = gameTime;

        checkWinCondition();
    }
}

function checkWinCondition() {
    const cellSize = canvas.width / mazeSize;
    const currentX = Math.floor(player.x / cellSize);
    const currentY = Math.floor(player.y / cellSize);

    if (currentX === mazeSize - 1 && currentY === mazeSize - 1) {
        mazeSolved = true;
        clearInterval(timer);
        alert(`You Win! Time: ${gameTime}s, Moves: ${moveCount}`);
        startBtn.disabled = false;
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPlayer();
}
