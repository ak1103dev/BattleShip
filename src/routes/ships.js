const { Router } = require('express');
const Joi = require('joi');
const _ = require('lodash');
const { Ship, Config } = require('../models/');

const fleet = ['', 'submarine', 'destroyer', 'cruiser', 'battleship'];

const shipSchema = (shipType) => Joi.object().keys({
  userId: Joi.string().required(),
  shipType: Joi.string().valid('battleship', 'cruiser', 'destroyer', 'submarine').required(),
  positions: Joi.array().items(Joi.number().min(0).max(99)).length(fleet.indexOf(shipType))
}).and('userId', 'shipType', 'positions');

const placeShip = (board, positions) => {
  const newBoard = board;
  positions.map((position) => (board[position] = true));
  return newBoard;
};

const isLegal = (board, positions) => {
  let checkingArea = [];
  positions.map((p) => {
    if (p === 0) return (checkingArea = _.union(checkingArea, [0, 1, 10, 11]));
    if (p === 9) return (checkingArea = _.union(checkingArea, [8, 9, 18, 19]));
    if (p === 90) return (checkingArea = _.union(checkingArea, [90, 91, 80, 81]));
    if (p === 99) return (checkingArea = _.union(checkingArea, [98, 99, 88, 89]));
    if (p / 10 === 0) return (checkingArea =  _.union(checkingArea, [p - 1, p, p + 1, p + 9, p + 10, p + 11]));
    if (p / 10 === 9) return (checkingArea = _.union(checkingArea, [p - 1, p, p + 1, p - 11, p - 10, p - 9]));
    if (p % 10 === 0) return (checkingArea = _.union(checkingArea, [p - 10, p, p + 10, p - 9, p + 1, p + 11]));
    if (p % 10 === 9) return (checkingArea = _.union(checkingArea, [p - 10, p, p + 10, p - 11, p - 1, p + 9]));
    return (checkingArea = _.union(checkingArea, [
      p - 11, p - 10, p - 9,
      p - 1, p, p + 1,
      p + 9, p + 10, p + 11
    ]));
  });
  console.log(checkingArea);
  let legal = false;
  checkingArea.map((p) => (legal = legal || board[p]));
  return !legal;
};

const router = Router();
router.post('/:shipType', (req, res) => {
  const { shipType } = req.params;
  const { userId, positions } = req.body;
  Joi.validate({ userId, positions, shipType }, shipSchema(shipType), (err, value) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err.details.map((detail) => detail.message)
      });
    } else {
      const lifePoint = fleet.indexOf(shipType);
      Config.findOne({})
      .then(({ gameNumber, board }) => {
        if (!isLegal(board, positions)) {
          throw new Error(`Can not place ${shipType} because of illegal placement`);
        }
        Promise.all([
          new Ship({ userId, shipType, positions, gameNumber, lifePoint }).save(),
          Config.update({ gameNumber }, { gameNumber, board: placeShip(board, positions) })
        ]);
        return gameNumber;
      })
      .then((gameNumber) =>
        Promise.all([
          Ship.count({ gameNumber, shipType: 'battleship' }),
          Ship.count({ gameNumber, shipType: 'cruiser' }),
          Ship.count({ gameNumber, shipType: 'destroyer' }),
          Ship.count({ gameNumber, shipType: 'submarine' })
        ])
      )
      .then(([battleshipNum, cruiserNum, destroyerNum, submarineNum]) =>
        res.send({
          success: true,
          message: `placed ${shipType}`,
          remaining: {
            battleship: 1 - battleshipNum,
            cruiser: 2 - cruiserNum,
            destroyer: 3 - destroyerNum,
            submarine: 4 - submarineNum
          }
        })
      )
      .catch((e) => res.status(500).send(e));
    }
  });
});

module.exports = router;
