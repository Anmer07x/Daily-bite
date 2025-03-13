// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB7dUyrmQoGqeMJk1cb5id769O9cSCJdHw",
    authDomain: "webjs-24579.firebaseapp.com",
    projectId: "webjs-24579",
    storageBucket: "webjs-24579.appspot.com",
    messagingSenderId: "386161376729",
    appId: "1:386161376729:web:7c97d13a67cfc22688adc8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Esperar que el DOM cargue
document.addEventListener("DOMContentLoaded", () => {
    console.log("Script de login cargado.");

    const loginButton = document.getElementById("log");
    const googleLoginButton = document.getElementById("google-login");

    if (loginButton) {
        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();
            console.log("Botón de inicio de sesión clickeado.");

            const email = document.getElementById("email").value.trim();

            if (!email) {
                alert("Por favor, ingresa un correo electrónico.");
                console.log("Error: Campo de correo vacío.");
                return;
            }

            try {
                console.log("Buscando usuario en la base de datos...");
                const response = await fetch("http://localhost:5000/usuarios");
                if (!response.ok) throw new Error("Error en la conexión con el servidor.");

                const users = await response.json();
                console.log("Usuarios obtenidos:", users);

                const user = users.find(user => user.email === email);

                if (user) {
                    console.log("Usuario encontrado:", user);
                    alert("Inicio de sesión exitoso. ¡Bienvenido!");
                    window.location.href = "./pages/home.html";
                } else {
                    alert("El correo ingresado no está registrado.");
                    console.log("Error: Usuario no encontrado.");
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
                alert("No se pudo conectar con el servidor.");
            }
        });
    } else {
        console.error("Error: Botón de login no encontrado.");
    }

    if (googleLoginButton) {
        googleLoginButton.addEventListener("click", async () => {
            console.log("Botón de Google clickeado.");
            try {
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                console.log("Usuario autenticado con Google:", user);

                // Buscar usuario en la base de datos
                const response = await fetch("http://localhost:5000/usuarios");
                if (!response.ok) throw new Error("Error en la conexión con el servidor.");
                
                const users = await response.json();
                const userExists = users.some(u => u.email === user.email);

                if (userExists) {
                    console.log("Usuario encontrado en la base de datos:", user.email);
                    alert(`Inicio de sesión exitoso. ¡Bienvenido, ${user.displayName}!`);
                    window.location.href = "./pages/home.html";
                } else {
                    console.log("Usuario NO encontrado en la base de datos. Redirigiendo a registro...");
                    alert("No estás registrado. Te redirigiremos a la página de registro.");
                    window.location.href = "./pages/register.html";
                }
            } catch (error) {
                console.error("Error en la autenticación con Google:", error);
                alert("Error al iniciar sesión con Google.");
            }
        });
    } else {
        console.error("Error: Botón de Google no encontrado.");
    }
});