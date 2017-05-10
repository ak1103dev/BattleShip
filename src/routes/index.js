const { Router } = require('express');
const users = require('./users');
const ships = require('./ships');
const attack = require('./attack');

const router = Router();
router.get('/', (req, res) => {
  res.send({ message: 'Welcome to API' });
});
router.use('/users', users);
router.use('/ships', ships);
router.use('/attack', attack);

module.exports = router;
