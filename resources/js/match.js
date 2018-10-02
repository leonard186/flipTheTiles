/*****************************************************
 * Global variables
 *****************************************************/
let won = new Audio('../sounds/WON.mp3');
let select = new Audio('../sounds/click.mp3');
let match = new Audio('../sounds/match.mp3');
let timerOnOff = false;
let timer = 0;
let gameClicks = 0;
let intervalStore = [];
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


//play sound if giraffe is clicked
(function() {
    let yahoo = new Audio('../sounds/yahoo.mp3');
    let giraffe = document.getElementById('giraffe');
    giraffe.addEventListener('click', function(){
        giraffe.classList.remove('pulsate');
        setTimeout(function(){
            giraffe.classList.add('pulsate');
        }, 0);
        yahoo.play();
    })
})();


/*****************************************************
 * declare arrays
 *****************************************************/

    let array8 = [];

    /*****************************************************
     * general purpose functions
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
    };

    /*****************************************************
     * Generate Boards
     *****************************************************/

    //generate the board
    generateBoardTiles(8);
    //get all tile elements from the DOM
    const game1 = [].slice.call(document.querySelectorAll('.game .tile'));
    //get overlay element
    const message = document.getElementById('message');
    //get statistics element
    const stats = document.getElementById('stats');

    //iterate through the tiles and call the callback function to render the images
    function generateBoard(domCollection, callback, arr, gameType) {
        timerOnOff = false;
        timing();
        gameType === 'animal' ? gameType = randomNumber(1, 6) : null;
        gameType === 'letters' ? gameType = randomNumber(7, 11) : null;
        gameType === 'numbers' ? gameType = randomNumber(12, 14) : null;
        gameType === 'random' ? gameType = randomNumber(1, 14) : null;
        console.log('game number: ' + gameType);
        domCollection.forEach(element => {
            callback(element, arr, gameType);
        });
    };

    //take each element of the array and add the tile images
    function renderBoard8(element, arr, gameType) {
        let coverType;
        if (arr.length > 0 ) {
            console.log('game type: ' + gameType);
            //set cover type (animals, letters, numbers)
            gameType > 6 && gameType < 12 ? coverType = 'cover-l' : null;
            gameType > 11 ? coverType = 'cover-n' : null;
            gameType < 7 ? coverType = 'cover-a' : null;

            const holder = arr.pop();
            element.dataset.index = holder;
            element.innerHTML += `<img class="back" src="../images/${coverType}.jpg">`;
            element.innerHTML += `<img class="front" src="../images/tiles/game${gameType}/${holder}.png">`
        }
    };

    //call the functions that generate the tiles and control the game
    function initiate(targetDomElement, arr, gameType, numOfTiles) {
        message.style.display = 'none';
        stats.innerHTML = '';
        if(intervalStore.length > 0) {
            intervalStore.forEach(e => clearInterval(e));
            timer = 0;
        }
        clearBoard(targetDomElement);
        resetValues();
        won.pause();
        won.currentTime = 0;
        arr = random(numOfTiles, arr);
        generateBoard(targetDomElement, renderBoard8, arr, gameType);
        targetDomElement.forEach(el => el.addEventListener('click', gameProcess));
    }

    //clear the board from every extra attributes and classes
    function clearBoard(gameDom) {
        gameDom.forEach(e => {
            e.removeAttribute('data-index');
            if (hasClass(e, 'flip')) {
                e.classList.remove('flip');
            }
            while (e.firstChild) {
                e.removeChild(e.firstChild);
            }
        })
    }

        //generate div elements where tile will be held
    function generateBoardTiles(num) {
        num = num * 2;
        while (num > 0) {
            document.getElementById('game1').innerHTML += '<div class="tile"></div>';
            num--;
        }
    }

/*****************************************************
 * Generate Random array
 *****************************************************/

//this function returns a random array double the length of the initial input
//use like this: random(8, arrayToFillWithRandomNumbers)
    function random(num, newArray) {
        newArray = [];
        for (let i = 0; i < num; i++) {
            newArray.push(i + 1);
            newArray.push(i + 1);
        }
        let counter = newArray.length;
        while (counter > 0) {
            let index = Math.floor(Math.random() * counter);
            counter--;
            let temp = newArray[counter];
            newArray[counter] = newArray[index];
            newArray[index] = temp;
        }
        return newArray
    }

    /*****************************************************
     * Game logic
     *****************************************************/

//game logic variables
    let flipped = false;
    let first, second;
    let lock = false;
    let counter = 0;
    let noOfClicks = 0;



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
        let check = [... document.querySelectorAll('.game .tile')].length / 2;
        //play sound if there is a match
        match.play();
        //if there is a match disable click event for selected tiles
        first.removeEventListener('click', gameProcess);
        second.removeEventListener('click', gameProcess);
        //counts the amount of pairs found
        counter++;
        //if all the tiles are flipped
        if (counter > (check - 1)) {
            //play sound
            won.play();
            //show message at game end
            message.setAttribute('style', 'display: block; -webkit-animation: slide-down .3s ease-out; -moz-animation: slide-down .3s ease-out;');
            //update DOM with statistics
            stats.innerHTML =
                `
                <div class="gif"><iframe
                        src="${gifArray[randomNumber(1, gifArray.length - 1)]}" width="100%" height="100%"></iframe></div>
                <p>It took you <span class="highlight">${noOfClicks}</span> flips and <span class="highlight">${timer}</span> seconds to finish this game</p>
            `;
            console.log('total clicks: ' + noOfClicks);
            console.log('total timer: ' + timer);
            //change the state of the timer
            timerOnOff = true;
            //reset the click counter
            noOfClicks = 0;
            //reset counter for tile matches
            counter = 0;

        }
        resetValues();
        console.log('counter:' + counter);
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
        console.log('gameclicks: ' + gameClicks);
        //sets the interval count
        let startTiming = setInterval(timeIncrement, 1000);
        //pushes the interval function to an array so it can be stopped if certain conditions are met
        intervalStore.push(startTiming);

        //increment the timer
        function timeIncrement() {
            timer++;

            console.log(timer);
            //reset interval if timerOnOff state is changed
            if (timerOnOff) {
                console.log('time up: ' + timer);
                timer = 0;
                clearInterval(startTiming);
            }
        }
    }

    //resets the values for the game logic
    function resetValues() {
        [flipped, lock] = [false, false];
        [first, second] = [null, null];
    }



/*****************************************************
 * Initiate boards
 *****************************************************/

    initiate(game1, array8, 'random', 8);

    //assign game initiation on button click
    document.getElementById('game1-btn').addEventListener('click', initiate.bind(this, game1, array8, 'animal', 8, false));
    document.getElementById('game2-btn').addEventListener('click', initiate.bind(this, game1, array8, 'letters', 8, false));
    document.getElementById('game3-btn').addEventListener('click', initiate.bind(this, game1, array8, 'numbers', 8, false));
    document.getElementById('random-game').addEventListener('click', initiate.bind(this, game1, array8, 'random', 8, false));


















