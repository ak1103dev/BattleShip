const { Router } = require('express');
// const Joi = require('joi');
const { Ship, Config } = require('../models/');
const _ = require('lodash');

// const userSchema = Joi.object().keys({
//   username: Joi.string().required(),
//   userType: Joi.string().valid('defender', 'attacker').required()
// }).and('username', 'userType');

const board = _.chunk(_.times(100, _.constant(false)), 10);

const router = Router();
router.post('/:shipType', (req, res) => {
  const { shipType } = req.params;
  const { userId, position } = req.body;
  Config.findOne({}).select('gameNumber')
  .then(({ gameNumber }) =>
    new Ship({
      userId,
      shipType,
      position,
      gameNumber
    }).save()
  )
  .then(() =>
    res.send({ success: true, message: `placed ${shipType}` })
  );
});

module.exports = router;
