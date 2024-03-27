const express = require('express');
const router = express.Router();

// Importer le contrôleur d'authentification
const authController = require('../controllers/todoControllers.js');

// Route pour l'inscription
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
