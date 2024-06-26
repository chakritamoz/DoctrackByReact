const express = require('express');
const { 
  register, 
  signin, 
  forget, 
  reset,
  newOTP,
  verifyOTP,
  verifyAdmin,
  signout
} = require('../controllers/auth');
const { authToken, authVerify } = require('../middleware/auth');
const { privilege } = require('../middleware/privilege');

const router = express.Router();

// http://localhost:8080/api/register
router.post('/register', register);

// http://localhost:8080/api/signin
router.post('/signin', signin);

// http://localhost:8080/api/signout
router.post('/signout', signout);

// http://localhost:8080/api/verifyOTP
router.put('/verifyOTP', verifyOTP)

// http://localhost:8080/api/newOTP
router.put('/newOTP', newOTP)

// http://localhost:8080/api/verifyAdmin/id
router.put('/verifyAdmin/:id', authToken, authVerify, privilege('account-management'), verifyAdmin)

// http://localhost:8080/api/forget
router.post('/forget', forget);

// http://localhost:8080/api/reset
router.put('/reset', reset);

module.exports = router;