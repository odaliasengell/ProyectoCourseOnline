import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js';

// Configuración de Firebase
const firebaseConfig = {
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
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('correo');
    const passwordInput = document.getElementById('password');
    const messageContainer = document.getElementById('message-container');

    function showMessage(message, isSuccess = true) {
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        messageContainer.style.color = isSuccess ? 'green' : 'red';
    }

    function clearInputs() {
        emailInput.value = '';
        passwordInput.value = '';
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // Intentar iniciar sesión
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Verifica si es el usuario administrador
            if (user.email === 'admin@gmail.com') {
                showMessage("Inicio de sesión exitoso como administrador. Redirigiendo...", true);
                clearInputs();
                setTimeout(() => {
                    window.location.href = '/admin';  // Redirige a admin después de 2 segundos
                }, 2000);
            } else {
                showMessage("Inicio de sesión exitoso. Redirigiendo...", true);
                clearInputs();
                setTimeout(() => {
                    window.location.href = '/home';  // Redirige a home después de 2 segundos
                }, 2000);
            }

        } catch (error) {
            console.error("Error al iniciar sesión: ", error);
            showMessage("Error al iniciar sesión. Verifica tus credenciales.", false);
            clearInputs();
        }
    });

    // Botón de "Registrarse"
    const signupButton = document.getElementById('signup-btn');
    signupButton.addEventListener('click', () => {
        window.location.href = '/register';  // Redirige a la página de registro
    });
});
