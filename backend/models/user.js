// Importation du module Mongoose
const mongoose = require('mongoose');

// Importation du module uniqueValidator
const uniqueValidator = require('mongoose-unique-validator');

// Importation du module MongooseErrors
const MongooseErrors = require('mongoose-errors');

// Modèle de création d'un nouvel utilisateur dans Sign-up
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Utilisation du plugin uniqueValidator pour créé des utilisateurs uniques
userSchema.plugin(uniqueValidator);

// Utilisation du plugin MongooseErrors pour assurer les remontées des erreurs 
userSchema.plugin(MongooseErrors);

// Exportation du module
module.exports = mongoose.model('User', userSchema);