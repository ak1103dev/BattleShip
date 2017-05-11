const { Router } = require('express');
const Joi = require('joi');
const _ = require('lodash');
const isLegal = require('../utils/isLegal');
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
