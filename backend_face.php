<?php
// backend_face.php
header('Content-Type: application/json');

// Verifica si se subió una imagen
if (!isset($_FILES['image']) || $_FILES['image']['error'] != UPLOAD_ERR_OK) {
    echo json_encode(["error" => "No se subió ninguna imagen o hubo un error."]);
    exit;
}

// Credenciales de Face++
$api_key = "6yQ2hI2zCNS0F8_Zcwv2XmCXaPmbuwuG"; 
$api_secret = "rlYsLSVnjXTtYfGR6yPwOhGnnOpW2GY-";

// Prepara la imagen para enviar a la API
$image = curl_file_create($_FILES['image']['tmp_name']);

// Configura la solicitud cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api-us.faceplusplus.com/facepp/v3/detect");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    "api_key" => $api_key,
    "api_secret" => $api_secret,
    "image_file" => $image,
    "return_attributes" => "skinstatus"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Ejecuta la solicitud
$response = curl_exec($ch);

// Verifica errores de cURL
if ($response === false) {
    echo json_encode(["error" => "Error al conectar con Face++: " . curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);

// Devuelve la respuesta original al navegador
echo $response;
?>
