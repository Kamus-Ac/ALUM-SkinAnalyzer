// script.js

// Referencias a los elementos del DOM
const form = document.getElementById("form-analisis");
const inputImagen = document.getElementById("imagen");
const resultadoDiv = document.getElementById("resultado");
const mensajeBot = document.getElementById("mensajeBot");
const loader = document.getElementById("loader");

let historialScores = [];

// Escucha el envío del formulario
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await analizarRostro();
});

// Analiza el rostro con Face++
async function analizarRostro() {
    try {
        const formData = new FormData();
        formData.append("image", inputImagen.files[0]);

        mostrarCargando(true, "Analizando tu piel... 🌿");

        const res = await fetch("backend_face.php", {
            method: "POST",
            body: formData
        });

        if (!res.ok) throw new Error("Error al conectar con el servidor.");

        const data = await res.json();
        console.log("Respuesta Face++:", data);

        if (data.faces && data.faces.length > 0) {
            const skin = data.faces[0].attributes.skinstatus;
            historialScores.push(skin);

            dibujarMapa(skin);
            mostrarRecomendaciones(skin);

            resultadoDiv.style.display = "block";
        } else {
            alert("No se detectó rostro en la imagen.");
        }

    } catch (err) {
        console.error(err);
        alert("Error al conectar con la API.");
    } finally {
        mostrarCargando(false);
    }
}

// Dibuja el “mapa” de piel
function dibujarMapa(skin) {
    let html = `
        <h3>🧴 Resultado del análisis</h3>
        <ul>
            <li>Grasa: ${skin.healthiness}</li>
            <li>Manchas: ${skin.dark_circle}</li>
            <li>Acné: ${skin.acne}</li>
            <li>Arrugas: ${skin.stain}</li>
        </ul>
    `;
    resultadoDiv.innerHTML = html;
}

// Muestra recomendaciones automáticas
function mostrarRecomendaciones(skin) {
    let recomendaciones = [];

    if (skin.healthiness < 30) recomendaciones.push("Usa limpiadores suaves y humectantes ligeros.");
    if (skin.acne > 50) recomendaciones.push("Evita tocar tu rostro y usa productos con ácido salicílico.");
    if (skin.dark_circle > 40) recomendaciones.push("Duerme mejor y considera cremas con cafeína.");
    if (skin.stain > 40) recomendaciones.push("Usa protector solar diariamente ☀️");

    let html = `
        <h4>💡 Recomendaciones personalizadas:</h4>
        <ul>${recomendaciones.map(r => `<li>${r}</li>`).join("")}</ul>
    `;
    resultadoDiv.innerHTML += html;
}

// Chatbot con IA
async function enviarAlChatbot(texto) {
    try {
        const res = await fetch("backend_chat.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensaje: texto })
        });

        if (!res.ok) throw new Error("Error al conectar con el chatbot.");

        const data = await res.json();
        console.log("Respuesta Chatbot:", data);

        const respuesta = data.choices?.[0]?.message?.content || "No se obtuvo respuesta del chatbot.";
        mensajeBot.innerHTML = `<p>${respuesta}</p>`;

    } catch (err) {
        console.error(err);
        mensajeBot.innerHTML = `<p style="color:red;">Error al conectar con el chatbot.</p>`;
    }
}

// Indicador de carga
function mostrarCargando(mostrar, texto = "Cargando...") {
    if (mostrar) {
        loader.style.display = "flex";
        loader.textContent = texto;
    } else {
        loader.style.display = "none";
    }
}
