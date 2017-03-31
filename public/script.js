/* global $, swal,  */

let ws; // websocket connection to server

let $letterInput; // input field for guess
let $submitGuessButton; // submit button
let $stateText; // current gamestate field (_ _ _ _)
let $numberOfMistakes; // number of mistakes made
let $wrongGuesses; // list of mistakes
let $correctGuesses; // list of correct guesses

const websocketUrl = 'ws://localhost:8080';
// let websocketUrl = 'ws://192.168.xxx.xxx:8080';

$(document).ready(() => {
  $stateText = $('[data-stateText]');
  $letterInput = $('[data-letterInput]');
  $submitGuessButton = $('[data-submitGuessButton]');
  $numberOfMistakes = $('[data-numberOfMistakes]');
  $wrongGuesses = $('[data-wrongGuesses]');
  $correctGuesses = $('[data-correctGuesses]');

  $letterInput.on('focus', () => {
    $letterInput.val('');
  });
  $submitGuessButton.click(() => {
    const input = $letterInput.val();
    if (
      input &&
      input.length === 1 &&
      input.match(/[a-z0-9]/i,
    )) {
      guess($letterInput.val().toLowerCase());
      $letterInput.val('');
      $letterInput.focus();
    }
  });

  ws = new WebSocket(websocketUrl);
  ws.onopen = () => {
    if (!localStorage.id) {
      const p = {
        type: 'INIT',
      };
      ws.send(JSON.stringify(p));
    } else {
      // if we have a game in localStorage, load from server
      initFromLocalStorage();
    }
  };
  ws.onmessage = (message) => {
    const m = JSON.parse(message.data);
    switch (m.type) {
      case 'INIT':
        init(m);
        break;
      case 'STATE':
        init(m);
        break;
      case 'GUESS':
        guessResult(m);
        break;
      case 'GAME_NOT_FOUND':
        gameNotFound();
        break;
      case 'GAME_OVER':
        gameOver(m);
        break;
      case 'VICTORY':
        victory(m);
        break;
      default:
        break;
    }
  };
});

function init(msg) {
  if (!msg.wrongGuesses) {
    swal({
      title: 'Hi!',
      text: 'Welcome to Hangman, lets see if you can guess the word! Try one letter or number at a time, don\'t make more then 4 mistakes!',
      type: 'info',
    });
  }
  console.log(msg);
  localStorage.clear();
  localStorage.id = msg.id;
  $wrongGuesses.html(msg.wrongGuesses && msg.wrongGuesses.join(' '));
  $numberOfMistakes.html(msg.wrongGuesses && msg.wrongGuesses.length);
  setState(msg.state);
}
function initFromLocalStorage() {
  msgServer({
    type: 'GET_STATE',
    id: localStorage.id,
  });
}

function guessResult(msg) {
  if (msg.result === 'SUCCESS') {
    $correctGuesses.html(msg.correctGuesses.join(' '));
    $stateText.addClass('rubberBand animated guess-success');
    setTimeout(() => {
      $stateText.removeClass('rubberBand guess-success');
    }, 1200);
  } else {
    $numberOfMistakes.html(msg.wrongGuesses.length);
    $wrongGuesses.html(msg.wrongGuesses.join(' '));
    $stateText.addClass('animated shake');
    setTimeout(() => {
      $stateText.removeClass('animated shake');
    }, 1200);
  }
  setState(msg.state);
}
function restartGame() {
  localStorage.clear();
  location.reload();
}

function setState(state) {
  $stateText.html(`[ ${state.split('').join(' ')} ]`);
}

function guess(letter) {
  msgServer({
    type: 'GUESS',
    id: localStorage.id,
    letter,
  });
}
function gameNotFound() {
  swal({
    title: 'Sorry',
    text: 'Your game was not found, click OK to start a new game',
    type: 'info',
  }, () => {
    restartGame();
  });
}
function gameOver(msg) {
  swal({
    title: 'GAME OVER!',
    html: true,
    text: `The word was <strong>${msg.word}</strong>. <br>Thanks for playing, click OK to try again`,
    type: 'error',
  }, () => {
    restartGame();
  });
}
function victory(msg) {
  setState(msg.word);

  let mistakesText = 'without mistakes!';
  if (msg.wrongGuesses.length === 1) {
    mistakesText = 'with just a single mistake';
  }
  if (msg.wrongGuesses.length > 1) {
    mistakesText = `with just ${msg.wrongGuesses.length} mistakes`;
  }

  setTimeout(() => {
    swal({
      title: 'Congratulations!',
      html: true,
      text: `You guessed the word <strong>${msg.word}</strong> ${mistakesText} <br>Click OK to play a new game`,
      type: 'success',
    }, () => {
      restartGame();
    });
  }, 100);
}
function msgServer(msg) {
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify(msg));
  } else {
    swal({
      title: 'Oops!',
      text: 'Something went wrong, please try again',
      type: 'error',
    }, () => {
      // if somehow the socket closes midplay, reloading the page connects
      // the player back up without losing progress
      location.reload();
    });
    throw new Error('Socket not open');
  }
}
