# BattleShip

## How to use

### Require

- Node.js version 6.3.1
- MongoDB (require 2 databases, one is game database and other is database for testing)

### Prepare
```
$ git clone https://github.com/ak1103dev/BattleShip
$ npm install
```
Please edit database host in ```config/default.json``` and ```config/test.json```

### How to run
```
$ npm start
```
### How to run test
```
$ npm test
```
### How to play the game from beginning to end
```
$ npm run play
```

## List of APIs

- POST /users
- POST /ships/:shipType
- POST /attack/:position
