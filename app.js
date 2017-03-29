var express = require('express');
const webSocketService = require('./services/ws');

var app = express()

app.use(express.static('public'))

app.listen(3000, function () {
  console.log('Hangman listening on port 3000!')
})

webSocketService();
