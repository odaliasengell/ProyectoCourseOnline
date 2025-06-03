// Importar las funciones necesarias de Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js';
import { getAuth, onAuthStateChanged, updatePassword, signOut } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js';

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

// Función para mostrar el mensaje
function showMessage(message, isSuccess = true) {
  const messageContainer = document.getElementById("message-container");
  messageContainer.textContent = message;
  messageContainer.style.display = 'block';
  messageContainer.style.color = isSuccess ? 'green' : 'red';

  setTimeout(() => {
    messageContainer.style.display = 'none';
  }, 3000);
}

// Función para cargar los datos del usuario y los cursos suscritos
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log('Usuario autenticado:', user.email);

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      document.getElementById("profile-pic").src = userData.profilePic || "../Imagenes/fotoperfil.png";
      document.getElementById("username").textContent = userData.firstName + " " + userData.lastName;
      document.getElementById("userhandle").textContent = "@" + userData.username;
      document.getElementById("first-name").value = userData.firstName;
      document.getElementById("last-name").value = userData.lastName;
      document.getElementById("username-input").value = userData.username;
      document.getElementById("email").value = userData.email;

      const coursesListDiv = document.getElementById("courses-list");

      try {
        const subscriptionsQuery = query(collection(db, "subscriptions"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(subscriptionsQuery);

        if (querySnapshot.empty) {
          coursesListDiv.innerHTML = '<p>No estás suscrito a ningún curso.</p>';
        } else {
          coursesListDiv.innerHTML = "";

          for (const docSnapshot of querySnapshot.docs) {
            const subscriptionData = docSnapshot.data();
            const courseRef = doc(db, "courses", subscriptionData.courseId);
            const courseDoc = await getDoc(courseRef);

            if (courseDoc.exists()) {
              const courseData = courseDoc.data();

              const categoryRef = doc(db, "categories", courseData.categoryId);
              const categoryDoc = await getDoc(categoryRef);
              let categoryName = "Categoría desconocida";

              if (categoryDoc.exists()) {
                const categoryData = categoryDoc.data();
                categoryName = categoryData.name;
              }

              const courseElement = document.createElement("div");
              courseElement.classList.add("course-box");

              courseElement.innerHTML = `
                <span>${courseData.name}</span>
                <div class="course-category">
                  <span>Categoría: ${categoryName}</span>
                </div>
                <div class="course-description">
                  <span>Descripción: ${courseData.description}</span>
                </div>
                <div class="course-teacher">
                  <span>Profesor: ${courseData.teacher}</span>
                </div>
                <div class="course-dates">
                  <span>Fecha de inicio: ${courseData.startDate}</span>
                  <span>Fecha de fin: ${courseData.endDate}</span>
                </div>
                <div class="course-seats">
                  <span>Plazas disponibles: ${courseData.seats}</span>
                </div>
              `;

              coursesListDiv.appendChild(courseElement);
            }
          }
        }
      } catch (error) {
        console.error("Error al cargar las suscripciones:", error);
        coursesListDiv.innerHTML = '<p>Hubo un error al cargar tus cursos suscritos.</p>';
      }
    } else {
      console.log("No se encontraron datos del usuario");
    }
  } else if (!window.location.pathname.includes('home')) {
    // ✅ Corrección aquí: else if combinado
    window.location.href = "/login";
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
        showMessage("Contraseña actualizada correctamente", true);
      } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        showMessage("Error al actualizar la contraseña", false);
      }
    }

    showMessage("Datos del usuario actualizados correctamente", true);
  } else {
    showMessage("No hay usuario autenticado", false);
  }
});

// Función para cerrar sesión
document.getElementById("logout-btn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("Sesión cerrada correctamente");
    window.location.href = "/home";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
});

// Función para volver al inicio
document.getElementById("home-btn").addEventListener("click", () => {
  window.location.href = "/home";
});
