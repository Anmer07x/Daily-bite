const questions = [
    { question: "¿Qué etiqueta es semánticamente correcta para el contenido principal?", options: ["main", "section", "header"], answer: "main" },
    { question: "¿Cuál es la propiedad en CSS para cambiar el color de fondo?", options: ["background-color", "color", "border"], answer: "background-color" },
    { question: "¿Qué lenguaje se usa para el desarrollo web?", options: ["HTML", "Python", "C++"], answer: "HTML" },
    { question: "¿Cuál es la etiqueta HTML para crear un enlace?", options: ["a", "link", "href"], answer: "a" },
    { question: "¿Cuál es la propiedad en CSS para cambiar el tamaño de letra?", options: ["font-size", "text-size", "letter-spacing"], answer: "font-size" },
    { question: "¿Cuál es la etiqueta HTML para crear una imagen?", options: ["img", "image", "picture"], answer: "img" },
];

// Obtener categoría (para evitar errores si quieres reutilizar en otros quizzes)
const category = "html";

// Recuperar progreso guardado o establecer valores iniciales
let currentQuestion = parseInt(localStorage.getItem(`currentQuestion_${category}`)) || 0;
let lives = parseInt(localStorage.getItem(`lives_${category}`)) || 4;
let progress = parseFloat(localStorage.getItem(`quizProgress_${category}`)) || 0;

// Seleccionar elementos del DOM (verificando que existen)
const questionText = document.getElementById("question-text");
const options = Array.from(document.querySelectorAll(".option"));
const checkBtn = document.getElementById("check-btn");
const progressBar = document.querySelector(".progress");
const livesCount = document.getElementById("lives-count");
const closeIcon = document.querySelector(".close-icon");

// Agregar evento para cerrar y volver a `home.html`
if (closeIcon) {
    closeIcon.onclick = () => {
        saveProgress();
        window.location.href = "home.html";
    };
}

// Cargar pregunta y actualizar UI
function loadQuestion() {
    if (currentQuestion >= questions.length) {
        completeQuiz();
        return;
    }

    const currentQ = questions[currentQuestion];
    questionText.textContent = currentQ.question;

    // Llenar opciones y resetear estilos
    options.forEach((btn, index) => {
        if (currentQ.options[index]) {
            btn.textContent = currentQ.options[index];
            btn.classList.remove("selected", "correct", "wrong");
            btn.onclick = () => selectOption(btn);
        }
    });

    // Actualizar barra de progreso y vidas
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (livesCount) livesCount.textContent = lives;
}

// Seleccionar opción
function selectOption(button) {
    options.forEach((btn) => btn.classList.remove("selected"));
    button.classList.add("selected");
}

// Comprobar respuesta
function checkAnswer() {
    const selectedOption = document.querySelector(".option.selected");
    if (!selectedOption) {
        alert("¡Debes seleccionar una respuesta antes de comprobar!");
        return;
    }

    const correctAnswer = questions[currentQuestion].answer;

    if (selectedOption.textContent === correctAnswer) {
        selectedOption.classList.add("correct");
        progress = ((currentQuestion + 1) / questions.length) * 100; // Cálculo más preciso
        setTimeout(nextQuestion, 1000);
    } else {
        selectedOption.classList.add("wrong");
        lives--;
        if (livesCount) livesCount.textContent = lives;

        if (lives === 0) {
            alert("¡Perdiste todas tus vidas! Intenta de nuevo.");
            resetQuiz();
            return;
        }
    }

    saveProgress();
}

// Pasar a la siguiente pregunta
function nextQuestion() {
    currentQuestion++;
    saveProgress();
    loadQuestion();
}

// Guardar progreso en `localStorage`
function saveProgress() {
    localStorage.setItem(`currentQuestion_${category}`, currentQuestion);
    localStorage.setItem(`lives_${category}`, lives);
    localStorage.setItem(`quizProgress_${category}`, progress);
}

// Reiniciar quiz (sin afectar progreso de otras categorías)
function resetQuiz() {
    localStorage.removeItem(`currentQuestion_${category}`);
    localStorage.removeItem(`lives_${category}`);
    localStorage.removeItem(`quizProgress_${category}`);

    currentQuestion = 0;
    lives = 4;
    progress = 0;

    if (progressBar) progressBar.style.width = "0%";
    if (livesCount) livesCount.textContent = lives;

    loadQuestion();
}

// Finalizar quiz y redirigir
function completeQuiz() {
    alert("¡Felicidades! Has completado el quiz.");
    
    // Reiniciar progreso después de completar el quiz
    resetQuiz();

    window.location.href = "home.html";
}

// Asignar eventos solo si los elementos existen
if (checkBtn) {
    checkBtn.onclick = checkAnswer;
}

// Verificar si ya se completó el quiz para evitar mostrar la alerta repetidamente
if (currentQuestion >= questions.length) {
    resetQuiz();
}

// Cargar la primera pregunta
loadQuestion();
