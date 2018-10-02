/*****************************************************************
variables
 *****************************************************************/

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let y = canvas.height - 30;
let x = canvas.width / 2;
let dx = 2;
let dy = -2;

//keypress state
let leftPressed = false;
let rightPressed = false;

//score count
let score = 0;
//level count
let level = 1;
//lives count
let lives = 3;

//sounds
let ballCollide = new Audio('../sounds/click.mp3');
let brickCollide = new Audio('../sounds/collide.mp3');
let victory = new Audio('../sounds/WON.mp3');
let loose = new Audio('../sounds/loose.mp3');

//ball and paddle dimensions
let ballRad = 10;
let paddleH = 10;
let paddleW = 70;
let paddleX = (canvas.width-paddleW) / 2;

//brick size and layout parameters
let brickRow =3;
let brickColumn = 5;
let brickW = 75;
let brickH = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

//generate bricks
let bricks = [];
for(let c=0; c<brickColumn; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRow; r++) {
        bricks[c][r] = {x: 0, y: 0, state: true};
    }
}



//collision detection for bricks
function brickCollisionAction() {
    for(let c=0; c<brickColumn; c++) {
        for(let r=0; r<brickRow; r++) {
            let b = bricks[c][r];
            if (b.state == true) {
                if (x > b.x && x < b.x + brickW && y > b.y && y < b.y + brickH) {
                    brickCollide.play();
                    dy = -dy;
                    b.state = false;
                    score++;
                    if(score >= brickColumn * brickRow) {
                        victory.play();
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        drawVictory();
                        clearInterval(motionStart);
                    }
                }
            }
        }
    }
}



//color change
let colors = ['purple', 'green', 'red', 'orange', 'blue'];
let colorsInUse = colors[0];
function changeColor() {
    colorsInUse = colors[Math.floor(Math.random() * colors.length)];
    console.log(colorsInUse)
}

/*****************************************************************
draw sprites
 *****************************************************************/


//draw the ball
function ball() {
    context.beginPath();
    context.arc(x, y, ballRad, 0, Math.PI * 2, false);
    context.fillStyle = colorsInUse;
    context.fill();
    context.closePath();
}

//draw the paddle
function paddle() {
    context.beginPath();
    context.rect(paddleX, canvas.height - paddleH, paddleW, paddleH);
    context.fillStyle = 'green';
    context.fill();
    context.closePath();
}


//draw bricks
function drawBricks() {
    for(let c=0; c<brickColumn; c++) {
        for(let r=0; r<brickRow; r++) {
            if(bricks[c][r].state == true) {
                bricks[c][r].x = (c*(brickW + brickPadding)) + brickOffsetLeft;
                bricks[c][r].y = (r*(brickH + brickPadding)) + brickOffsetTop;
                context.beginPath();
                context.rect(bricks[c][r].x, bricks[c][r].y, brickW, brickH);
                context.fillStyle = 'red';
                context.fill();
                context.closePath();
            }
        }
    }
}

//draw the score
function drawScore() {
    let txt = 'Score: ' + score;
    let left =  (canvas.width / 4) - context.measureText(txt).width;
    context.font = '16px Arial';
    context.fillStyle = 'red';
    context.fillText(txt, left, 20);
}

//draw number of lives
function drawLives() {
    let right = canvas.width - (canvas.width / 4);
    context.font = '16px Arial';
    context.fillStyle = 'green';
    context.fillText('Lives: ' + lives, right, 20);
}

//draw victory
function drawVictory() {
    context.font = '32px Arial';
    context.fillStyle = 'red';
    let txt = 'Winner! You finished level ' + level;
    let center = (canvas.width - context.measureText(txt).width) / 2;
    console.log('center' + center);
    console.log('measure: ' +  context.measureText(txt).width);
    context.fillText(txt, center, canvas.height / 2 )
}

//control collision with external walls and other elements
function collisionControl() {
    //control collision with external walls
    x + dx < ballRad || x + dx > canvas.width - ballRad ?
        (
            dx = -dx,
            changeColor(),
            ballCollide.play()
        ) : null;
    y + dy < ballRad ?
        (
            dy = -dy,
            changeColor(),
            ballCollide.play()
        ) : null;

    //collision control with the paddle
    y + dy > canvas.height - ballRad ?
        x > paddleX && x < paddleX + paddleW ?
            (
                dy = -dy,
                //dx++,
                //dy--,
                ballCollide.play()
            ) : (
            console.log('game over'),
                loose.play(),
                location = location
            ) : null;
}


function movePaddle() {
    leftPressed && paddleX > 0 ? paddleX -= 7 : null;
    rightPressed && paddleX < (canvas.width - paddleW) ? paddleX += 7 : null;
}

//event handler functions
//on keydown
function keyDownHandler(e){
    e.keyCode == 37 ? leftPressed = true : null;
    e.keyCode == 39 ? rightPressed = true : null;
}

//on keyup
function keyUpHandler(e) {
    e.keyCode == 37 ? leftPressed = false : null;
    e.keyCode == 39 ? rightPressed = false : null;
}

//mouse movement handler

function mouseHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > (paddleW / 2) && relativeX < canvas.width - (paddleW / 2)) {

        paddleX = (relativeX - paddleW / 2);
        console.log(paddleX);
    }
}

//touch handle
function touch2Mouse(e)
{
    var theTouch = e.changedTouches[0];
    var mouseEv;

    switch(e.type)
    {
        case "touchstart": mouseEv="mousedown"; break;
        case "touchend":   mouseEv="mouseup"; break;
        case "touchmove":  mouseEv="mousemove"; break;
        default: return;
    }

    var mouseEvent = document.createEvent("MouseEvent");
    mouseEvent.initMouseEvent(mouseEv, true, true, window, 1, theTouch.screenX, theTouch.screenY, theTouch.clientX, theTouch.clientY, false, false, false, false, 0, null);
    theTouch.target.dispatchEvent(mouseEvent);

    e.preventDefault();
}


//animate canvas elements
function motion() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    ball();
    paddle();
    brickCollisionAction();
    collisionControl();

    movePaddle();
    drawScore();
    drawLives();

    x += dx;
    y += dy;
};

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseHandler, false);
document.addEventListener("touchstart", touch2Mouse, true);
document.addEventListener("touchmove", touch2Mouse, true);
document.addEventListener("touchend", touch2Mouse, true);

let motionStart = setInterval(motion, 200);