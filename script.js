// script.js

const form = document.getElementById("form-analisis");
const inputImagen = document.getElementById("imagen");
const resultadoDiv = document.getElementById("resultado");
const mensajeBot = document.getElementById("mensajeBot");
const loader = document.getElementById("loader");

const botonChat = document.getElementById("enviarChat");
const inputChat = document.getElementById("mensajeUsuario");

let historialScores = [];

// Enviar selfie
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await analizarRostro();
});

// Enviar mensaje al chatbot
botonChat.addEventListener("click", () => {
    const texto = inputChat.value.trim();
    if (!texto) return;
    enviarAlChatbot(texto);
    inputChat.value = "";
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

// Mapa de calor
function dibujarMapa(skin) {
    let html = `
        <h3>🧴 Resultado del análisis</h3>
        <canvas id="mapaPiel" width="300" height="300"></canvas>
    `;
    resultadoDiv.innerHTML = html;

    const canvas = document.getElementById("mapaPiel");
    const ctx = canvas.getContext("2d");

    // Fondo verde
    ctx.fillStyle = "#8BC34A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Escalar valores Face++ a 0-1
    const acne = Math.min(1, skin.acne || 0);
    const stain = Math.min(1, skin.stain || 0);
    const dark_circle = Math.min(1, skin.dark_circle || 0);
    const health = Math.min(1, skin.health || 0);

    // Zonas simuladas
    const zonas = [
        {x:50, y:50, valor:acne},
        {x:200, y:50, valor:stain},
        {x:100, y:200, valor:dark_circle},
        {x:150, y:150, valor:1 - health} // áreas menos saludables en rojo
    ];

    zonas.forEach(z => {
        const intensidad = z.valor;
        const r = Math.floor(255 * intensidad);
        const g = Math.floor(139 * (1 - intensidad));
        const b = 0;
        ctx.fillStyle = `rgba(${r},${g},${b},0.6)`;
        ctx.beginPath();
        ctx.arc(z.x, z.y, 40, 0, 2*Math.PI);
        ctx.fill();
    });
}

// Recomendaciones
function mostrarRecomendaciones(skin) {
    let recomendaciones = [];

    if (skin.health < 0.3) recomendaciones.push("Usa limpiadores suaves y humectantes ligeros.");
    if (skin.acne > 0.4) recomendaciones.push("Evita tocar tu rostro y usa productos con ácido salicílico.");
    if (skin.dark_circle > 0.4) recomendaciones.push("Duerme mejor y considera cremas con cafeína.");
    if (skin.stain > 0.4) recomendaciones.push("Usa protector solar diariamente ☀️");

    let html = `
        <h4>💡 Recomendaciones:</h4>
        <ul>${recomendaciones.map(r => `<li>${r}</li>`).join("")}</ul>
    `;
    resultadoDiv.innerHTML += html;
}

// Chatbot con OpenAI
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

        let respuesta = "No se obtuvo respuesta del chatbot.";

        if (data.choices && data.choices[0] && data.choices[0].message) {
            respuesta = data.choices[0].message.content;
        } else if (data.error) {
            respuesta = "Error de OpenAI: " + data.error.message;
        }

        mensajeBot.innerHTML = `<p>${respuesta}</p>`;

    } catch (err) {
        console.error(err);
        mensajeBot.innerHTML = `<p style="color:red;">Error al conectar con el chatbot.</p>`;
    }
}

// Loader
function mostrarCargando(mostrar, texto = "Cargando...") {
    if (mostrar) {
        loader.style.display = "block";
        loader.textContent = texto;
    } else {
        loader.style.display = "none";
    }
}
