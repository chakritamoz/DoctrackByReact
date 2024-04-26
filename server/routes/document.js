const express = require('express');
const { createDocument } = require('../controllers/document');
const { authToken, authVerify } = require('../middleware/auth');
const { privilege } = require('../middleware/privilege');

const router = express.Router();

// http://localhost:8080/api/document/create
router.post('/document/create', authToken, authVerify, privilege('document-management'), createDocument);

module.exports = router;