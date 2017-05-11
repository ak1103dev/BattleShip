const { Router } = require('express');
const Joi = require('joi');
const _ = require('lodash');
const { Ship, Config } = require('../models/');

const fleet = ['submarine', 'destroyer', 'cruiser', 'battleship'];

const shipSchema = (shipType) => Joi.object().keys({
  userId: Joi.string().required(),
  shipType: Joi.string().valid('battleship', 'cruiser', 'destroyer', 'submarine').required(),
  positions: Joi.array().items(Joi.number().min(0).max(99)).length(fleet.indexOf(shipType) + 1),
  position: Joi.number().min(0).max(99)
}).and('userId', 'shipType');

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
    if (p / 10 === 0) return (checkingArea = _.union(checkingArea, [p - 1, p, p + 1, p + 9, p + 10, p + 11]));
    if (p / 10 === 9) return (checkingArea = _.union(checkingArea, [p - 1, p, p + 1, p - 11, p - 10, p - 9]));
    if (p % 10 === 0) return (checkingArea = _.union(checkingArea, [p - 10, p, p + 10, p - 9, p + 1, p + 11]));
    if (p % 10 === 9) return (checkingArea = _.union(checkingArea, [p - 10, p, p + 10, p - 11, p - 1, p + 9]));
    return (checkingArea = _.union(checkingArea, [
      p - 11, p - 10, p - 9,
      p - 1, p, p + 1,
      p + 9, p + 10, p + 11
    ]));
  });
  // console.log(checkingArea);
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
      const lifePoint = fleet.indexOf(shipType) + 1;
      Config.findOne({})
      .then(({ gameNumber, board }) => {
        return Promise.all(fleet.map((shipType) => Ship.count({ gameNumber, shipType })))
        .then((nums) => {
          const currentNum = nums[fleet.indexOf(shipType)];
          const total = _.reverse(_.cloneDeep(fleet)).indexOf(shipType) + 1;
          // console.log(currentNum, total);
          if (currentNum === total) {
            throw new Error(`Can not place ${shipType} because of fulling`);
          }
          if (!isLegal(board, positions)) {
            throw new Error(`Can not place ${shipType} because of illegal placement`);
          }
          const newNums = nums.map((num, i) => fleet.indexOf(shipType) === i ? num + 1 : num);
          return Promise.all([
            new Ship({ userId, shipType, positions, gameNumber, lifePoint }).save(),
            Config.update({ gameNumber }, { gameNumber, board: placeShip(board, positions) })
          ])
          .then(() =>
            res.send({
              success: true,
              message: `placed ${shipType}`,
              remaining: {
                battleship: 1 - newNums[3],
                cruiser: 2 - newNums[2],
                destroyer: 3 - newNums[1],
                submarine: 4 - newNums[0]
              }
            })
          );
        });
      })
      .catch((e) => {
        res.status(500).send({ success: false, message: e.message });
      });
    }
  });
});

router.delete('/:shipType', (req, res) => {
  const { userId, position } = req.body;
  const { shipType } = req.params;
  Joi.validate({ userId, position, shipType }, shipSchema(shipType), (err, value) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: 'No ship in the position'
      });
    } else {
      Config.findOne({})
      .then(({ gameNumber }) => Ship.findOneAndRemove({ gameNumber, positions: position }))
      .then((data) =>
        data
        ? res.send({ success: true })
        : res.status(500).send({ success: false, message: 'No ship in the position' })
      )
      .catch((e) => res.status(500).send({ message: e.message }));
    }
  });
});

module.exports = router;
