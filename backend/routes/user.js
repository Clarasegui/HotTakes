// Importation du routeur Express
const express = require('express');
const router = express.Router();

// Importation du user controller 
const userCtrl = require('../controllers/user');

// Routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;