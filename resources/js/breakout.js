/*****************************************************************
declare global variables
 *****************************************************************/

// dom elements
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
//ball position on canvas
let y = canvas.height - 30;
let x = canvas.width / 2;
//ball pixel movement /  animation frame
let dx = 2;
let dy = -2;

//key press state
let leftPressed = false;
let rightPressed = false;

//game start state
let gameStart = false;
//animation frame control
let startStopAnimation = false;

//score count
let score = 0;
//level count
let level = 1;
//lives count
let lives = 2;

//sounds
let ballCollide = new Audio('../sounds/click.mp3');
let brickCollide = new Audio('../sounds/collide.mp3');
let victory = new Audio('../sounds/victory.mp3');
let won = new Audio('../sounds/WON.mp3');
let loose = new Audio('../sounds/loose.mp3');
let died = new Audio('../sounds/died.mp3');

//ball and paddle dimensions
let ballRad = 10;
let paddleH = 10;
let paddleW = 200;
let paddleX = (canvas.width-paddleW) / 2;

//brick size and layout parameters
let brickRow =3;
let brickColumn = 5;
let brickW = 75;
let brickH = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;


/*****************************************************************
general purpose functions
 *****************************************************************/

//color change
let colors = ['purple', 'green', 'red', 'orange', 'blue'];
let colorsInUse = colors[0];
function changeColor() {
    colorsInUse = colors[Math.floor(Math.random() * colors.length)];
}

//add or remove event listeners
function handleEventListeners(state = true) {
    if(state === true) {
        document.addEventListener('keydown', keyDownHandler, false);
        document.addEventListener('keyup', keyUpHandler, false);
        document.addEventListener('mousemove', mouseHandler, false);
        document.addEventListener('touchstart', touch2Mouse, false);
        document.addEventListener('touchmove', touch2Mouse, false);
        document.addEventListener('touchend', touch2Mouse, false);
    } else {
        document.removeEventListener('keydown', keyDownHandler, false);
        document.removeEventListener('keyup', keyUpHandler, false);
        document.removeEventListener('mousemove', mouseHandler, false);
        document.removeEventListener('touchstart', touch2Mouse, false);
        document.removeEventListener('touchmove', touch2Mouse, false);
        document.removeEventListener('touchend', touch2Mouse, false);
    }
}

function reset() {
    //cancel all event handlers
    handleEventListeners(false);
    //reset ball position
    x = canvas.width/2;
    y = canvas.height-30;
    //reset score
    score = 0;
    //reset animation state
    startStopAnimation = false;
    //reset brick state to allow rendering
    for(let c=0; c<brickColumn; c++) {
        for(let r=0; r<brickRow; r++) {
            bricks[c][r].state = true;
        }
    }
}

/*****************************************************************
Bricks
 *****************************************************************/

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
                        drawVictory();
                    }
                }
            }
        }
    }
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
    let text = 'Score: ' + score;
    let left =  canvas.width / 5;
    context.font = '16px Arial';
    context.fillStyle = 'green';
    context.fillText(text, left, 20);
}

//draw number of lives
function drawLives() {
    let right = canvas.width - (canvas.width / 4);
    context.font = '16px Arial';
    context.fillStyle = 'green';
    context.fillText('Extra Lives: ' + lives, right, 20);
}

//draw level
function drawLevel() {
    let center = canvas.width - (canvas.width / 2);
    context.font = '16px Arial';
    context.fillStyle = 'green';
    context.fillText('Level: ' + level, center, 20);
}

//message constructor
function message(txt) {
    //clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    //set style and text
    context.font = '25px Arial';
    context.fillStyle = 'red';
    let center = (canvas.width - context.measureText(txt).width) / 2;
    context.fillText(txt, center, canvas.height / 2 );
    //stop animation
    startStopAnimation = true;
}

//draw start game
function drawStartGame() {
    let txt = 'Start';
    createButton(txt);
}

//draw victory
function drawVictory() {
    if(level < 7) {
        let txt = 'Winner! You finished Level ' + level;
        let next = 'Next level';
        message(txt);
        createButton(next);
    } else if(level === 7) {
        let txt = 'You are the new Jedi Grand Master';
        let txtButton = 'Restart';
        message(txt);
        createButton(txtButton);
        won.play();
    }
}

//draw game over
function drawGameOver() {
    let txt = 'You lost at Level ' + level;
    let txtButton = 'Restart';
    message(txt);
    createButton(txtButton);
}

