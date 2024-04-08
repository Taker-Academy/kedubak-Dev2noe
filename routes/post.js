const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authenticateJWT');
const postControllers = require('../controllers/postControllers.js');

// Route pour récupérer tous les posts
router.get('/', authenticateJWT, postControllers.getPosts);
router.post('/', authenticateJWT, postControllers.createPost);
//router.post('/me', authenticateJWT, postControllers.createPost);

module.exports = router;
