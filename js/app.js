const allCards = document.querySelectorAll('.card');
let openCards = [];
let matchedCards = [];
let clicksCounted = [];
const modal = document.getElementById('success-modal');
const span = document.getElementsByClassName('close')[0];
const starRating = document.getElementsByClassName('stars')[0];
let moves = document.querySelector('span.moves');
const refreshIcon = document.querySelector('.restart');
let timer = document.getElementById('output');
let replayButton = document.getElementById('replay');
let running = 0;
let successTimer = document.getElementById('final-output');

/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffleDeck() {
  let deck = document.querySelector('ul.deck');
  for (let i = deck.children.length; i >= 0; i--) {
    deck.appendChild(deck.children[Math.random() * i | 0])
  }
}
shuffleDeck();

function attemptsMade() {
  if (clicksCounted.length % 2 == 0) {
    moves.innerHTML = clicksCounted.length / 2
  }
}

allCards.forEach(function(card) {
  card.addEventListener('click', function(e) {
    startStop();
    openCards.push(card);
    clicksCounted.push(card);
    card.classList.add('open', 'show');
    attemptsMade();
    enableCards();

    if (openCards.length == 2 && (openCards[0].firstElementChild.className == openCards[1].firstElementChild.className)) {
      openCards.forEach(function(card) {
        matchedCards.push(card);
        card.classList.add('match');
      })
    }

    if (openCards.length == 2 && (openCards[0] != openCards[1])) {
      setTimeout(function(clearCards) {
        openCards.forEach(function(card) {
          card.classList.remove('open', 'show')
        });
        openCards = [];
      }, 400);
    }

    if (openCards.length == 2) {
      disableCards = setTimeout(function() {
        allCards.forEach(function(card) {
          card.classList.add('hold')
        });
      }, 100);
    }

    let matches = matchedCards.length;
    if (matches == 16) {
      running = 0;
      tenths = -1;
      modal.style.display = 'block';
      document.getElementById('attempts-made').innerHTML = clicksCounted.length / 2;
      document.getElementById('final-output').innerHTML = successTimer.innerHTML;
    }

    function starRating() {
      if (clicksCounted.length > 24) {
        document.getElementById('third-star').className = 'fa fa-star-o';
        document.getElementById('star-three').className = 'fa fa-star-o';

      }

      if (clicksCounted.length > 36) {
        document.getElementById('second-star').className = 'fa fa-star-o';
        document.getElementById('star-two').className = 'fa fa-star-o';

      }
    }
    starRating();
  })
})

/*reset the html for the timer, reset the start-stop toggle to stopped*/
refreshIcon.addEventListener('click', function() {
  refreshBoard();
})

/*1000 tenths equals 1 second and 100 tenths equals one tenth of a second.*/
/* 0 returns false because it is not a value*/
let tenths = 0;
let seconds = 0;
let minutes = 0;

function addTime() {
  if (running == 1) {
    setTimeout(function increment() {
      tenths++;
      if (tenths >= 10) {
        tenths = 0;
        seconds++;
        if (seconds >= 60) {
          seconds = 0;
          minutes++;
        }
      }
      timer.innerHTML = `${(minutes > 0
																	? (minutes<10
																		 ?`0${minutes}`
																		 :`${minutes}`)
																	:`00`)}
															:${(seconds > 0
																	? (seconds<10
																		 ?`0${seconds}`
																		 : `${seconds}`)
																	: `00`)}
															:${(tenths > 0
																	? (tenths<10
																		 ?`0${tenths}`
																		 : `${tenths}`)
																	: `00`)}`;

      successTimer.innerHTML = `${minutes}mins ${seconds}secs`;
      addTime();
    }, 100)
  }
}

/*This function needs to be triggered by the first card click to flip the switch and triggered again by the last match made to stop it*/
function startStop() {
  if (running == 0) {
    running = 1;
    addTime();
  }
}

function clearClock() {
  timer.innerHTML = '00:00:00';
  successTimer.innerHTML = "";
  tenths = -1; /*the clock runs for a second during refresh resulting in a tenth of a second being put on the clock*/
  seconds = 0;
  minutes = 0;
  running = 0;
}

function refreshBoard() {
  clearClock();
  shuffleDeck();
  matchedCards = [];
  openCards = [];
  starRating.innerHTML = "<li><i id='first-star' class='fa fa-star'></i></li><li><i id='second-star' class='fa fa-star'></i></li><li><i id='third-star' class='fa fa-star'></i></li>";
  clicksCounted = [];
  moves.innerHTML = '0';
  allCards.forEach(function(card) {
    card.classList.remove('open', 'show', 'match');
  })
}

function hideModal() {
  modal.style.display = 'none';
}

span.onclick = function() {
  hideModal();
}

replayButton.addEventListener('click', function() {
  refreshBoard();
  hideModal();
})

function enableCards() {
  setTimeout(function() {
    allCards.forEach(function(card) {
      card.classList.remove('hold')
    });
  }, 300);
}



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
