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
    console.log("Script de Google Auth cargado.");

    const googleRegisterButton = document.getElementById("google-register");

    if (!googleRegisterButton) {
        console.error("Error: Botón de 'Registrar con Google' no encontrado.");
        return;
    }

    googleRegisterButton.addEventListener("click", async () => {
        console.log("Botón 'Registrar con Google' clickeado.");

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            console.log("Usuario autenticado con Google:", user);

            // Guardar datos del usuario en LocalStorage
            localStorage.setItem("user", JSON.stringify({
                email: user.email,
                username: user.displayName || "Usuario de Google"
            }));

            // Verificar si el usuario ya está registrado en la base de datos
            const response = await fetch("http://localhost:5000/usuarios");

            if (!response.ok) {
                throw new Error("Error en la conexión con el servidor.");
            }

            const users = await response.json();
            const userExists = users.some(u => u.email === user.email);

            if (userExists) {
                console.log("Usuario ya registrado:", user.email);
                alert(`Este correo ya está registrado. Redirigiendo a inicio de sesión...`);
                
                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 2000);
                
            } else {
                console.log("Usuario nuevo. Guardando en la base de datos...");

                const saveResponse = await fetch("http://localhost:5000/usuarios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        username: user.displayName || "Usuario de Google"
                    })
                });

                if (!saveResponse.ok) {
                    throw new Error("No se pudo guardar el usuario en la base de datos.");
                }

                alert("Registro exitoso. Redirigiendo a Inicio...");

                setTimeout(() => {
                    window.location.href = "../index.html";
                }, 1000);
            }

        } catch (error) {
            console.error("Error en la autenticación con Google:", error);
            alert("Error al registrar con Google.");
        }
    });
});
