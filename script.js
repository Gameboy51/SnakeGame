const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20; // Size of each block
const canvasSize = 400; // Canvas size

let score = 0;
let snake = [{ x: 9 * box, y: 10 * box }]; // Snake body
let food = generateFood();
let direction = null;
let gameInterval;

// Keydown event to change snake's direction
document.addEventListener('keydown', changeDirection);

// Start the game
function startGame() {
  gameInterval = setInterval(gameLoop, 100);
}

function gameLoop() {
  if (hasCollided()) {
    clearInterval(gameInterval);
    alert("Game Over!");
    return;
  }

  moveSnake();
  drawGame();
}

function moveSnake() {
  const head = { ...snake[0] };

  if (direction === 'LEFT') head.x -= box;
  if (direction === 'RIGHT') head.x += box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'DOWN') head.y += box;

  snake.unshift(head);

  // If the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').textContent = score;
    food = generateFood(); // Create new food
  } else {
    snake.pop(); // Remove the last part of the snake
  }
}

function drawGame() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  drawSnake();
  drawFood();
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? 'green' : 'white'; // Head of the snake is green
    ctx.fillRect(segment.x, segment.y, box, box);
  });
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);
}

function generateFood() {
  const x = Math.floor(Math.random() * (canvasSize / box)) * box;
  const y = Math.floor(Math.random() * (canvasSize / box)) * box;
  return { x, y };
}

function changeDirection(event) {
  if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT'; // Left arrow
  if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';   // Up arrow
  if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT'; // Right arrow
  if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';   // Down arrow
}

function hasCollided() {
  const head = snake[0];
  
  // Check wall collision
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    return true;
  }
  
  // Check self-collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  
  return false;
}

// Start the game
startGame();