//play sound if giraffe is clicked
(function () {
    let yahoo = new Audio('./resources/sounds/yahoo.mp3');
    let giraffe = document.getElementById('giraffe');
    giraffe.addEventListener('click', function () {
        giraffe.classList.remove('pulsate');
        setTimeout(function () {
            giraffe.classList.add('pulsate');
        }, 0);
        yahoo.play();
    })
})();

/*****************************************************
 * Global variables
 *****************************************************/
//sounds
let won = new Audio('./resources/sounds/WON.mp3');
let select = new Audio('./resources/sounds/click.mp3');
let match = new Audio('./resources/sounds/match.mp3');
//timer control
let timerOnOff = false; //timer state
let timer = 0; //timer counter
//declare arrays
let intervalStore = []; //store the timer function
let array8 = []; //stores the tiles
const gifArray = [
    'https://giphy.com/embed/b1nVCMsZIwleE',
    'https://giphy.com/embed/v0YiARQxj1yc8',
    'https://giphy.com/embed/F9hQLAVhWnL56',
    'https://giphy.com/embed/l4pTfx2qLszoacZRS',
    'https://giphy.com/embed/vVzH2XY3Y0Ar6',
    'https://giphy.com/embed/3rgXBvnbXtxwaWmhr2',
    'https://giphy.com/embed/10UeedrT5MIfPG',
    'https://giphy.com/embed/l0Exk8EUzSLsrErEQ',
    'https://giphy.com/embed/26tPplGWjN0xLybiU',
    'https://giphy.com/embed/b9QBHfcNpvqDK',
    'https://giphy.com/embed/atQF1zaSGq8s8',
    'https://giphy.com/embed/MJs7EYwHyG8XC',
    'https://giphy.com/embed/2lxG3ySjtbpBe',
    'https://giphy.com/embed/dchERAZ73GvOE',
    'https://giphy.com/embed/l3V0lsGtTMSB5YNgc',
    'https://giphy.com/embed/BNBsX9OFigPvO',
    'https://giphy.com/embed/r2MeIvSVuY9Fe',
    'https://giphy.com/embed/SWV4S6i79pygM'
];

/*****************************************************
 general purpose functions
 *****************************************************/

//return random number between two values
function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

//check if element has class --> returns true or false
function hasClass(element, className) {
    return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
}

/*****************************************************
 * Generate Boards
 *****************************************************/

//generate HTML tile elements
function generateBoardTiles(num) { //takes argument with half the number of tiles to generate
    num = num * 2; //doubles the number from the argument
    while (num > 0) { //inserts HTML elements to DOM
        document.getElementById('game1').innerHTML += '<div class="tile"></div>';
        num--;
    }
}

generateBoardTiles(8); //generate the board before any other function is called
const game1 = [].slice.call(document.querySelectorAll('.game .tile')); //get all tile elements from the DOM
const message = document.getElementById('message'); //get overlay element
const stats = document.getElementById('stats'); //get statistics element

//generates the board by adding functionality through callback function for each tile element
function generateBoard(domCollection, callback, arr, gameType) {
    timerOnOff = false; //reset timer state to default
    timing(); //start timing
    //set tile images according to game type
    gameType === 'animal' ? gameType = randomNumber(1, 6) : null;
    gameType === 'letters' ? gameType = randomNumber(7, 11) : null;
    gameType === 'numbers' ? gameType = randomNumber(12, 14) : null;
    gameType === 'random' ? gameType = randomNumber(1, 14) : null;
    //iterate through tile elements and assign callback function
    domCollection.forEach(element => {
        callback(element, arr, gameType);
    });
}

//pop each element from the array and assign a tile image
function renderBoard8(element, arr, gameType) {
    let coverType; //stores the type of cover corresponding to the game type
    if (arr.length > 0) { //if there are elements left in the array
        //decide which cover to assign (animals, letters, numbers)
        gameType > 6 && gameType < 12 ? coverType = 'cover-l' : null;
        gameType > 11 ? coverType = 'cover-n' : null;
        gameType < 7 ? coverType = 'cover-a' : null;
        const holder = arr.pop(); //pop the element one by one
        element.dataset.index = holder; //assign array index as data attribute
        element.innerHTML += `<img class="back" src="./resources/images/${coverType}.jpg">`; //assign cover image
        element.innerHTML += `<img class="front" src="./resources/images/tiles/game${gameType}/${holder}.png">` //assign tile image
    }
}

//bundle functions and generate full board
function initiate(targetDomElement, arr, gameType, numOfTiles) {
    message.style.display = 'none'; //hide overlay message
    stats.innerHTML = ''; //empty statistics field
    //reset timer before game start
    if (intervalStore.length > 0) { //if there is a timer stored in intervalStore
        intervalStore.forEach(e => clearInterval(e)); //clear all timers from array
        timer = 0; //reset timer counter
    }
    clearBoard(targetDomElement); //clear all boards before game start
    resetValues(); //reset UI values
    won.pause(); //play victory sound
    won.currentTime = 0; //reset sound
    arr = random(numOfTiles, arr); //assign unique random numbers to board array multiplied by 2
    generateBoard(targetDomElement, renderBoard8, arr, gameType); //generates game board
    targetDomElement.forEach(el => el.addEventListener('click', gameProcess)); //assign game logic for each tile with 'click' event listener
}

