const express = require('express');
const { accounts, remove } = require('../controllers/account');
const { authToken, authVerify } = require('../middleware/auth');
const { privilege } = require('../middleware/privilege');

const router = express.Router();

// http://localhost:8080/api/account
router.get('/account', authToken, authVerify, privilege('account-management'), accounts);

// http://localhost:8080/api/account/id
router.delete('/account/:id', authToken, authVerify, privilege('account-management'), remove);

module.exports = router;