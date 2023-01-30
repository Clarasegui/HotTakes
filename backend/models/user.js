const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Modèle de création d'un nouvel utilisateur dans Sign-up
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Utilisation du plugin uniqueValidaor pour créé des utilisateurs uniques
userSchema.plugin(uniqueValidator);

// Exportation du module
module.exports = mongoose.model('User', userSchema);