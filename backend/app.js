// Importation du module Express
const express = require('express');

// Création de l'application Express
const app = express();

// Importation du module body-parser
const bodyParser = require('body-parser');

// Importation de Mongoose
const mongoose = require('mongoose');

// Importation de dotenv
const dotenv = require("dotenv");
dotenv.config();

// Importation du modèle path
const path = require('path');

// Connection à la base de données Mongoose
mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_CONNECT}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParser.json());

// Configuration CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation du module 
module.exports = app;