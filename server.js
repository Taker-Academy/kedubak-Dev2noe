require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 8080;

// database connection
require('./config/database.js');

// Routes
const authRoutes = require('./routes/todo'); // Assurez-vous que le chemin est correct.

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisez authRoutes pour toutes les demandes adressées à /auth
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
