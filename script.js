function pxToVw(px, baseWidth = 1920) {
    return (px / baseWidth) * 100;
}

const container = document.querySelector(".container");
const info = document.querySelector(".info");
const maxBlockInRow = 40;
const maxRows = 10;
const squaresWidth = pxToVw(30);
const squaresGap = pxToVw(0);
const containerPadding = pxToVw(0);

const containerWidth = containerPadding + maxBlockInRow * squaresGap + maxBlockInRow * squaresWidth;
const infoWidth = containerWidth;

container.style.width = `${containerWidth}vw`;
info.style.width = `${infoWidth}vw`;
container.style.padding = `${containerPadding}vw`;
container.style.gap = `${squaresGap}vw`;

let hue = 0;
const hueIncrement = 0.1;
let animationId = null;
let activeSquare = null;
let score = 0;
let highScore = 0;
let targetSquare = null;

function generateColor(hue) {
    return `hsl(${hue}, 90%, 70%)`;
}

function animateColor() {
    if (activeSquare) {
        hue = (hue + hueIncrement) % 360;
        const color = generateColor(hue);
        activeSquare.style.backgroundColor = color;
    }
    animationId = requestAnimationFrame(animateColor);
}

function updateScore() {
    document.querySelector(".score span").textContent = score;
    
    if (score > highScore) {
        highScore = score;
        document.querySelector(".high-score span").textContent = highScore;
    }
}

function resetGame() {
    score = 0;
    updateScore();
    if (targetSquare) {
        targetSquare.style.backgroundColor = "white";
    }
    createNewTarget();
}

function createNewTarget() {
    const squares = document.querySelectorAll(".squares");
    if (targetSquare) {
        targetSquare.style.backgroundColor = "white";
    }
    targetSquare = squares[Math.floor(Math.random() * squares.length)];
    targetSquare.style.backgroundColor = "black";
    targetSquare.style.transition = "background-color .1s";
}

for (let i = 0; i < maxBlockInRow * maxRows; i++) {
    let squares = document.createElement("div");
    squares.classList.add("squares");
    squares.style.width = `${squaresWidth}vw`;
    container.appendChild(squares);

    squares.addEventListener("mouseover", () => {
        activeSquare = squares;
        if (!animationId) {
            animationId = requestAnimationFrame(animateColor);
        }
        
        if (squares === targetSquare) {
            score++;
            updateScore();
            createNewTarget();
        }
    });

    squares.addEventListener("mouseleave", () => {
        activeSquare = null;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        setTimeout(() => {
            if (squares !== targetSquare) {
                squares.style.backgroundColor = "white";
                squares.style.transition = "background-color 0.4s";
            }
        }, 1500);
    });
}

container.addEventListener("mouseleave", resetGame);

// Start the game
createNewTarget();
updateScore();

// Load high score from localStorage if available
if (localStorage.getItem("highScore")) {
    highScore = parseInt(localStorage.getItem("highScore"));
    document.querySelector(".high-score span").textContent = highScore;
}

// Save high score to localStorage when the page is about to unload
window.addEventListener("beforeunload", () => {
    localStorage.setItem("highScore", highScore);
});