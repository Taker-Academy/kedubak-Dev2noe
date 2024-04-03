const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authenticateJWT');

router.get('/me', authenticateJWT, userController.getUserInfo);
router.put('/edit', authenticateJWT, userController.editUserInfo);
router.delete('/remove', authenticateJWT, userController.deleteUser);

module.exports = router;
