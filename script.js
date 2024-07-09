// Get the necessary elements from the DOM
const initialScreen = document.getElementById('initialScreen');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const gameQuitButton = document.getElementById('gameQuitButton');
const tryAgainButton = document.getElementById('tryAgainButton');
const gameOverQuitButton = document.getElementById('gameOverQuitButton');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('finalScore');

// Game variables
const grid = 20;
let snake = [{ x: 160, y: 160 }]; // Initial position of the snake
let direction = ''; // Current direction of the snake
let food = { x: 320, y: 320 }; // Initial position of the food
let score = 0; // Current score
let gameInterval = null; // Interval ID for game loop, initially null
let gameStarted = false; // Flag to track if the game is currently running or not

// Function to start the game
function startGame() {
    initialScreen.style.display = 'none'; // Hide initial screen
    gameOverScreen.style.display = 'none'; // Hide game over screen
    gameScreen.style.display = 'block'; // Show game screen
    resetGame(); // Reset the game state
}

// Function to show the game over screen
function showGameOverScreen() {
    clearInterval(gameInterval); // Clear the game interval to stop the game loop
    gameScreen.style.display = 'none'; // Hide game screen
    initialScreen.style.display = 'none'; // Hide initial screen
    gameOverScreen.style.display = 'block'; // Show game over screen
    finalScoreElement.innerText = score; // Display final score
}

// Function to go back to the initial screen
function goBack() {
    clearInterval(gameInterval); // Clear the game interval to stop the game loop
    gameScreen.style.display = 'none'; // Hide the game screen
    gameOverScreen.style.display = 'none'; // Hide the game over screen
    initialScreen.style.display = 'block'; // Show the initial screen
    gameStarted = false; // Reset gameStarted flag
}

// Function to draw the game on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw snake segments
    for (let segment of snake) {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x, segment.y, grid, grid);
    }

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, grid, grid);

    let head = { ...snake[0] };
    let newHead = { ...head }; // Create a new head object for movement calculation
    switch (direction) {
        case 'up': newHead.y -= grid; break;
        case 'down': newHead.y += grid; break;
        case 'left': newHead.x -= grid; break;
        case 'right': newHead.x += grid; break;
    }

    // Check if the new head position is out of bounds
    if (newHead.x < 0 || newHead.x >= canvas.width || newHead.y < 0 || newHead.y >= canvas.height) {
        showGameOverScreen();
        return; // Exit draw function early to stop the game
    }

    snake.unshift(newHead); // Add new head to the snake array

    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        scoreElement.innerText = `Score: ${score}`;
        // Generate new food position
        food = {
            x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
            y: Math.floor(Math.random() * (canvas.height / grid)) * grid
        };
    } else {
        snake.pop(); // Remove the last element of the snake (its tail)
    }

    // Check collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
            showGameOverScreen();
            return; // Exit draw function early to stop the game
        }
    }

    // Redraw after adjustments
    for (let segment of snake) {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x, segment.y, grid, grid);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, grid, grid);
}

// Function to reset the game
function resetGame() {
    clearInterval(gameInterval); // Clear any existing game interval
    snake = [{ x: 160, y: 160 }]; // Reset snake position
    direction = ''; // Reset direction
    score = 0; // Reset score
    scoreElement.innerText = `Score: ${score}`; // Update score display
    gameStarted = true; // Set gameStarted flag to true
    gameInterval = setInterval(draw, 100); // Start new game interval
}

// Function to handle direction change of the snake
function changeDirection(event) {
    const keyPressed = event.keyCode;

    if (!gameStarted && (keyPressed === 37 || keyPressed === 38 || keyPressed === 39 || keyPressed === 40)) {
        // Start the game when arrow keys are pressed for the first time
        gameStarted = true;
        resetGame(); // Reset game state when direction keys are pressed
    }

    if (gameStarted) {
        // Update direction based on arrow key pressed, avoiding opposite direction change
        if (keyPressed === 37 && direction !== 'right') direction = 'left';
        if (keyPressed === 38 && direction !== 'down') direction = 'up';
        if (keyPressed === 39 && direction !== 'left') direction = 'right';
        if (keyPressed === 40 && direction !== 'up') direction = 'down';
    }
}

// Event listeners
startButton.addEventListener('click', startGame); // Start button click event
gameQuitButton.addEventListener('click', goBack); // Quit button on game screen
tryAgainButton.addEventListener('click', startGame); // Try again button on game over screen
gameOverQuitButton.addEventListener('click', goBack); // Quit button on game over screen
document.addEventListener('keydown', changeDirection); // Arrow key press event
