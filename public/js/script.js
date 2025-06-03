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

// Función para mostrar un mensaje de bienvenida al usuario
function showWelcomeMessage() { 
    const user = auth.currentUser;
    if (user) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.textContent = `¡Bienvenido, ${user.email}!`;
        welcomeMessage.style.position = 'fixed';
        welcomeMessage.style.top = '10px';
        welcomeMessage.style.right = '10px';
        welcomeMessage.style.backgroundColor = '#4CAF50';
        welcomeMessage.style.color = 'white';
        welcomeMessage.style.padding = '10px';
        welcomeMessage.style.borderRadius = '5px';
        document.body.appendChild(welcomeMessage);

        setTimeout(() => {
            welcomeMessage.remove();
        }, 3000);
    }
}