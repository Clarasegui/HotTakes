// Ajout du module Express
const express = require('express');

// Ajout du module Router
const router = express.Router();

// Importation du controller Sauces
const saucesCtrl = require('../controllers/sauces');

// Importation du middleware d'authentification
const auth = require('../middleware/auth');

// Importation du middleware multer
const multer = require('../middleware/multer-config');

// Importation de la route
router.get('/', auth, saucesCtrl.getAllSauces);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

// Exportation du module Router
module.exports = router;