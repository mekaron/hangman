module.exports = {
  sendMessage,
  sendState,
  sendGameInit,
  sendGameNotFound,
  sendSuccess,
  sendFail,
  sendGameOver,
  sendVictory,
};

function sendMessage(msg, ws) {
  ws.send(JSON.stringify(msg));
}
function sendState(game, ws) {
  const clientMessage = {
    type: 'STATE',
    id: game.id,
    state: game.state,
    wrongGuesses: game.wrongGuesses,
    correctGuesses: game.correctGuesses,
  };
  sendMessage(clientMessage, ws);
}
function sendGameNotFound(ws) {
  const clientMessage = {
    type: 'GAME_NOT_FOUND',
  };
  sendMessage(clientMessage, ws);
}
function sendGameInit(game, ws) {
  const clientMessage = {
    type: 'INIT',
    id: game.id,
    state: game.state,
  };
  sendMessage(clientMessage, ws);
}
function sendSuccess(game, ws) {
  const clientMessage = {
    type: 'GUESS',
    result: 'SUCCESS',
    state: game.state,
    letter: game.correctGuesses[game.correctGuesses.length - 1], // last guess
    correctGuesses: game.correctGuesses,
  };
  sendMessage(clientMessage, ws);
}
function sendFail(game, ws) {
  const clientMessage = {
    type: 'GUESS',
    result: 'FAIL',
    state: game.state,
    letter: game.wrongGuesses[game.wrongGuesses.length - 1], // last guess
    wrongGuesses: game.wrongGuesses,
  };
  sendMessage(clientMessage, ws);
}
function sendGameOver(game, ws) {
  const clientMessage = {
    type: 'GAME_OVER',
    word: game.word,
    wrongGuesses: game.wrongGuesses,
  };
  sendMessage(clientMessage, ws);
}
function sendVictory(game, ws) {
  const clientMessage = {
    type: 'VICTORY',
    word: game.word,
    wrongGuesses: game.wrongGuesses,
  };
  sendMessage(clientMessage, ws);
}
