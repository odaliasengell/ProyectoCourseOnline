import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js';
import { getAuth, onAuthStateChanged, updatePassword, signOut } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCvb6UM907Yd1LTYyLzNqC4CzHg7N5ZeVQ",
  authDomain: "online-course-597fd.firebaseapp.com",
  projectId: "online-course-597fd",
  storageBucket: "online-course-597fd.firebasestorage.app",
  messagingSenderId: "563059267790",
  appId: "1:563059267790:web:eef80e3dff0bbb8b6fd89f",
  measurementId: "G-DJMX9HK2VD"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Función para cargar los datos del usuario
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log('Usuario autenticado:', user.email);

    // Obtener los datos del usuario desde Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      // Llenar los campos del formulario con la información de Firestore
      document.getElementById("profile-pic").src = userData.profilePic || "../Imagenes/fotoperfil.png";
      document.getElementById("username").textContent = userData.firstName + " " + userData.lastName;
      document.getElementById("userhandle").textContent = "@" + userData.username;
      document.getElementById("first-name").value = userData.firstName;
      document.getElementById("last-name").value = userData.lastName;
      document.getElementById("username-input").value = userData.username;
      document.getElementById("email").value = userData.email;
    } else {
      console.log("No se encontraron datos del usuario");
    }
  } else {
    // Si no hay usuario autenticado, redirigir al login solo si no es la página de home
    if (!window.location.pathname.includes('home')) {
      window.location.href = "/login";
    }
  }
});

// Función para guardar cambios del perfil
document.querySelector(".edit-profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const username = document.getElementById("username-input").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = auth.currentUser;

  if (user) {
    // Actualizar los datos del usuario en Firestore
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      firstName,
      lastName,
      username,
      email,
      profilePic: document.getElementById("profile-pic").src
    }, { merge: true });

    if (password) {
      try {
        await updatePassword(user, password);
        console.log("Contraseña actualizada correctamente");
      } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
      }
    }

    console.log("Datos del usuario actualizados");
  } else {
    console.log("No hay usuario autenticado");
  }
});

// Función para cerrar sesión
document.getElementById("logout-btn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("Sesión cerrada correctamente");
    // Redirigir a la página de home tras cerrar sesión
    window.location.href = "/home";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
});

// Función para mostrar/ocultar la contraseña
document.getElementById("show-password").addEventListener("click", () => {
  const passwordField = document.getElementById("password");
  const type = passwordField.type === "password" ? "text" : "password";
  passwordField.type = type;
});
