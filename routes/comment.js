const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authenticateJWT');
const postControllers = require('../controllers/postControllers.js');

router.post('/:id', authenticateJWT, postControllers.commentPost);

module.exports = router;