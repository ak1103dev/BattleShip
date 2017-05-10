const { Router } = require('express');
// const Joi = require('joi');
// const _ = require('lodash');
const { Ship, Config, Attack } = require('../models/');

// const userSchema = Joi.object().keys({
//   username: Joi.string().required(),
//   userType: Joi.string().valid('defender', 'attacker').required(),
//   gameNumber: Joi.number().required()
// }).and('username', 'userType', 'gameNumber');

const router = Router();
router.post('/:position', (req, res) => {
  const { userId } = req.body;
  const { position } = req.params;
  Config.findOne({})
  .then(({ board, gameNumber }) => {
    if (board[position]) {
      const newBoard = board;
      newBoard[position] = false;
      return Config.update({ gameNumber }, { gameNumber, board: newBoard })
      .then(() => Ship.findOne({ positions: position, gameNumber }))
      .then((ship) => {
        ship.lifePoint = ship.lifePoint - 1;
        return Ship.update({ positions: position, gameNumber }, ship)
        .then(() =>
          Promise.all([
            Ship.count({ gameNumber, lifePoint: 0 }),
            Attack.count({ gameNumber })
          ])
        )
        .then(([deadNum, attackNum]) => {
          if (deadNum === 10) {
            return { message: `Win ! You completed the game in ${attackNum + 1} moves`, gameNumber };
          }
          if (ship.lifePoint > 0) {
            return { message: 'Hit', gameNumber };
          }
          return { message: `You just sank the ${ship.shipType}`, gameNumber };
        });
      });
    }
    return { message: 'Miss', gameNumber };
  })
  .then(({ message, gameNumber }) => {
    new Attack({
      userId,
      position,
      gameNumber,
      status: message
    }).save();
    return message;
  })
  .then((message) => res.send({ message }));
});

module.exports = router;
