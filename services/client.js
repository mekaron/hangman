module.exports = {
  sendMessage,
  sendGameInit,
  sendSuccess,
  sendFail,
  sendGameOver
}

function sendMessage(msg, ws) {
  // todo: verify msg is json
  ws.send(JSON.stringify(msg));
}

function sendGameInit(game, ws) {
  const clientMessage = {
    id: game.id,
    state: game.state,
  }
  sendMessage(clientMessage, ws);
}
function sendSuccess(game, ws) {
  const clientMessage = {
    type: 'GUESS',
    result: 'SUCCESS',
    state: game.state,
    letter: game.guesses[game.guesses.length], // last guess
  }
  sendMessage(clientMessage, ws);
}
function sendFail(game, ws) {
  const clientMessage = {
    type: 'GUESS',
    result: 'FAIL',
    state: game.state,
    letter: game.guesses[game.guesses.length], // last guess
  }
  sendMessage(clientMessage, ws);
}
function sendGameOver(game, ws) {
  const clientMessage = {
    type: 'GAME_OVER',
    word: game.word,
    guesses: game.guesses,
  };
  sendMessage(clientMessage, ws);
}
