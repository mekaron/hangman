const express = require('express');
const webSocketService = require('./services/ws');

const app = express();

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Hangman listening on port 3000!');
});

webSocketService();
