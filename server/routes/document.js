const express = require('express');

// function document
const { 
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  removeDocument
} = require('../controllers/document');

// middleware
const { authToken, authVerify } = require('../middleware/auth');
const { privilege } = require('../middleware/privilege');

const router = express.Router();

// http://localhost:8080/api/document
router.get('/document', authToken, authVerify, privilege('document-management'), getDocuments);

// http://localhost:8080/api/document/id
router.get('/document/:id', authToken, authVerify, privilege('document-management'), getDocument);

// http://localhost:8080/api/document
router.post('/document', authToken, authVerify, privilege('document-management'), createDocument);

// http://localhost:8080/api/document/id
router.put('/document/:id', authToken, authVerify, privilege('document-management'), updateDocument);

// http://localhost:8080/api/document/id
router.delete('/document/:id', authToken, authVerify, privilege('document-management'), removeDocument)

module.exports = router;