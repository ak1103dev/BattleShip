const { Router } = require('express');
const { User } = require('../models/');

const router = Router();
router.post('/', (req, res) => {
  const { username, userType } = req.body;
  new User(req.body).save();
  res.send({
    success: true,
    message: `${userType} is ${username}`
  });
})

module.exports = router;
