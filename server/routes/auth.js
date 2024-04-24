const express = require('express');
const { 
  register, 
  signin, 
  forget, 
  reset,
  remove,
  newOTP,
  verifyOTP,
  verifyAdmin
} = require('../controllers/auth');
const { authToken, authVerify } = require('../middleware/auth');
const { privilege } = require('../middleware/privilege');

const router = express.Router();

// http://localhost:8080/api/register
router.post('/register', register);

// http://localhost:8080/api/signin
router.post('/signin', signin);

// http://localhost:8080/api/verifyOTP
router.post('/verifyOTP', authToken, verifyOTP)

// http://localhost:8080/api/newOTP
router.post('/newOTP', authToken, newOTP)

// http://localhost:8080/api/verifyAdmin
router.post('/verifyAdmin', authToken, privilege(''), verifyAdmin)

// http://localhost:8080/api/forget
router.post('/forget', forget);

// http://localhost:8080/api/reset
router.put('/reset', reset);

// http://localhost:8080/api/remove
router.delete('/remove', remove)

module.exports = router;