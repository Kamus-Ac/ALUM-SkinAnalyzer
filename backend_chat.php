<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$prompt = $input['mensaje'] ?? "";

$apiKey = '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';
if (empty($prompt)) {
    echo json_encode(["error" => "No se recibió mensaje del usuario."]);
    exit;
}

$data = [
    "model" => "gpt-3.5-turbo",
    "messages" => [
        ["role" => "system", "content" => "Eres un asesor experto en cuidado de la piel masculina. Responde en tono amable, breve y profesional. Da consejos prácticos para el cuidado facial según el contexto del usuario. Usa emojis de manera ligera y amistosa."],
        ["role" => "user", "content" => $prompt]
    ]
];

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $apiKey"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode(["error" => "Error al conectar con OpenAI: " . curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);
echo $response;
?>
