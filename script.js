const selfieInput = document.getElementById('selfieInput');
const analizarBtn = document.getElementById('analizarBtn');
const resultadoDiv = document.getElementById('resultado');
const recomendacionesList = document.getElementById('recomendaciones');
const mapaCanvas = document.getElementById('mapaCanvas');
const ctx = mapaCanvas.getContext('2d');

const graficoProgreso = document.getElementById('graficoProgreso');
const ctxGrafico = graficoProgreso.getContext('2d');

const chatMensajes = document.getElementById('chatMensajes');
const chatInput = document.getElementById('chatInput');
const chatBtn = document.getElementById('chatBtn');

let historialScores = [];

async function analizarSelfieConAPI() {
    if (!selfieInput.files[0]) { alert("Selecciona una selfie"); return; }

    const formData = new FormData();
    formData.append("image", selfieInput.files[0]);

    try {
        const res = await fetch("backend.php", { method:"POST", body:formData });
        const data = await res.json();
        console.log(data);

        if(data.faces && data.faces.length>0) {
            const skinScore = data.faces[0].attributes.skinstatus;
            historialScores.push(skinScore);
            dibujarMapa(skinScore);
            mostrarRecomendaciones(skinScore);
            dibujarProgreso();
            resultadoDiv.style.display = "block";
        } else alert("No se detectó rostro");

    } catch(err) {
        console.error(err);
        alert("Error al conectar con la API");
    }
}

function dibujarMapa(skinScore){
    ctx.clearRect(0,0,mapaCanvas.width,mapaCanvas.height);
    const zones = [
        {x:50,y:20,w:200,h:50,score:skinScore.acne},
        {x:50,y:80,w:100,h:80,score:skinScore.stain},
        {x:150,y:80,w:100,h:80,score:skinScore.dark_circle}
    ];
    zones.forEach(z=>{
        const rojo=Math.floor(z.score*2.55);
        const verde=255-rojo;
        ctx.fillStyle=`rgba(${rojo},${verde},0,0.4)`;
        ctx.fillRect(z.x,z.y,z.w,z.h);
    });
}

function mostrarRecomendaciones(skinScore){
    recomendacionesList.innerHTML='';
    if(skinScore.acne>50){ const li=document.createElement('li'); li.textContent="🔥 Acné alto: usar crema antiacné y limpiar rostro 2 veces al día"; li.style.color="red"; recomendacionesList.appendChild(li); }
    if(skinScore.stain>50){ const li=document.createElement('li'); li.textContent="🌞 Manchas visibles: aplicar protector solar y vitamina C"; li.style.color="orange"; recomendacionesList.appendChild(li); }
    if(skinScore.dark_circle>50){ const li=document.createElement('li'); li.textContent="💤 Ojeras: usar contorno de ojos y dormir 8 horas"; li.style.color="purple"; recomendacionesList.appendChild(li); }
    if(skinScore.acne<=50 && skinScore.stain<=50 && skinScore.dark_circle<=50){ const li=document.createElement('li'); li.textContent="✅ Piel en buen estado, mantener rutina diaria de limpieza e hidratación"; li.style.color="green"; recomendacionesList.appendChild(li); }
}

function dibujarProgreso(){
    ctxGrafico.clearRect(0,0,graficoProgreso.width,graficoProgreso.height);
    const widthStep=graficoProgreso.width/historialScores.length;
    historialScores.forEach((s,i)=>{
        ctxGrafico.fillStyle="red"; ctxGrafico.fillRect(i*widthStep, graficoProgreso.height-(s.acne/100*graficoProgreso.height), widthStep/3, s.acne/100*graficoProgreso.height);
        ctxGrafico.fillStyle="orange"; ctxGrafico.fillRect(i*widthStep+widthStep/3, graficoProgreso.height-(s.stain/100*graficoProgreso.height), widthStep/3, s.stain/100*graficoProgreso.height);
        ctxGrafico.fillStyle="purple"; ctxGrafico.fillRect(i*widthStep+2*widthStep/3, graficoProgreso.height-(s.dark_circle/100*graficoProgreso.height), widthStep/3, s.dark_circle/100*graficoProgreso.height);
    });
}

// Chatbot
chatBtn.addEventListener('click',()=>{
    const pregunta = chatInput.value.trim();
    if(!pregunta) return;
    const mensajeUsuario = document.createElement('div'); mensajeUsuario.textContent="Usuario: "+pregunta;
    chatMensajes.appendChild(mensajeUsuario);
    const respuesta = generarRespuesta(pregunta);
    const mensajeBot = document.createElement('div'); mensajeBot.textContent="Bot: "+respuesta;
    chatMensajes.appendChild(mensajeBot);
    chatInput.value="";
    chatMensajes.scrollTop = chatMensajes.scrollHeight;
});

function generarRespuesta(texto){
    texto = texto.toLowerCase();
    if(texto.includes("acné")) return "Te recomiendo limpiar tu rostro 2 veces al día y usar crema antiacné.";
    if(texto.includes("manchas")) return "Usa protector solar y vitamina C para las manchas.";
    if(texto.includes("ojeras")) return "Duerme 8 horas y aplica contorno de ojos.";
    return "Mantén tu rutina diaria de limpieza e hidratación y consulta a un especialista si persisten problemas.";
}

analizarBtn.addEventListener('click', analizarSelfieConAPI);
