// routes/games.js
const express = require('express');
const router = express.Router();
const GameController = require('../controllers/GameController');

// Rutas de juegos
router.get('/', GameController.index); // Muestra la lista de juegos
router.get('/create', GameController.create); // Muestra el formulario para crear un juego
router.post('/', GameController.upload, GameController.store); // Guarda un nuevo juego
router.get('/:id', GameController.show); // Muestra detalles de un juego específico

// Nueva ruta para buscar juegos
router.get('/search', GameController.search); // Muestra los resultados de búsqueda

module.exports = router;
