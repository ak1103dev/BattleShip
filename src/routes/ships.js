const { Router } = require('express');
const Joi = require('joi');
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
      );
    }
  });
});

module.exports = router;
