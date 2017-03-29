const uuid = require('node-uuid');
const _ = require('lodash');

const storage = require('../storage');
const words = require('../resources/words');
const hangman = require('../lib/hangman');
const client = require('../services/client');

module.exports = {
  initGame,
  guess
};

function initGame (ws) {
  const newGame = {
    id: uuid.v4().replace('-', ''),
    word: _.sample(words),
    guesses: [],
    state: '',
  }

  // initialise game state to all underscores
  for (var i = 0; i < newGame.word.length; i++) {
    newGame.state += '_';
  }

  storage.games.push(newGame);
  client.sendGameInit(newGame, ws);
}

function guess (gameId, letter, ws) {
  // todo fix, does not pass reference anymore
  const game = _.filter(storage.games, (g) => g.id === gameId)[0];
  if (!game) {
    console.log('404 game not found');
    throw new Error('no game');
  }

  const indices = hangman.checkMatches(letter, game);

  // if there are no matches of `letter` in `game.word`
  if (indices.length === 0) {
    game.guesses.push(letter);
    // todo: 5 is a magic number
    if (game.guesses.length >= 5) {
      client.sendGameOver(game, ws);
    } else {
      client.sendFail(game, ws);
    }
  } else {
    _.each(indices, (i) => {
      game.state[i] = letter;
    })
    client.sendSuccess(game, ws)
  }
}
