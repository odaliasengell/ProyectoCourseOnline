const express = require('express');
const app = express();
const path = require('path');

// Configura Express para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Configura el motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.render('pagina/home'); // Renderiza home.ejs
});

// Ruta para la página de login
app.get('/login', (req, res) => {
    res.render('pagina/login'); // Renderiza login.ejs
});

app.get('/register', (req, res) => {
    res.render('pagina/register'); // Renderiza register.ejs
});

app.get('/categories', (req, res) => {
    res.render('pagina/categories'); // Renderiza categories.ejs
});

app.get('/profile', (req, res) => {
    res.render('pagina/profile'); // Renderiza profile.ejs
});

app.get('/home', (req, res) => {
    res.render('pagina/home'); // Renderiza profile.ejs
});

app.get('/admin', (req, res) => {
    res.render('pagina/admin'); // Renderiza profile.ejs
});

// Inicia el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

