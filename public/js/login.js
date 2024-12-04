import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js';

// firebase-config.js
export const firebaseConfig = {
    apiKey: "AIzaSyCvb6UM907Yd1LTYyLzNqC4CzHg7N5ZeVQ",
    authDomain: "online-course-597fd.firebaseapp.com",
    projectId: "online-course-597fd",
    storageBucket: "online-course-597fd.appspot.com",
    messagingSenderId: "563059267790",
    appId: "1:563059267790:web:eef80e3dff0bbb8b6fd89f",
    measurementId: "G-DJMX9HK2VD"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    // Obtener los elementos del DOM
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('correo');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.login');
    const messageContainer = document.getElementById('message-container'); // Contenedor del mensaje

    // Función para mostrar el mensaje
    function showMessage(message, isSuccess = true) {
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        messageContainer.style.color = isSuccess ? 'green' : 'red';
    }

    // Manejar el evento de inicio de sesión
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // Intentar iniciar sesión con el correo y la contraseña proporcionados
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Si el inicio de sesión es exitoso, redirige a la página de categorías
            showMessage("Inicio de sesión exitoso. Redirigiendo...", true);
            setTimeout(() => {
                window.location.href = '/home';  // Cambia la ruta si es necesario
            }, 2000); // Esperar 2 segundos antes de redirigir

        } catch (error) {
            console.error("Error al iniciar sesión: ", error);
            showMessage("Error al iniciar sesión. Verifica tus credenciales.", false);
        }
    });

    // Si el botón de "Registrarse" se hace clic, redirigir a la página de registro
    const signupButton = document.getElementById('signup-btn');
    signupButton.addEventListener('click', () => {
        window.location.href = '/register';  // Redirige a la página de registro
    });
});
