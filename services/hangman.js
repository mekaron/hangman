const uuid = require('node-uuid');
const _ = require('lodash');

const storage = require('../storage');
const words = require('../resources/words');
const hangman = require('../lib/hangman');
const client = require('../services/client');

module.exports = {
  getState,
  initGame,
  guess,
};

function getState(gameId, ws) {
  const game = storage.games[gameId];
  if (!game) {
    return client.sendGameNotFound(ws);
  }
  client.sendState(game, ws);
}

function initGame(ws) {
  // initialise a new game with empty parameters
  const newGame = {
    id: uuid.v4().replace('-', ''),
    word: _.sample(words),
    wrongGuesses: [],
    correctGuesses: [],
    state: '',
  };

  // initialise game state to all underscores
  for (let i = 0; i < newGame.word.length; i += 1) {
    newGame.state += '_';
  }

  storage.games[newGame.id] = newGame;
  client.sendGameInit(newGame, ws);
}

function guess(gameId, letter, ws) {
  if (letter.length > 1) {
    // fail silently, the client disallows this
    return false;
  }

  const game = storage.games[gameId];
  if (!game) {
    return client.sendGameNotFound(ws);
  }

  const indices = hangman.checkMatches(letter, game);

  // if there are no matches of `letter` in `game.word`
  if (indices.length === 0) {
    if (game.wrongGuesses.indexOf(letter) === -1) {
      game.wrongGuesses.push(letter);
    }
    if (game.wrongGuesses.length >= 5) {
      client.sendGameOver(game, ws);
    } else {
      client.sendFail(game, ws);
    }
  } else {
    if (game.correctGuesses.indexOf(letter) === -1) {
      game.correctGuesses.push(letter);
    }

    _.each(indices, (i) => {
      game.state = game.state.substr(0, i) + letter + game.state.substr(i + 1, game.state.length);
    });

    if (game.word === game.state) {
      client.sendVictory(game, ws);
      delete storage.games[game.id];
    } else {
      client.sendSuccess(game, ws);
    }
  }
}
