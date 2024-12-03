// public/js/scripts.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('¡Bienvenido a JuegosYa!');

    const createGameForm = document.querySelector('form');
    if (createGameForm) {
        createGameForm.addEventListener('submit', (event) => {
            const titleInput = document.querySelector('input[name="title"]');
            if (titleInput.value.trim() === '') {
                alert('El título del juego es requerido.');
                event.preventDefault();
            }
        });
    }
});
