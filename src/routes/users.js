const { Router } = require('express');
const Joi = require('joi');
const { User } = require('../models/');

const userSchema = Joi.object().keys({
  username: Joi.string().required(),
  userType: Joi.string().valid('defender', 'attacker').required()
}).with('username', 'userType');

const router = Router();
router.post('/', (req, res) => {
  Joi.validate(req.body, userSchema, (err, value) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: err.details.map((detail) => detail.message)
      });
    } else {
      const { username, userType } = req.body;
      new User(req.body).save()
      .then((user) => {
        res.send({
          success: true,
          message: `${username} is ${userType}.`,
          userId: user._id
        });
      });
    }
  });
});

module.exports = router;
