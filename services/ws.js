const WebSocket = require('ws');

const hangmanService = require('../services/hangman');

module.exports = () => {
  const wss = new WebSocket.Server({
    perMessageDeflate: false,
    port: 8080
  });

  wss.on('connection', function connection(ws) {
    console.log('CONNECTION');
    ws.on('message', function incoming(message) {
      console.log(message);
      let wsMessage = false;
      try {
        wsMessage = JSON.parse(message);
      } catch (e) {
        // log and fail.
        console.log(e);
        console.log('Message parsing failed: ' + message);
      }
      if (!wsMessage) {
        return ws.send('json fail');
      }
      switch (wsMessage.type) {
        case 'INIT':
          hangmanService.initGame(ws);
          break;
        case 'GUESS':
          hangmanService.guess(wsMessage.id, wsMessage.letter, ws);
          break;
        default:
          ws.send(JSON.stringify({
            message: 'whut',
          }));
          break;
      }
    });
    // ws.send('peek-a-boo');
  });
}
