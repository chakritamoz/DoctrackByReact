const express = require('express');
const { createDocument } = require('../controllers/document');
const { auth } = require('../middleware/auth');

const router = express.Router();

// http://localhost:8080/api/document/create
router.post('/document/create', auth, createDocument);

module.exports = router;