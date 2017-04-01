# Hangman!
The 3D Hubs Code Challenge

## The game
Guess the word! Try one letter or number at a time, don't make more then 4 mistakes or it's GAME OVER!
* Supports more then one player at a time
* Serverside state. Clients keep the gameID in localStorage and can disconnect and come back later to the same game.
* Communication via websockets

### The code:
* NodeJS backend with Express framework
* ESLint linting
* jQuery + Bootstrap frontend

```
app.js            > Entry point for the server
storage.js        > Storage for games
  -> lib/
      -> hangman  > Pure functions regarding Hangman logic
  -> resources/
      -> words    > Words used in game
  -> services/
      -> client	  > Sending websocket messages to client
      -> ws       > Receiving websocket messages from client
      -> hangman  > Game logic
```

## Install

git clone this repo
```
git clone git@github.com:mekaron/hangman.git
```
NPM Install
```
npm i
```
Pick your favorite way to run:
```
nodemon app.js
pm2 start app.js
node app.js
```

If you want your linting to work run
* Windows:
```
npm install -g install-peerdeps
install-peerdeps --dev eslint-config-airbnb
```
* OSX/ Linux:
```
(
  export PKG=eslint-config-airbnb;
  npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@latest"
)
```
from https://www.npmjs.com/package/eslint-config-airbnb
