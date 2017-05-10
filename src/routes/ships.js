const { Router } = require('express');
const Joi = require('joi');
const { Ship, Config } = require('../models/');

const shipSchema = Joi.object().keys({
  userId: Joi.string().required(),
  shipType: Joi.string().valid('battleship', 'cruiser', 'destroyer', 'submarine').required(),
  positions: Joi.array().items(Joi.number().min(0).max(99))
}).and('userId', 'shipType', 'positions');

const placeShip = (board, positions) => {
  const newBoard = board;
  positions.map((position) => (board[position] = true));
  return newBoard;
};
const fleet = ['', 'submarine', 'destroyer', 'cruiser', 'battleship'];

const router = Router();
router.post('/:shipType', (req, res) => {
  const { shipType } = req.params;
  const { userId, positions } = req.body;
  Joi.validate({ userId, positions, shipType }, shipSchema, (err, value) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err.details.map((detail) => detail.message)
      });
    } else {
      const lifePoint = fleet.indexOf(shipType);
      Config.findOne({})
      .then(({ gameNumber, board }) =>
        Promise.all([
          new Ship({ userId, shipType, positions, gameNumber, lifePoint }).save(),
          Config.update({ gameNumber }, { gameNumber, board: placeShip(board, positions) })
        ])
      )
      .then(() =>
        res.send({ success: true, message: `placed ${shipType}` })
      );
    }
  });
});

module.exports = router;
