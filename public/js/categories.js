import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvb6UM907Yd1LTYyLzNqC4CzHg7N5ZeVQ",
    authDomain: "online-course-597fd.firebaseapp.com",
    projectId: "online-course-597fd",
    storageBucket: "online-course-597fd.appspot.com",
    messagingSenderId: "563059267790",
    appId: "1:563059267790:web:eef80e3dff0bbb8b6fd89f",
    measurementId: "G-DJMX9HK2VD"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Obtén la instancia de Firestore
const auth = getAuth(); // Obtén la instancia de Authentication

// Función para obtener y mostrar categorías y cursos
async function loadCategories() {
    console.log("Cargando categorías y cursos...");

    try {
        const categoriesContainer = document.getElementById('categories-container');
        const searchInput = document.getElementById('searchInput');

        // Obtener categorías
        const categoriesRef = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
        console.log("Categorías recuperadas:", categoriesSnapshot.size); // Ver cuántas categorías se recuperaron

        categoriesSnapshot.forEach(async (categoryDoc) => {
            const categoryData = categoryDoc.data();
            console.log("Categoría:", categoryData); // Ver la categoría y los datos

            const categoryName = categoryData.name;
            const categoryId = categoryDoc.id;

            // Crear contenedor para cada categoría
            const categoryBox = document.createElement('div');
            categoryBox.classList.add('category-box');
            categoryBox.id = categoryId;

            // Crear título de la categoría
            const categoryTitle = document.createElement('h3');
            categoryTitle.textContent = categoryName;

            const categoryDescription = document.createElement('p');
            categoryDescription.textContent = categoryData.description;

            categoryBox.appendChild(categoryTitle);
            categoryBox.appendChild(categoryDescription);

            categoriesContainer.appendChild(categoryBox);

            // Crear contenedor de cursos (inicialmente oculto)
            const coursesList = document.createElement('div');
            coursesList.classList.add('courses-list');
            coursesList.id = `courses-${categoryId}`; // ID único por categoría
            coursesList.style.display = 'none'; // Ocultar inicialmente los cursos

            // Consultar cursos sin filtrar por categoría para ver si hay cursos disponibles
            const coursesRef = collection(db, 'courses');
            const coursesSnapshot = await getDocs(coursesRef);
            console.log(`Cursos disponibles: ${coursesSnapshot.size}`); // Ver cuántos cursos existen en total

            if (coursesSnapshot.size > 0) {
                console.log(`Consultando cursos para la categoría con ID: ${categoryId}`);
                const coursesQuery = query(coursesRef, where("categoryId", "==", categoryId));
                const filteredCoursesSnapshot = await getDocs(coursesQuery);
                console.log("Cursos recuperados: ", filteredCoursesSnapshot.size); // Ver cuántos cursos se recuperaron con filtro

                filteredCoursesSnapshot.forEach(courseDoc => {
                    const courseData = courseDoc.data();
                    const courseName = courseData.name;

                    // Crear curso
                    const courseDiv = document.createElement('div');
                    courseDiv.classList.add('course');
                    const courseTitle = document.createElement('h4');
                    courseTitle.textContent = courseName;
                    const subscribeBtn = document.createElement('button');
                    subscribeBtn.classList.add('btn', 'subscribe-btn');
                    subscribeBtn.textContent = 'Suscribirse';
                    subscribeBtn.onclick = async () => {
                        const courseId = courseDoc.id; // El ID del curso al que se está suscribiendo

                        // Obtener el usuario autenticado
                        const user = auth.currentUser;

                        if (user) {
                            try {
                                const userId = user.uid; // El ID del usuario autenticado

                                // Crear un documento de suscripción en la colección 'subscriptions'
                                const subscriptionRef = doc(db, 'subscriptions', `${userId}_${courseId}`);
                                
                                // Guardar la suscripción
                                await setDoc(subscriptionRef, {
                                    userId: userId,
                                    courseId: courseId,
                                    courseName: courseName,
                                    subscribedAt: new Date(), // Fecha de suscripción
                                });

                                alert(`Te has suscrito al curso de ${courseName}`);
                            } catch (error) {
                                console.error("Error al guardar la suscripción:", error);
                                alert("Hubo un problema al guardar tu suscripción. Por favor, intenta nuevamente.");
                            }
                        } else {
                            console.log("No hay usuario autenticado");
                            alert("Debes iniciar sesión para suscribirte.");
                        }
                    };

                    courseDiv.appendChild(courseTitle);
                    courseDiv.appendChild(subscribeBtn);
                    coursesList.appendChild(courseDiv);
                });
            } else {
                console.log("No se encontraron cursos asociados a la categoría.");
            }

            categoryBox.appendChild(coursesList);

            // Añadir evento para mostrar los cursos al hacer clic en la categoría
            categoryBox.onclick = () => {
                const currentCoursesList = document.getElementById(`courses-${categoryId}`);
                if (currentCoursesList.style.display === 'none') {
                    currentCoursesList.style.display = 'block';
                } else {
                    currentCoursesList.style.display = 'none';
                }
            };
        });

        // Filtrar categorías y cursos por búsqueda
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const categoryBoxes = document.querySelectorAll('.category-box');
            categoryBoxes.forEach(box => {
                const categoryTitle = box.querySelector('h3').textContent.toLowerCase();
                const courses = box.querySelectorAll('.course');
                let showCategory = categoryTitle.includes(searchTerm);
                let showCourses = false;

                courses.forEach(course => {
                    const courseTitle = course.querySelector('h4').textContent.toLowerCase();
                    if (courseTitle.includes(searchTerm)) {
                        showCourses = true;
                    }
                });

                if (showCategory || showCourses) {
                    box.style.display = 'block';
                } else {
                    box.style.display = 'none';
                }
            });
        });

    } catch (error) {
        console.error("Error al cargar las categorías y cursos: ", error);
    }
}

// Llamar a la función para cargar los datos
loadCategories();
