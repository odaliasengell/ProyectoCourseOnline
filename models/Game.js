const fs = require('fs').promises; // Usar la versión basada en promesas de fs
const path = require('path');

class Game {
    constructor(data) {
        if (!data.title || !data.description || !data.price || !data.release_date || !data.image) {
            throw new Error("Todos los campos son obligatorios.");
        }

        this.id = Game.generateId(); // Genera un ID único
        this.title = data.title;
        this.description = data.description;
        this.price = data.price;
        this.releaseDate = data.release_date;
        this.image = data.image;
    }

    // Método estático para generar un ID único
    static async generateId() {
        const games = await Game.all(); // Usar la versión asincrónica
        return games.length > 0 ? Math.max(...games.map(game => game.id)) + 1 : 1;
    }

    // Obtiene todos los juegos desde el archivo
    static async all() {
        const filePath = path.join(__dirname, 'games.json');
        try {
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data) || [];
        } catch (error) {
            console.error("Error al leer los juegos:", error);
            return [];
        }
    }

    // Encuentra un juego por ID
    static async findById(id) {
        const games = await Game.all();
        return games.find(game => game.id === Number(id));
    }

    // Guarda el juego en el archivo
    async save() {
        try {
            const games = await Game.all();
            games.push(this);
            await fs.writeFile(path.join(__dirname, 'games.json'), JSON.stringify(games, null, 2));
        } catch (error) {
            console.error("Error al guardar el juego:", error);
            throw new Error("No se pudo guardar el juego.");
        }
    }

    // Elimina un juego por ID
    static async deleteById(id) {
        try {
            let games = await Game.all();
            games = games.filter(game => game.id !== Number(id));
            await fs.writeFile(path.join(__dirname, 'games.json'), JSON.stringify(games, null, 2));
        } catch (error) {
            console.error("Error al eliminar el juego:", error);
            throw new Error("No se pudo eliminar el juego.");
        }
    }
}

module.exports = Game;
