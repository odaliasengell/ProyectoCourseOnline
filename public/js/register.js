import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js';
import { getFirestore, setDoc, doc } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js';

// Configuración de tu app de Firebase
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
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.querySelector('.register-btn');
    
    // Obtener referencias a los campos del formulario
    const fullNameInput = document.getElementById('full-name');
    const usernameInput = document.getElementById('username-register');
    const passwordInput = document.getElementById('password-register');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const emailInput = document.getElementById('email');

    // Obtener referencia al div de mensaje
    const messageDiv = document.getElementById('message');

    // Agregar el evento de clic al botón de registro
    registerButton.addEventListener('click', async (event) => {
        event.preventDefault(); // Evita que el formulario se envíe por defecto

        // Obtener los valores de los campos del formulario
        const fullName = fullNameInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const email = emailInput.value.trim();

        // 2. Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            messageDiv.textContent = 'Las contraseñas no coinciden';
            messageDiv.style.color = 'red';
            return;
        }

        // 3. Validar el formato del correo electrónico
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
            messageDiv.textContent = 'Por favor ingrese un correo electrónico válido';
            messageDiv.style.color = 'red';
            return;
        }

        // 4. Validar la longitud de la contraseña
        if (password.length < 6) {
            messageDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            // Crear usuario con Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar información adicional en Firestore
            await setDoc(doc(db, 'users', user.uid), {
                fullName: fullName,
                username: username,
                email: email,
            });

            // Mostrar mensaje de éxito
            messageDiv.textContent = 'Usuario registrado exitosamente';
            messageDiv.style.color = 'green'; // Color verde para el éxito
            
            // Redirigir al usuario a la página de login después de registrarse
            setTimeout(() => {
                window.location.href = '/login'; // Redirige a la página de login
            }, 2000); // Espera 2 segundos antes de redirigir

        } catch (error) {
            // Manejo de errores
            console.error("Error al registrar usuario: ", error);
            messageDiv.textContent = "Error al registrar usuario. Intenta nuevamente.";
            messageDiv.style.color = 'red'; // Color rojo para el error
        }
    });
});
