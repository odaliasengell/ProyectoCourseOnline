const Game = require('../models/Game');
const multer = require('multer');
const path = require('path');

// Configura multer para la subida de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Agrega un timestamp al nombre del archivo
    }
});
const upload = multer({ storage });

// Mostrar lista de juegos
exports.index = (req, res) => {
    const games = Game.all(); // Obtiene todos los juegos

    // Manejar la búsqueda
    const searchQuery = req.query.query ? req.query.query.toLowerCase() : '';

    // Filtrar juegos según la búsqueda
    let filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(searchQuery)
    );

    console.log(filteredGames); // Muestra los juegos filtrados
    res.render('games/index', { games: filteredGames }); // Renderiza la vista con juegos filtrados
};

// Mostrar detalles de un juego
exports.show = (req, res) => {
    const game = Game.findById(req.params.id);
    if (game) {
        res.render('games/show', { game });
    } else {
        res.status(404).send('Juego no encontrado');
    }
};

// Crear juego
exports.create = (req, res) => {
    res.render('games/create');
};

// Guardar juego
exports.store = (req, res) => {
    const newGame = new Game({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        release_date: req.body.release_date,
        image: '/images/' + req.file.filename // Guarda la URL de la imagen
    });
    newGame.save();
    res.redirect('/games');
};

// Método de búsqueda
exports.search = (req, res) => {
    const games = Game.all(); // Obtiene todos los juegos
    const query = req.query.query ? req.query.query.toLowerCase() : '';

    // Filtra juegos por el título
    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(query)
    );

    res.render('games/index', { games: filteredGames }); // Muestra los juegos filtrados
};

// Exporta el middleware para usarlo en las rutas
exports.upload = upload.single('image');
