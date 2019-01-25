'use strict';
// display playing time

const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false,
    lockBoard = false,
    firstCard = null,
    secondCard = null,
    cntFlippedCards = 0,
    isTimerStarted = false,
    startTime = 0;

function flipCard() {
    isTimerStarted || startTimer();

    if(lockBoard || this === firstCard) {
        return;
    }

    this.classList.toggle('flip');
    if(!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    } 
    hasFlippedCard = false;
    secondCard = this;

    checkForMatch();
}

function startTimer() {
    isTimerStarted = true;
    startTime = new Date();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.img === secondCard.dataset.img;
    isMatch ? disableCards() : unFlipCards();
}

function disableCards() {
    cntFlippedCards += 2;
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    cntFlippedCards === 12 ? restartGame() : resetBoard();
}

function unFlipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        lockBoard = false;
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function getTime() {
    const ms = (new Date() - startTime)
    const min = Math.floor((ms/1000/60) << 0);
    const sec = Math.floor((ms/1000) % 60);
    return [min, sec];
}

function restartGame() {
    const [min, sec] = getTime();
    const [gameEndTitleEl, gameEndSubtitleEl] = document.getElementsByName('game-end-title');
    setTimeout(() => {
        gameEndTitleEl.style.display = 'inline-block';
        gameEndSubtitleEl.innerText = `Your time is ${min > 10 ? min : '0' + min}:${sec > 10 ? sec : '0' + sec}`;
        gameEndSubtitleEl.style.display = 'inline-block';
    }, 100);
    setTimeout(() => {
        location.reload();
    }, 1500);
}

(function shuffle() {
    cards.forEach(card => {
        let position = Math.floor(Math.random() * 12);
        card.style.order = position;
    });
})();
cards.forEach(card => card.addEventListener('click', flipCard));