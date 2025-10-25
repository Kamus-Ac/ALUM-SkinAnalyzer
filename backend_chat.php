<?php
// backend_chat.php
header('Content-Type: application/json');

// Leer el mensaje enviado desde el frontend
$input = json_decode(file_get_contents('php://input'), true);
$prompt = $input['mensaje'] ?? "";

// API Key de OpenAI (⚠️ reemplázala por la tuya)
$apiKey = 'OPENAI_API_KEY'; 

if (empty($prompt)) {
    echo json_encode(["error" => "No se recibió mensaje del usuario."]);
    exit;
}

// Prepara el cuerpo de la solicitud
$data = [
    "model" => "gpt-4-turbo",
    "messages" => [
        ["role" => "system", "content" => "Eres un asesor experto en cuidado de la piel masculina. Responde en tono amable, breve y profesional. Da consejos prácticos para el cuidado facial según el contexto del usuario. Usa emojis de manera ligera y amistosa."],
        ["role" => "user", "content" => $prompt]
    ]
];

// Configura cURL
$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $apiKey"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

// Ejecuta la solicitud
$response = curl_exec($ch);

// Verifica si hay errores
if ($response === false) {
    echo json_encode(["error" => "Error al conectar con OpenAI: " . curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);

// Devuelve la respuesta JSON de la API
echo $response;
?>
