const express = require('express');
const path = require('path');
const fs = require('fs'); // Importa fs para manejar archivos
const app = express();
const gameRoutes = require('./routes/games');

// Configura el motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Asegúrate de que esto esté correcto

// Middleware para manejar datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Función para cargar juegos desde el archivo JSON
function loadGames() {
    const data = fs.readFileSync(path.join(__dirname, 'models', 'games.json'), 'utf-8');
    return JSON.parse(data);
}

// Ruta para la página principal que renderiza index.ejs
app.get('/', (req, res) => {
    const games = loadGames(); // Carga los juegos desde el archivo JSON
    res.render('games/index', { games }); // Renderiza index.ejs y pasa la variable games
});

// Usar las rutas de juegos
app.use('/games', gameRoutes);

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).send('Página no encontrada');
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
