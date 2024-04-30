const express = require('express');
const { accounts, remove } = require('../controllers/account');

const router = express.Router();

// http://localhost:8080/api/account
router.get('/account', accounts);

// http://localhost:8080/api/remove/id
router.delete('/account/:id', remove);

module.exports = router;