//reset board to default condition
function clearBoard(gameDom) {
    gameDom.forEach(e => {
        e.removeAttribute('data-index'); //remove all attributes
        if (hasClass(e, 'flip')) { //remove class insertion
            e.classList.remove('flip');
        }
        while (e.firstChild) { //remove element insertion
            e.removeChild(e.firstChild);
        }
    })
}

/*****************************************************
 * Generate Random array
 *****************************************************/

//this function returns a random array double the length of the initial input
//use like this: random(8, arrayToFillWithRandomNumbers)
function random(num, newArray) {
    newArray = []; //array initially empty
    for (let i = 0; i < num; i++) { //fill array with numbers
        //fill the array twice with same numbers
        newArray.push(i + 1);
        newArray.push(i + 1);
    }
    let counter = newArray.length;
    while (counter > 0) { //while there are numbers in the array
        let index = Math.floor(Math.random() * counter); //define random index number
        counter--; //decrement the array length
        //shuffle array
        let temp = newArray[counter];
        newArray[counter] = newArray[index];
        newArray[index] = temp;
    }
    return newArray //return shuffled array
}

/*****************************************************
 * Game logic
 *****************************************************/

//game logic variables
let flipped = false;
let first, second;
let lock = false; //disable tile if true
let counter = 0; //pairs found counter
let noOfClicks = 0; //flipped tile counter

function gameProcess() {

    if (lock) return;
    if (this === first) return;
    //when a tile is clicked on flip it
    this.classList.toggle('flip');

    //if the tile is not flipped yet
    if (!flipped) {
        flipped = true;
        first = this;
        select.play();
        noOfClicks++;
        console.log('no 0f clicks: ' + noOfClicks);
        return
    }
    //if tile is flipped
    select.play();
    flipped = false;
    second = this;
    noOfClicks++;
    console.log('no 0f clicks: ' + noOfClicks);
    console.log(first.dataset.index);
    console.log(second.dataset.index);
    checkValidity();
}

//compare the two flipped tiles
function checkValidity() {
    first.dataset.index === second.dataset.index ?
        disable() : flipBack();
}

//if there is a match execute disable function
function disable() {
    let check = [...document.querySelectorAll('.game .tile')].length / 2; //returns the number of unique tiles

    match.play(); //play sound if there is a match
    //if there is a match disable click event for selected tiles
    first.removeEventListener('click', gameProcess);
    second.removeEventListener('click', gameProcess);

    counter++; //increments if a pair is found
    //if all the tiles are flipped
    if (counter > (check - 1)) {

        won.play(); //play sound
        //display message at game end with animation effect
        message.setAttribute('style', 'display: block; -webkit-animation: slide-down .3s ease-out; -moz-animation: slide-down .3s ease-out;');

        stats.innerHTML = //update message overlay with game statistics
            `
                <div class="gif"><iframe
                        src="${gifArray[randomNumber(1, gifArray.length - 1)]}" width="100%" height="100%"></iframe></div>
                <p>It took you <span class="highlight">${noOfClicks}</span> flips and <span class="highlight">${timer}</span> seconds to finish this game</p>
            `;
        timerOnOff = true; //stop the timer
        noOfClicks = 0; //reset click counter
        counter = 0; //reset counter for tile matches

    }
    resetValues(); //reset UI values
}

//if there is no match flip the tiles back to their original state
function flipBack() {
    lock = true;
    setTimeout(() => {
        first.classList.toggle('flip');
        second.classList.toggle('flip');
        resetValues();
    }, 550);
}

function timing() {

    let startTiming = setInterval(timeIncrement, 1000); //sets 1s interval for timeIncrement function
    //pushes the interval function to an array for control purposes(stop if needed)
    intervalStore.push(startTiming);

    function timeIncrement() { //increment the timer function
        timer++;
        //reset interval if timerOnOff state is changed
        if (timerOnOff) {
            timer = 0;
            clearInterval(startTiming);
        }
    }
}

//resets UI values
function resetValues() {
    [flipped, lock] = [false, false];
    [first, second] = [null, null];
}

/*****************************************************
 * Initiate boards
 *****************************************************/

initiate(game1, array8, 'random', 8); //generate a random board on page load
//assign gametype to each button
let gameType = [
    ['game1-btn', 'animal'],
    ['game2-btn', 'letters'],
    ['game3-btn', 'numbers'],
    ['random-game', 'random']
];
//add event listeners to buttons according to their type
gameType.forEach(e => document.getElementById(e[0]).addEventListener('click', initiate.bind(this, game1, array8, e[1], 8, false)));