//create button constructor
function createButton(txt) {
    //remove all active event listeners
    handleEventListeners(false);

    let center = (canvas.width - context.measureText(txt).width) / 2;
    let vertical = canvas.height - (canvas.height / 3);
    let rect = {
        x:center,
        y:vertical,
        width: 120,
        height:50
    };


    //check if pointer is inside area
    function isInside(pos, rect){
        return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
    }

    canvas.addEventListener('click', function listen(evt) {
        let mousePos = {
            x: evt.clientX - canvas.offsetLeft,
            y: evt.clientY - canvas.offsetTop
        };

        console.log('mouse pos: ' + mousePos);
        console.log('center: ' + center);
        console.log('vertical: ' + vertical);
        console.log('mouse pos x: ' + mousePos.x + '|| mouse pos Y: ' + mousePos.y);
        console.log('is inside: ' + isInside(mousePos, rect));
        if (txt === 'Restart' && isInside(mousePos, rect)) {
            location.reload();
        } else if (txt === 'Start' && isInside(mousePos, rect)) {
            gameStart = true;
            motion();
            handleEventListeners();
            //remove current event listener
            canvas.removeEventListener('click', listen, false);
        } else if (txt === 'Next level' && isInside(mousePos, rect)) {
            reset();
            //increase level
            level++;
            //add extra life
            lives += 1;
            //start the game
            motion();
            //control level difficulty
            level === 3 ? dx += 1 : null;

            //increase speed
            dx > 0 ? dx += 1 : dx -= 1;
            dy < 0 ? dx -= 1 : dy += 1;
            //decrease paddle width
            paddleW -= 10;
            //remove current event listener
            canvas.removeEventListener('click', listen, false);
            //activate event listeners for game control
            handleEventListeners();
        }
    }, false);
    //draw button
    context.beginPath();
    context.rect(250, 350, 200, 100);
    context.fillStyle = '#FFFFFF';
    context.fillStyle = 'rgba(225,225,225,0.5)';
    context.fillRect(center,vertical,120,50);
    context.fill();
    context.lineWidth = 2;
    context.strokeStyle = '#000000';
    context.stroke();
    context.closePath();
    context.font = '20px Arial';
    context.fillStyle = '#000000';
    context.fillText(txt, center + 15, vertical + 30);

}


//control collision with external walls and other elements
function collisionControl() {
    //control collision with external walls
    if(x + dx < ballRad || x + dx > canvas.width - ballRad) {
        dx = -dx;
        changeColor();
        ballCollide.play();
    }

    if(y + dy < ballRad) {
        dy = -dy;
        changeColor();
        ballCollide.play();
    }

    //collision control with the paddle
    //if ball is within the canvas
    if(y + dy > canvas.height - ballRad) {
        if(x > paddleX && x < paddleX + paddleW) { //if ball hits the paddle
            dy = -dy;
            ballCollide.play();
        } else { //else if ball does not hit the paddle
            if(lives > 0) {//if there are lives remaining
                died.play();
                    lives--;
                    x = canvas.width/2;
                    y = canvas.height-30;
                    paddleX = (canvas.width-paddleW)/2;
            } else if(lives === 0){ //if there are no lives remaining
                drawGameOver();
                loose.play();
            }
        }
    }
}

function movePaddle() { //set paddle in motion
    leftPressed && paddleX > 0 ? paddleX -= 7 : null;
    rightPressed && paddleX < (canvas.width - paddleW) ? paddleX += 7 : null;
}

//event handler functions
//on key down
function keyDownHandler(e){
    e.keyCode == 37 ? leftPressed = true : null;
    e.keyCode == 39 ? rightPressed = true : null;
}

//on key up
function keyUpHandler(e) {
    e.keyCode == 37 ? leftPressed = false : null;
    e.keyCode == 39 ? rightPressed = false : null;
}

//mouse movement handler
function mouseHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > (paddleW / 2) && relativeX < canvas.width - (paddleW / 2)) {
        paddleX = (relativeX - paddleW / 2);
    }
}

//touch handle
function touch2Mouse(e) {
    let theTouch = e.changedTouches[0];
    let mouseEv;

    switch(e.type)
    {
        case "touchstart": mouseEv="mousedown"; break;
        case "touchend":   mouseEv="mouseup"; break;
        case "touchmove":  mouseEv="mousemove"; break;
        default: return;
    }

    let mouseEvent = document.createEvent("MouseEvent");
    mouseEvent.initMouseEvent(mouseEv, true, true, window, 1, theTouch.screenX, theTouch.screenY, theTouch.clientX, theTouch.clientY, false, false, false, false, 0, null);
    theTouch.target.dispatchEvent(mouseEvent);

    e.preventDefault();
}


//animate canvas elements
function motion() {
    //define animation function
    function animate() {
        if(startStopAnimation) return;
        requestAnimationFrame(motion);
    }

    //clear canvas before drawing
    context.clearRect(0, 0, canvas.width, canvas.height);
    //draw sprites on canvas
    drawBricks();
    ball();
    paddle();
    //call collision detection functions
    brickCollisionAction();
    collisionControl();
    //call UI control functions
    movePaddle();
    //draw statistics
    drawScore();
    drawLives();
    drawLevel();
    //set ball in motion
    x += dx;
    y += dy;
    //execute animation
    animate();
};

function initiate() {
    drawStartGame();
    if (gameStart === true) {
        handleEventListeners();
        motion();
        drawEnd();
        won.play();
    }
}

initiate();




