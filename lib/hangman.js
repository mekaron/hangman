module.exports = {
  checkMatches,
}

function checkMatches(letter, game) {
  const word = game.word;
  const indices = [];
  for(let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      indices.push(i);
    }
  }
  return indices;
}
