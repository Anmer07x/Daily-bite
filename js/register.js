
//logica registro
document.addEventListener("DOMContentLoaded", () => {
    console.log("Script cargado correctamente."); // Verificar que el script se carga

    const registerButton = document.getElementById("start");

    registerButton.addEventListener("click", async (event) => {
        event.preventDefault(); // Evita la recarga de la página
        console.log("Botón de registro clickeado."); // Verificar que el botón funciona

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        // Validar que los campos no estén vacíos
        if (!username || !email || !password || !confirmPassword) {
            alert("Todos los campos son obligatorios.");
            console.log("Error: campos vacíos.");
            return;
        }

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            console.log("Error: las contraseñas no coinciden.");
            return;
        }

        // Crear objeto usuario
        const newUser = {
            username,
            email,
            password
        };

        try {
            console.log("Enviando datos al servidor...", newUser); // Depuración

            const response = await fetch("http://localhost:5000/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                console.log("Usuario registrado correctamente.");
                
                // Mostrar modal de éxito
                showModal();

                // Redirigir después de 2 segundos
                setTimeout(() => {
                    console.log("Redirigiendo a index.html...");
                    window.location.href = "index.html";
                }, 2000);
            } else {
                alert("Error al registrar usuario.");
                console.log("Error en la respuesta del servidor.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("No se pudo conectar con el servidor.");
        }
    });
});

// Función para mostrar modal de éxito
function showModal() {
    console.log("Mostrando modal de éxito...");

    const modalHTML = `
        <div id="successModal" class="modal">
            <div class="modal-content">
                <h2>Registro exitoso</h2>
                <p>Serás redirigido al inicio de sesión.</p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    
    // Agregar estilos al modal
    const modalStyle = document.createElement("style");
    modalStyle.innerHTML = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .modal-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
    `;
    document.head.appendChild(modalStyle);
}
