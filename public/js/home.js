// Importamos los módulos necesarios de Firebase
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js';

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

// Función para verificar si el usuario está autenticado
onAuthStateChanged(auth, (user) => {
    if (user) {
        // El usuario está autenticado, no hacemos nada o mostramos su nombre
        console.log('Usuario autenticado:', user.email);
    } else {
        // El usuario no está autenticado, redirigir a la página de login
        console.log('No hay usuario autenticado');
        if (window.location.pathname !== '/home') {
            window.location.href = '/home'; // Redirige al login si no está autenticado
        }
    }
});

// Agregar listeners a los enlaces de "Cursos" y "Perfil"
document.addEventListener('DOMContentLoaded', () => {
    const coursesLink = document.querySelector('a[href="/categories"]');
    const profileLink = document.querySelector('a[href="/profile"]');

    // Validar si el usuario está autenticado al hacer clic en los enlaces
    coursesLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado (la navegación)
        checkAuthenticationAndRedirect('/categories'); // Verifica antes de redirigir
    });

    profileLink.addEventListener('click', (event) => {
        event.preventDefault();
        checkAuthenticationAndRedirect('/profile');
    });
});

// Función para verificar si el usuario está autenticado antes de redirigir
function checkAuthenticationAndRedirect(redirectTo) {
    const user = auth.currentUser;
    if (user) {
        window.location.href = redirectTo; // Redirige si el usuario está autenticado
    } else {
        window.location.href = '/login'; // Redirige al login si el usuario no está autenticado
    }
}

console.log("hola Ing Israel")
