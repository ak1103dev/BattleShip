const { Router } = require('express');
const Joi = require('joi');
const { Ship, Config, Attack } = require('../models/');

const attackSchema = Joi.object().keys({
  userId: Joi.string().required(),
  position: Joi.number().min(0).max(99)
});

const router = Router();
router.post('/:position', (req, res) => {
  const { userId } = req.body;
  const { position } = req.params;
  Joi.validate({ userId, position }, attackSchema, (err, value) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err.details.map((detail) => detail.message)
      });
    } else {
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
                return Config.update({ gameNumber }, { $set: { gameNumber: gameNumber + 1 } })
                .then(() => {
                  return { message: `Win ! You completed the game in ${attackNum + 1} moves`, gameNumber };
                });
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
    }
  });
});

module.exports = router;
