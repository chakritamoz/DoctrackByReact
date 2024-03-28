const express = require('express');
const { 
  register, 
  signin, 
  forget, 
  reset,
  remove
} = require('../controllers/auth');

const route = express.Router();

// http://localhost:8080/register
route.post('/register', register);

// http://localhost:8080/signin
route.post('/signin', signin);

// http://localhost:8080/forget
route.post('/forget', forget);

// http://localhost:8080/reset
route.put('/reset', reset);

// http://localhost:8080/remove
route.delete('remove', remove)

module.exports = route;