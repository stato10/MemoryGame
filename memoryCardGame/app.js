document.addEventListener('DOMContentLoaded', () => {
    let cardValues = ['circle', 'circle', 'square', 'square', 'star', 'star', 'triangle', 'triangle'];

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
    let lives = 3;
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
        shuffle(cardValues);
        cardValues.forEach(value => {
            const card = createCard(value);
            gameBoard.appendChild(card);
        });
        startTimer(); // Start the timer after creating the game board
    }

    function createCard(value) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;

        const cardImage = document.createElement('img');
        cardImage.src = `assets/${value}.gif`; // Assuming your images are in a folder named "assets"
        card.appendChild(cardImage);

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
        messageContainer.style.alignItems = 'center';
        messageContainer.innerHTML = `${message}  <img height = 60px src="assets/${gifSrc}" alt="Win GIF">`;
        blurBackground.style.display = 'flex';
        blurBackground.style.fontSize = '25px';


        setTimeout(() => {
            blurBackground.style.display = 'none';
        }, 5000); // Adjust the delay as needed
    }

    function updateLives() {
        livesDisplay.innerHTML = ''; // Clear previous lives display
        for (let i = 0; i < lives; i++) {
            const heartImage = document.createElement('img');
            heartImage.src = './assets/heart.png';
            heartImage.height = 50;
            livesDisplay.appendChild(heartImage);
        }
        if (lives === 0) {
            stopTimer();
            showMessage('Game Over! You ran out of lives.', 'game-over.gif');
            resetGame();
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
                stopTimer();
                showMessage(`Congratulations! You matched all the cards in ${moves} moves and ${seconds} seconds.`, 'big-win.gif');
                resetGame();
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

    function resetGame() {
        gameBoard.innerHTML = '';
        matchedCards = [];
        moves = 0;
        lives = 3;
        seconds = 0;
        timerDisplay.textContent = 'Time: 0s';
        updateLives(); // Update the lives display after resetting the game
        createGameBoard();
    }

    restartBtn.addEventListener('click', () => {
        stopTimer();
        resetGame();
    });

    restartHardBtn.addEventListener('click', () => {
        // Adjust game difficulty for hard mode
        cardValues = ['circle', 'circle', 'square', 'square', 'star', 'star', 'triangle', 'triangle', 'diamond', 'diamond', 'trapezium', 'trapezium'];
        resetGame(); // Restart the game with new settings
    });

    restartEasyBtn.addEventListener('click', () => {
        // Adjust game difficulty for easy mode
        cardValues = ['circle', 'circle', 'square', 'square', 'star', 'star','diamond', 'diamond'];
        resetGame(); // Restart the game with new settings
    });

    createGameBoard();
});
