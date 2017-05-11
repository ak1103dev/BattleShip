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

- ```POST /users```  -- add user
- ```POST /ships/:shipType``` -- place a ship
- ```DELETE /ships/:shipType``` -- remove a ship
- ```PUT /ships/:shipType``` -- move a ship (unneccessary)
- ```POST /attack/:position``` -- attack in a target square
- ```GET /attack``` -- get attack list (unneccessary)

