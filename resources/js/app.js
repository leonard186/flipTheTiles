/*****************************************************
 * Global variables
 *****************************************************/
let audio = new Audio('./resources/sounds/WON.mp3');

/*****************************************************
 * declare arrays
 *****************************************************/const game2 = [].slice.call(document.querySelectorAll('.game .tile'));

    let array8 = [];
    let array16 = [];

    /*****************************************************
     * general purpose functions
     *****************************************************/


//check if element has class --> returns true or false
    function hasClass(element, className) {
        return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
    };

    /*****************************************************
     * Generate Boards
     *****************************************************/
    generateBoardTiles(8);
    function generateBoard(domCollection, callback, arr, gameNumber) {
        domCollection.forEach(element => {
            callback(element, arr, gameNumber);
        });
    };

    function renderBoard8(element, arr, gameNumber) {
        if (arr.length > 0) {
            const holder = arr.pop();
            element.dataset.index = holder;
            element.innerHTML += `<img class="back" src="./resources/images/cover.png">`;
            element.innerHTML += `<img class="front" src="./resources/images/animals/game${gameNumber}/${holder}.png">`
        }
    };

    function initiate(targetDomElement, arr, gameNumber, numOfTiles) {
        clearBoard(targetDomElement);
        resetValues();
        arr = random(numOfTiles, arr);
        generateBoard(targetDomElement, renderBoard8, arr, gameNumber);
        targetDomElement.forEach(el => el.addEventListener('click', gameProcess));
    }

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

function generateBoardTiles(num) {
    num = num * 2;
    while (num > 0) {
        document.getElementById('game1').innerHTML += '<div class="tile"></div>';
        num--;
    }
}

/***************************************************
 /////////////////////////// not in use
function generateBoardTiles(arr) {
        //document.getElementById('game').innerHTML = '';
        let c = arr.length;
        while (c > 0) {
            document.getElementById('game').innerHTML += '<div class="tile"></div>';
            c--;
        }
    }

*///////////////////////////////////////////


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
     * Generate Boards
     *****************************************************/

//game logic variables
    let flipped = false;
    let first, second;
    let lock = false;
    let counter = 0;


    function gameProcess() {

        if (lock) return;
        if (this === first) return;

        this.classList.toggle('flip');

        if (!flipped) {
            flipped = true;
            first = this;
            return
        }
        flipped = false;
        second = this;
        console.log(first.dataset.index);
        console.log(second.dataset.index);
        checkValidity();
    }

    function checkValidity() {
        first.dataset.index === second.dataset.index ?
            disable() : flipBack();
    }

    function disable() {
        let check = [... document.querySelectorAll('.game .tile')].length / 2;
        first.removeEventListener('click', gameProcess);
        second.removeEventListener('click', gameProcess);
        counter++;
        if (counter > (check - 1)) {
            audio.play();
        }
        resetValues();
        console.log('counter:' + counter);
    }

    function flipBack() {
        lock = true;
        setTimeout(() => {
            first.classList.toggle('flip');
            second.classList.toggle('flip');
            resetValues();
        }, 550);

    }

    function resetValues() {
        [flipped, lock] = [false, false];
        [first, second] = [null, null];
    }

/*****************************************************
 * Initiate boards
 *****************************************************/

    const game1 = [].slice.call(document.querySelectorAll('.game .tile'));

    //const game2 = [].slice.call(document.querySelectorAll('.game')[1].querySelectorAll('.tile'));
    document.getElementById('game1-btn').addEventListener('click', initiate.bind(this, game1, array8, 1, 8, false));
    document.getElementById('game2-btn').addEventListener('click', initiate.bind(this, game1, array16, 2, 8, false));









