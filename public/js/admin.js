// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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
const db = getFirestore(app);

// Referencias a elementos del DOM
const categoriesContainer = document.getElementById("categories-container");
const courseForm = document.getElementById("course-form");
const addCategoryButton = document.getElementById("add-category-button");
const backHomeButton = document.getElementById("back-home-button");
const addCategoryForm = document.getElementById("add-category-form");
const cancelCategoryButton = document.getElementById("cancel-category-button");

// Función para cargar categorías
async function loadCategories() {
    const categoriesSnapshot = await getDocs(collection(db, "categories"));
    const categorySelect = document.getElementById("course-category");
    categorySelect.innerHTML = "<option value=''>Seleccione una categoría</option>"; // Limpiar el select

    categoriesSnapshot.forEach((categoryDoc) => {
        const categoryData = categoryDoc.data();
        const categoryOption = document.createElement("option");
        categoryOption.value = categoryDoc.id;
        categoryOption.textContent = categoryData.name;
        categorySelect.appendChild(categoryOption);
    });
}

// Función para cargar los cursos
async function loadCourses() {
    const categoriesSnapshot = await getDocs(collection(db, "categories"));
    categoriesContainer.innerHTML = ""; // Limpiar contenedor

    categoriesSnapshot.forEach(async (categoryDoc) => {
        const categoryData = categoryDoc.data();
        const categoryId = categoryDoc.id;

        const categoryElement = document.createElement("div");
        categoryElement.classList.add("category");
        categoryElement.innerHTML = `
            <h3>${categoryData.name}</h3>
            <button class="delete-category-button" data-id="${categoryId}">Eliminar Categoría</button>
            <div id="courses-${categoryId}" class="courses">
                <!-- Cursos se cargarán aquí -->
            </div>
        `;
        categoriesContainer.appendChild(categoryElement);

        // Cargar los cursos de la categoría
        await loadCoursesByCategory(categoryId);
    });
}

// Función para cargar los cursos de una categoría
async function loadCoursesByCategory(categoryId) {
    const coursesContainer = document.getElementById(`courses-${categoryId}`);
    coursesContainer.innerHTML = ""; // Limpiar los cursos

    const coursesQuery = query(
        collection(db, "courses"),
        where("categoryId", "==", categoryId)
    );

    const coursesSnapshot = await getDocs(coursesQuery);
    coursesSnapshot.forEach((courseDoc) => {
        const courseData = courseDoc.data();
        const courseId = courseDoc.id;

        const courseElement = document.createElement("div");
        courseElement.classList.add("course");
        courseElement.innerHTML = `
            <h4>${courseData.name}</h4>
            <p>${courseData.description}</p>
            <p>Inicio: ${courseData.startDate}</p>
            <p>Fin: ${courseData.endDate}</p>
            <p>Cupos: ${courseData.seats}</p>
            <p>Profesor: ${courseData.teacher}</p>
            <button class="delete-course-button" data-id="${courseId}">Eliminar Curso</button>
        `;

        coursesContainer.appendChild(courseElement);
    });
}

// Función para eliminar un curso
async function deleteCourse(courseId) {
    try {
        await deleteDoc(doc(db, "courses", courseId));
        alert("Curso eliminado exitosamente.");
        loadCourses(); // Recargar cursos después de eliminar uno
    } catch (error) {
        console.error("Error al eliminar curso: ", error);
        alert("Hubo un error al eliminar el curso.");
    }
}

// Función para eliminar una categoría
async function deleteCategory(categoryId) {
    try {
        // Primero, eliminamos los cursos de la categoría
        const coursesQuery = query(
            collection(db, "courses"),
            where("categoryId", "==", categoryId)
        );
        const coursesSnapshot = await getDocs(coursesQuery);

        coursesSnapshot.forEach(async (courseDoc) => {
            await deleteDoc(doc(db, "courses", courseDoc.id)); // Eliminar cada curso
        });

        // Luego, eliminamos la categoría
        await deleteDoc(doc(db, "categories", categoryId));
        alert("Categoría eliminada exitosamente.");
        loadCategories(); // Recargar categorías después de eliminar
        loadCourses(); // Recargar cursos
    } catch (error) {
        console.error("Error al eliminar categoría: ", error);
        alert("Hubo un error al eliminar la categoría.");
    }
}

// Evento para agregar un curso
courseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const courseData = {
        categoryId: document.getElementById("course-category").value,
        name: document.getElementById("course-name").value,
        description: document.getElementById("course-description").value,
        startDate: document.getElementById("start-date").value,
        endDate: document.getElementById("end-date").value,
        seats: parseInt(document.getElementById("seats").value, 10),
        teacher: document.getElementById("teacher-name").value
    };

    if (!courseData.categoryId) {
        alert("Por favor, seleccione una categoría.");
        return;
    }

    try {
        await addDoc(collection(db, "courses"), courseData);
        alert("Curso agregado exitosamente.");
        loadCourses(); // Recargar cursos después de agregar uno nuevo
    } catch (error) {
        console.error("Error al agregar curso: ", error);
        alert("Hubo un error al agregar el curso.");
    }
});

// Evento para manejar el botón de volver al inicio
backHomeButton.addEventListener("click", () => {
    window.location.href = "/home"; // Redirige al inicio
});

// Evento para manejar el botón de agregar categoría
addCategoryButton.addEventListener("click", () => {
    addCategoryForm.style.display = "block"; // Mostrar el formulario de agregar categoría
});

// Evento para manejar el botón de cancelar en el formulario de categoría
cancelCategoryButton.addEventListener("click", () => {
    addCategoryForm.style.display = "none"; // Ocultar el formulario de agregar categoría
});

// Evento para agregar una nueva categoría
const categoryForm = document.getElementById("category-form");
categoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const categoryName = document.getElementById("category-name").value;

    if (categoryName.trim() === "") {
        alert("Por favor, ingrese un nombre para la categoría.");
        return;
    }

    try {
        await addDoc(collection(db, "categories"), { name: categoryName });
        alert("Categoría agregada exitosamente.");
        addCategoryForm.style.display = "none"; // Ocultar formulario
        loadCategories(); // Recargar categorías
    } catch (error) {
        console.error("Error al agregar categoría: ", error);
        alert("Hubo un error al agregar la categoría.");
    }
});

// Evento para manejar el clic en el botón de eliminar curso
categoriesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-course-button")) {
        const courseId = e.target.dataset.id;
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este curso?");
        if (confirmDelete) {
            deleteCourse(courseId);
        }
    }
});

// Evento para manejar el clic en el botón de eliminar categoría
categoriesContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-category-button")) {
        const categoryId = e.target.dataset.id;
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar esta categoría?");
        if (confirmDelete) {
            deleteCategory(categoryId);
        }
    }
});

// Cargar las categorías y cursos al cargar la página
loadCategories();
loadCourses();
