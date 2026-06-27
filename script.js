// ================================
// MEMORY CARD GAME - TOURNAMENT
// PART 1
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
const currentPlayerText = document.getElementById("currentPlayer");

// Game Variables
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let timer = null;
let seconds = 0;
let moves = 0;
let gameStarted = false;

// Tournament Variables
let players = [];
let scores = [];
let currentPlayer = 0;

// ================================
// SAVE PLAYER NAMES
// ================================

function savePlayers(){

    players = [];

    if(document.getElementById("p1").value.trim()!="")
        players.push(document.getElementById("p1").value.trim());

    if(document.getElementById("p2").value.trim()!="")
        players.push(document.getElementById("p2").value.trim());

    if(document.getElementById("p3").value.trim()!="")
        players.push(document.getElementById("p3").value.trim());

    if(document.getElementById("p4").value.trim()!="")
        players.push(document.getElementById("p4").value.trim());

    if(document.getElementById("p5").value.trim()!="")
        players.push(document.getElementById("p5").value.trim());

    if(players.length==0){

        alert("Please enter at least one player.");

        return;

    }

    scores = new Array(players.length).fill(0);

    currentPlayer = 0;

    document.querySelector(".players").style.display="none";

    currentPlayerText.innerHTML =
        "🎮 Current Player : <b>"+players[currentPlayer]+"</b>";

    restartGame();

}

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

        checkWinner();

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
// FINISH CURRENT PLAYER
// ================================

function finishCurrentPlayer(){

    let matched=document.querySelectorAll(".matched");

    if(matched.length===16){

        clearInterval(timer);

        // Calculate Score
        let score=100-(moves*2)-seconds;

        if(score<0){

            score=0;

        }

        scores[currentPlayer]=score;

        // Next Player

        currentPlayer++;

        if(currentPlayer<players.length){

            alert(
                players[currentPlayer-1]+
                " finished!\n\n"+
                "Next Player : "+
                players[currentPlayer]
            );

            currentPlayerText.innerHTML=
            "🎮 Current Player : <b>"+
            players[currentPlayer]+
            "</b>";

            restartGame();

        }

        else{

            showResult();

        }

    }

}

// ================================
// SHOW LEADERBOARD
// ================================

function showResult(){

    let ranking=[];

    for(let i=0;i<players.length;i++){

        ranking.push({

            name:players[i],

            score:scores[i]

        });

    }

    ranking.sort(function(a,b){

        return b.score-a.score;

    });

    let html="<h2>🏆 FINAL RESULT</h2><br>";

    const medals=["🥇","🥈","🥉","4️⃣","5️⃣"];

    for(let i=0;i<ranking.length;i++){

        html+=
        medals[i]+" <b>"+
        ranking[i].name+
        "</b> : "+
        ranking[i].score+
        "<br><br>";

    }

    html+="<hr><br>";

    html+="🎉 <b>Winner : "+ranking[0].name+"</b>";

    result.innerHTML=html;

    popup.style.display="flex";

}