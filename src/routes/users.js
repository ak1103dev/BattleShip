const { Router } = require('express');
const { User } = require('../models/');

const router = Router();
router.post('/', (req, res) => {
  const { username, userType } = req.body;
  new User(req.body).save();
  res.send({
    success: true,
    message: `${username} is ${userType}.`
  });
})

module.exports = router;
