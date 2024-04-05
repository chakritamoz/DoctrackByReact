const express = require('express');
const { 
  register, 
  signin, 
  forget, 
  reset,
  remove
} = require('../controllers/auth');

const router = express.Router();

// http://localhost:8080/api/register
router.post('/register', register);

// http://localhost:8080/api/signin
router.post('/signin', signin);

// http://localhost:8080/api/forget
router.post('/forget', forget);

// http://localhost:8080/api/reset
router.put('/reset', reset);

// http://localhost:8080/api/remove
router.delete('remove', remove)

module.exports = router;