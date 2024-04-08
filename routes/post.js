const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authenticateJWT');
const postControllers = require('../controllers/postControllers.js');

router.get('/', authenticateJWT, postControllers.getPosts);
router.post('/', authenticateJWT, postControllers.createPost);
router.get('/me', authenticateJWT, postControllers.getUserPosts);
router.get('/:id', authenticateJWT, postControllers.getPostById);
router.delete('/:id', authenticateJWT, postControllers.deletePost);
router.post('/vote/:id', authenticateJWT, postControllers.votePost);

module.exports = router;
