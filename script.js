
var charIndex = 0;
var wordIndex = 0;
var numWords = 50;

var correctWords = 0;
var correctCharacters = 0;
var incorrectWords = 0;

var currentWord = "";

var allWords = [];
var wordsList = [];

let red = "rgb(255, 50, 50)";
let green = "rgb(50, 255, 100)"
let offWhite = "rgb(238, 234, 231)";

let started = false;
let startTime;
let elapsedMS;

function KeyPressed(event){
    let code = event.code;
    if(event.repeat && code == "Space"){
        event.preventDefault();
        return;
    }
    let text = captureText();

    if(event.code == "Space" || event.code == "Enter"){
        event.preventDefault();
        clearInput();
        let correct = (currentWord == text);

        if(correct){
            correctCharacters ++;
            correctWords ++;
            setWord(green);
        } else {
            incorrectWords ++;
            setWord(red);
        }
        updateWPM();

        charIndex = 0;
        wordIndex ++;
        if(wordIndex >= numWords){
            finish();
        }
        currentWord = wordsList[wordIndex];

    }

    else if(event.code == "Backspace"){
        if(charIndex > 0){
            if(event.ctrlKey){
                charIndex = 0;
                setWord(offWhite);
            } else {
                charIndex --;
                setChar(charIndex, offWhite);
            }
        }
    }

    else {
        //check if the user just started typing
        if(!started){
            started = true;
            startTime = new Date();
            elapsedMS = 0;
        }
        started = true;

        //colour the current character respectively
        let given = event.key;
        let char = document.getElementById("typing-text")
        .childNodes[wordIndex] //word
        .childNodes[charIndex]; //character

        let color;

        if(given == char.innerHTML){
            correctCharacters ++;
            color = green;
        } else {
            color = red;
        }

        char.style.color = color;        
        charIndex ++;
    }

}

function updateWPM(){
    if(correctCharacters > 0){
        let words = correctCharacters / 5;
        let minutes = elapsedMS / 1000 / 60; // Minutes
        let wpm = words / minutes;
        setWPM(wpm);
    }
}

function setWPM(wpm){
    document.getElementById("wpm").innerHTML = "wpm: " + Math.floor(wpm);
}

function clearInput(){
    document.getElementById("input-capture").innerHTML="";
}

function setWord(color){
    for(let i = 0; i < currentWord.length; i++){ // - 1 to account for length
        setChar(i, color);
    }
}

function setChar(i, color){
    document.getElementById("typing-text").childNodes[wordIndex].childNodes[i].style.color = color;
}

async function reset(){
    document.getElementById("input-capture").contentEditable = 'true';

    await loadWords();
    started = false;
    elapsedMS = 0;
    correctWords = 0;
    correctCharacters = 0;
    incorrectWords = 0;
    wordIndex = 0;
    currentWord = wordsList[wordIndex];
    charIndex = 0;
    setTime("0:00");
    clearInput();
    setWPM(0);
}

async function loadWords(){
    await fetch('res/1000-most-common-words.txt')
    .then((res) => res.text())
    .then((t) => allWords = t.split("\n"))
    .catch((error) => console.error(error));
    updateList();
}

function updateList(){
    // first clear any words form the list
    document.getElementById("typing-text").innerHTML = "";

    wordsList = [];
    for(i = 0; i < numWords; i++){
        let n = Math.floor(Math.random() * allWords.length);
        wordsList.push(allWords[n]);
    }

    for(const word of wordsList){
        document.getElementById("typing-text")
        const wordSpan = document.createElement("span");

        for(const char of word){
            const character = document.createElement("span");
            character.textContent = char;
            wordSpan.appendChild(character);
        }
        const space = document.createElement("span");
        space.textContent = " ";
        wordSpan.appendChild(space);
        document.getElementById("typing-text").appendChild(wordSpan);
    }

}

function captureText(){
    let text = document.getElementById("input-capture").textContent;
    return text;
}

function wordAccuracy(actual, given){
    accuracy = actual === given;
}

function finish(){
    started = false;
    elapsedMS = 0;
    correctWords = 0;
    correctCharacters = 0;
    incorrectWords = 0;
    wordIndex = 0;
    charIndex = 0;

    document.getElementById("input-capture").contentEditable = 'false';
    document.getElementById("input-capture").innerHTML = "...";
}

const inputCapture = document.getElementById("input-capture");
inputCapture.addEventListener("keydown", function(event) {
    KeyPressed(event);
});

function updateTime() {
    if(started){
        let currentTime = new Date();
        let elapsedTime  = currentTime - startTime;
        const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60)); // Minutes
        const seconds = padZero(Math.floor((elapsedTime % (1000 * 60)) / 1000)); // Seconds
        let formattedTime = `${minutes}:${seconds}`;
        setTime(formattedTime);
    }
}

function setTime(time){
    document.getElementById("timer").innerHTML = time;
}

function padZero(number) {
    return number < 10 ? '0' + number : number.toString();
}

function updateMS(){
    if(started){
        elapsedMS = (new Date()) - startTime;
    }
}

setInterval(updateTime, 1000);
setInterval(updateMS, 1);