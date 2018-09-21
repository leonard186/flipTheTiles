//Global variables


//check if element has class --> returns true or false
function hasClass(element, className) {
    return element.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className);
};

//Get DOM elements
const dom = {
    tileGame1: document.querySelectorAll('.grid .tile'),
    tileGame1Img: document.querySelectorAll('.tile img'),
    game1: document.getElementById('game1'),
    game1Img: this.game1.getElementsByTagName('img')
};

//const addHtmlElement = `<img src="./resources/images/animals/game1/${number}.png`;

const game1Dom = [].slice.call(dom.tileGame1);
const game1ImgDom = [].slice.call(dom.game1Img);


const iterateDomCollection = function(domCollection, callback) {
    domCollection.forEach(element => {
        callback(element);
    });
};

let array8 = [];
array8 = random(8, array8);

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


function renderGame1(element) {
    if (array8.length > 0) {
        const holder = array8.pop();
        element.dataset.index = holder;
        element.innerHTML = `<img class="hidden" src="./resources/images/animals/game1/${holder}.png">`
    }
}

iterateDomCollection(game1Dom, renderGame1);

//game logic

const flipGame1 = [0, 0];

game1Dom.forEach(function(element) {
    element.addEventListener('click', function() {
        if (flipGame1[0] !== 0) {
            flipGame1[0] = Number(this.getAttribute('data-index'));
            if (hasClass(element.firstChild, 'hidden')) {
                element.firstChild.classList.remove('hidden');
                element.firstChild.classList.add('show');

            } else if (hasClass(element.firstChild, 'show')) {
                element.firstChild.classList.remove('show');
                element.firstChild.classList.add('hidden');
            }
        }
        console.log(this.getAttribute('data-index'))
    })
});