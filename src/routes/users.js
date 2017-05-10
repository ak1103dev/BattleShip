const { Router } = require('express');
const Joi = require('joi');
const _ = require('lodash');
const { User, Config } = require('../models/');

const userSchema = Joi.object().keys({
  username: Joi.string().required(),
  userType: Joi.string().valid('defender', 'attacker').required(),
  gameNumber: Joi.number().required()
}).and('username', 'userType', 'gameNumber');

const router = Router();
router.post('/', (req, res) => {
  Joi.validate(req.body, userSchema, (err, value) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err.details.map((detail) => detail.message)
      });
    } else {
      const { username, userType, gameNumber } = req.body;
      new User(req.body).save()
      .then((newUser) => {
        User.find({ gameNumber })
        .then((users) => {
          if (users.length === 2) {
            const board = _.times(100, _.constant(false));
            return Config.update({}, { gameNumber, board }, { upsert: true });
          }
          return false;
        })
        .then(() =>
          res.send({
            success: true,
            message: `In game ${gameNumber}: ${username} is ${userType}.`,
            userId: newUser._id
          })
        );
      })
      .catch((e) => res.status(500).send(e));
    }
  });
});

module.exports = router;
