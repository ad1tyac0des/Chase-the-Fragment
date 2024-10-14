const container = document.querySelector(".container");
const maxBlockInRow = 40;
const maxRows = 10;
const squaresWidth = 30;
const squaresGap = 1;
const containerPadding = 1;

const containerWidth = containerPadding + maxBlockInRow * squaresGap + maxBlockInRow * squaresWidth;

container.style.width = `${containerWidth}px`;
container.style.padding = `${containerPadding}px`;
container.style.gap = `${squaresGap}px`;

let hue = 0;
const hueIncrement = 0.1;
let animationId = null;
let activeSquare = null;
let score = 0;
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
    document.getElementById("score").textContent = score;
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
}

for (let i = 0; i < maxBlockInRow * maxRows; i++) {
    let squares = document.createElement("div");
    squares.classList.add("squares");
    squares.style.width = `${squaresWidth}px`;
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
            }
        }, 1000);
    });
}

container.addEventListener("mouseleave", resetGame);

// Start the game
createNewTarget();
updateScore();