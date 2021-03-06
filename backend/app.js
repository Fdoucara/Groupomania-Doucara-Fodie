const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./config/db');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const path = require('path');
require('dotenv').config({ path: './config/.env' });

const app = express();

// Lire le body en json
app.use(express.json());

// Lire les cookies
app.use(cookieParser());

// Ajout des Cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exportation de l'appli
module.exports = app;