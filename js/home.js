function updateProgress(category, value) {
    const progressCircle = document.getElementById(`progress-${category}`);
    if (!progressCircle) return;

    let offset = 251.2 - (251.2 * parseFloat(value)) / 100;
    progressCircle.style.strokeDashoffset = offset;
}

// Esperar a que el DOM cargue completamente antes de actualizar el progreso
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".category").forEach((element) => {
        const category = element.dataset.category; // Extrae el nombre de la categoría
        const savedProgress = localStorage.getItem(`quizProgress_${category}`) || 0; // Obtiene el progreso guardado

        updateProgress(category, savedProgress);
    });

    // 🔴 Agregar funcionalidad al botón de reinicio de progreso
    const resetButton = document.getElementById("reset-progress");
    if (resetButton) {
        resetButton.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que quieres reiniciar tu progreso?")) {
                document.querySelectorAll(".category").forEach((element) => {
                    const category = element.dataset.category;
                    localStorage.removeItem(`quizProgress_${category}`); // Elimina progreso guardado
                    updateProgress(category, 0); // Reinicia la barra visualmente
                });

                alert("Progreso reiniciado con éxito.");
            }
        });
    }
});
