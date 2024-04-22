const express = require('express');
const { createDocument } = require('../controllers/document');
const { auth } = require('../middleware/auth');
const { privilege } = require('../middleware/privilege');

const router = express.Router();

// http://localhost:8080/api/document/create
router.post('/document/create', auth, privilege, createDocument);

module.exports = router;