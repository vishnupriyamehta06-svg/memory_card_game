// ================================
// MEMORY CARD GAME
// ================================

// 16 Cards (8 Pairs)
const animals = [
    "🦁","🦁",
    "🐶","🐶",
    "🐱","🐱",
    "🐼","🐼",
    "🐵","🐵",
    "🐰","🐰",
    "🦒","🦒",
    "🐯","🐯"
];

// HTML Elements
const game = document.getElementById("game");
const timerText = document.getElementById("timer");
const movesText = document.getElementById("moves");
const popup = document.getElementById("popup");
const result = document.getElementById("result");

// Game Variables
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let timer = null;
let seconds = 0;
let moves = 0;
let gameStarted = false;

// ================================
// SHUFFLE
// ================================

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        let j=Math.floor(Math.random()*(i+1));

        [array[i],array[j]]=[array[j],array[i]];

    }

}

// ================================
// CREATE BOARD
// ================================

function createBoard(){

    game.innerHTML="";

    let cards=[...animals];

    shuffle(cards);

    cards.forEach(function(animal){

        let card=document.createElement("div");

        card.className="card";

        card.dataset.animal=animal;

        card.innerHTML=`
            <div class="front">🐾</div>
            <div class="back">${animal}</div>
        `;

        card.addEventListener("click",flipCard);

        game.appendChild(card);

    });

}

// ================================
// FLIP CARD
// ================================

function flipCard(){

    if(lockBoard) return;

    if(this===firstCard) return;

    if(this.classList.contains("matched")) return;

    if(!gameStarted){

        gameStarted=true;

        startTimer();

    }

    this.classList.add("flip");

    if(firstCard==null){

        firstCard=this;

        return;

    }

    secondCard=this;

    moves++;

    movesText.innerHTML=moves;

    checkMatch();

}

// ================================
// CHECK MATCH
// ================================

function checkMatch(){

    if(firstCard.dataset.animal===secondCard.dataset.animal){

        firstCard.classList.add("matched");

        secondCard.classList.add("matched");

        resetSelection();

        finishCurrentPlayer();

    }

    else{

        lockBoard=true;

        setTimeout(function(){

            firstCard.classList.remove("flip");

            secondCard.classList.remove("flip");

            resetSelection();

        },800);

    }

}

// ================================
// RESET CARD SELECTION
// ================================

function resetSelection(){

    firstCard=null;

    secondCard=null;

    lockBoard=false;

}

// ================================
// TIMER
// ================================

function startTimer(){

    clearInterval(timer);

    timer=setInterval(function(){

        seconds++;

        timerText.innerHTML=seconds;

    },1000);

}

// ================================
// RESTART GAME
// ================================

function restartGame(){

    clearInterval(timer);

    seconds=0;

    moves=0;

    gameStarted=false;

    firstCard=null;

    secondCard=null;

    lockBoard=false;

    timerText.innerHTML="0";

    movesText.innerHTML="0";

    popup.style.display="none";

    createBoard();

}

// ================================
// CHECK GAME FINISH & STOP TIMER
// ================================

function finishCurrentPlayer(){

    let matched=document.querySelectorAll(".matched");

    if(matched.length===animals.length){

        clearInterval(timer);

        showResult();

    }

}

// ================================
// SHOW RESULT
// ================================

function showResult(){

    let score=100-(moves*2)-seconds;

    if(score<0){

        score=0;

    }

    let html="<h2>🎉 Well Played!</h2><br>";

    html+="⏱ Time Taken : <b>"+seconds+"s</b><br><br>";

    html+="🎯 Moves : <b>"+moves+"</b><br><br>";

    html+="⭐ Score : <b>"+score+"</b>";

    result.innerHTML=html;

    popup.style.display="flex";

}

// ================================
// START GAME DIRECTLY (no name form)
// ================================

window.onload=function(){

    restartGame();

};
