
function Rank(name, time, lives, mode) {
    this.name = name;
    this.time = time;
    this.lives = lives;
    this.mode = mode;
}

 function rankBoard() {
    const rankList = document.querySelector('.rank');
    rankList.innerHTML = '<h2> <img height="40px" src="assets/rank.gif" alt="Rank Image"> Rank List </h2>';

    let ranks = [];
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let item = localStorage.getItem(key);
        let obj = JSON.parse(item);
        ranks.push(obj);
    }

    // Sort ranks by time in ascending order
    ranks.sort((a, b) => a.time - b.time);

    ranks.forEach(obj => {
        let li = document.createElement('li');
        li.textContent = `Name: ${obj.name}, Best Time: ${obj.time} sec, Lives: ${obj.lives}, Level: ${obj.mode}`;

        const btnRemove = document.createElement('button');
        btnRemove.id = 'remove'
        btnRemove.textContent = 'Remove';
        btnRemove.addEventListener('click', function() {
            localStorage.removeItem(obj.name);
            rankBoard(); // Refresh the list after removal
        });

        li.appendChild(btnRemove);
        rankList.appendChild(li);
    });

    const closeRankBtn = document.createElement('button');
    closeRankBtn.textContent = 'Close';
    closeRankBtn.addEventListener('click', () => {
        rankList.style.display = 'none';

    });

    rankList.appendChild(closeRankBtn);


    
}



document.addEventListener('DOMContentLoaded', () => {

    rankBoard(); // Refresh


    const gameBoard = document.getElementById('game-board');
    const timerDisplay = document.getElementById('timer');
    const livesDisplay = document.getElementById('lives');
    const restartBtn = document.getElementById('restart-btn');
    const restartHardBtn = document.getElementById('restart-hard-btn');
    const restartEasyBtn = document.getElementById('restart-easy-btn');
    const blurBackground = document.getElementById('blur-background');
    const messageContainer = document.getElementById('message-container');

    let flippedCards = [];
    let matchedCards = [];
    let moves = 0;
    let lives = 4;
    let timer;
    let seconds = 0;

    function shuffle(array) {
        let m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

function createGameBoard() {
    const rankList = document.querySelector('.rank');

    // Check if the rank board is visible
    if (rankList.style.display === 'flex') {
        // Delay the game start until the rank board is closed
        rankList.addEventListener('transitionend', function setupGame() {
            shuffle(cardValues);
            cardValues.forEach(value => {
                const card = createCard(value);
                gameBoard.appendChild(card);
            });
            rankList.removeEventListener('transitionend', setupGame); // Remove the event listener once executed
        });

    } 
    else {
        // If the rank board is not visible, start the game immediately
        shuffle(cardValues);
        cardValues.forEach(value => {
            const card = createCard(value);
            gameBoard.appendChild(card);
        });
        startTimer(); 
    }
}


function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;

    const cardImage = document.createElement('img');
    cardImage.src = `/memoryCardGame/assets/${value}.gif`;
    cardImage.alt = "Memory Game Card";
    
    const cardCover = document.createElement('div');
    cardCover.classList.add('card-cover');

    card.appendChild(cardImage);
    card.appendChild(cardCover);
    card.addEventListener('click', flipCard);

    return card;
}

    function startTimer() {
        timer = setInterval(() => {
            seconds++;
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            timerDisplay.textContent = `Time: ${minutes}m ${remainingSeconds}s`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }

    function showMessage(message, gifSrc) {
        messageContainer.innerHTML = `${message}  <img height = 60px src="assets/${gifSrc}" alt="Win GIF">`;
        blurBackground.style.display = 'flex';
        blurBackground.style.fontSize = '25px';


        setTimeout(() => {
            blurBackground.style.display = 'none';
            stopTimer();
            resetGame();

        }, 3500); 
    }

    function updateLives() {
        livesDisplay.innerHTML = ''; 
        for (let i = 0; i < lives; i++) {
            const heartImage = document.createElement('img');
            heartImage.src = '/memoryCardGame/assets/heart.png';
            heartImage.height = 50;
            livesDisplay.appendChild(heartImage);
        }
        if (lives === 0) {
            showMessage('Game Over! You ran out of lives.', 'game-over.gif');
        }
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped');
            flippedCards.push(this);

            if (flippedCards.length === 2) {
                moves++;
                checkMatch();
            }
        }
    }

 
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.value === card2.dataset.value) {
        matchedCards.push(card1, card2);
        if (matchedCards.length === cardValues.length) {
            showMessage(`Congratulations! You matched all the cards in ${moves} moves and ${seconds} seconds.`, 'big-win.gif');
            requestPlayerNameAndSaveRank();
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);

        lives--;
        updateLives();
    }

    flippedCards = [];
}

function requestPlayerNameAndSaveRank() {
    let name = prompt("What is your name, champion?");
    if (name) { 

        let rank = new Rank(name, seconds, lives, mode);
        localStorage.setItem(rank.name, JSON.stringify(rank));
      
    }

    rankBoard();

    displayRankBoard();

}

function displayRankBoard() {
    const rankList = document.querySelector('.rank');
  

    stopTimer(); 
    rankList.style.display = 'flex'; 
}


    function resetGame() {
        gameBoard.innerHTML = '';
        matchedCards = [];
        moves = 0;
        lives = 4;
        seconds = 0;
        timerDisplay.textContent = 'Time: 0s';
        stopTimer();
        updateLives(); 
        createGameBoard();
    }

    restartBtn.addEventListener('click', () => {
        stopTimer();
        resetGame();
    });

    restartHardBtn.addEventListener('click', () => {
      
        cardValues = ['circle', 'circle', 'square', 'square', 'star', 'star', 'triangle', 'triangle', 'diamond', 'diamond', 'trapezium', 'trapezium'];
        mode = 'hard';
        resetGame();
    });

    restartEasyBtn.addEventListener('click', () => {
      
        cardValues = ['circle', 'circle', 'square', 'square', 'star', 'star', 'triangle', 'triangle'];
        mode = 'easy';
        resetGame();
    });

    createGameBoard();


});


