// Importation du module Express
const express = require('express');

// Création de l'application Express
const app = express();

// Importation du module body-parser
const bodyParser = require('body-parser');

// Importation de Mongoose
const mongoose = require('mongoose');

// Importation du modèle Thing
const Sauce = require('./models/sauces');

// Importation du modèle path
const path = require('path');

// Connection à la base de données Mongoose
mongoose.connect('mongodb+srv://hot-takes-backend:7GUtRpIeDCfCG28G@clara-segui-hot-takes.5u3vrwd.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

app.use(bodyParser.json());

// Configuration CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation du module 
module.exports = app;