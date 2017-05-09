const { Router } = require('express');

const router = Router();
router.get('/', (req, res) => {
  res.send({ message: 'Welcome to API' });
});

module.exports = router
