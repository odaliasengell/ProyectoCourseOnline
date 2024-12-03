// middlewares/multer.js
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images')); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Nombre del archivo tal como se sube
    }
});

// Crear el middleware de Multer
const upload = multer({ storage: storage });

module.exports = upload;
