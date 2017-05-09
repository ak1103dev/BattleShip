const { Router } = require('express');
const users = require('./users');

const router = Router();
router.get('/', (req, res) => {
  res.send({ message: 'Welcome to API' });
});
router.use('/users', users);

module.exports = router;
