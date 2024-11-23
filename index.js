document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('start');
    const restartButton = document.getElementById('restart');
    const timerDisplay = document.getElementById('timer');
    const levelSelector = document.getElementById('level-selector');

    let player = { x: 0, y: 0, size: 20 };
    let maze = [];
    let timer = 0;
    let timerInterval;
    let gameStarted = false;

    const initializeGame = () => {
        clearInterval(timerInterval);
        timer = 0;
        timerDisplay.textContent = 'Time: 0s';
        gameStarted = false;
        generateMaze(parseInt(levelSelector.value));
        player.x = player.y = 0;
        drawMaze();
    };

    const generateMaze = (level) => {
        // Simple maze generation logic for demonstration
        const size = level * 10;
        maze = Array.from({ length: size }, () => Array(size).fill(0));
        // Randomly create walls and paths
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                maze[i][j] = Math.random() > 0.7 ? 1 : 0;
            }
        }
        maze[0][0] = 0; // Start point
        maze[size - 1][size - 1] = 0; // End point
    };

    const drawMaze = () => {
        const size = maze.length;
        const cellSize = canvas.width / size;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (maze[i][j] === 1) {
                    ctx.fillStyle = '#6200ea';
                    ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                }
            }
        }
        // Draw player
        ctx.fillStyle = 'red';
        ctx.fillRect(player.x * cellSize, player.y * cellSize, player.size, player.size);
    };

    const startTimer = () => {
        timerInterval = setInterval(() => {
            timer++;
            timerDisplay.textContent = `Time: ${timer}s`;
        }, 1000);
    };

    const movePlayer = (dx, dy) => {
        if (!gameStarted) {
            startTimer();
            gameStarted = true;
        }
        const newX = player.x + dx;
        const newY = player.y + dy;
        if (newX >= 0 && newY >= 0 && newX < maze.length && newY < maze.length && maze[newY][newX] === 0) {
            player.x = newX;
            player.y = newY;
            drawMaze();
            checkWin();
        }
    };

    const checkWin = () => {
        if (player.x === maze.length - 1 && player.y === maze.length - 1) {
            clearInterval(timerInterval);
            alert(`Congratulations! You completed the maze in ${timer} seconds.`);
            initializeGame();
        }
    };

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
                movePlayer(0, -1);
                break;
            case 'ArrowDown':
            case 's':
                movePlayer(0, 1);
                break;
            case 'ArrowLeft':
            case 'a':
                movePlayer(-1, 0);
                break;
            case 'ArrowRight':
            case 'd':
                movePlayer(1, 0);
                break;
        }
    });

    startButton.addEventListener('click', initializeGame);
    restartButton.addEventListener('click', initializeGame);

    initializeGame();
});
