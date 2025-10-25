<?php
// Verifica que se haya subido un archivo
if ($_FILES['image']['error'] == UPLOAD_ERR_OK) {

    // Prepara la imagen y las credenciales de Face++
    $image = curl_file_create($_FILES['image']['tmp_name']);
    $api_key = "6yQ2hI2zCNS0F8_Zcwv2XmCXaPmbuwuG"; //api key
    $api_secret = "rlYsLSVnjXTtYfGR6yPwOhGnnOpW2GY-"; //api secret

    // Inicializa cURL para hacer la solicitud a la API de Face++
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api-us.faceplusplus.com/facepp/v3/detect"); //curl
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        "api_key" => $api_key,
        "api_secret" => $api_secret,
        "image_file" => $image,
        "return_attributes" => "skinstatus" // Pedimos el análisis de piel
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Ejecuta la petición y guarda la respuesta
    $response = curl_exec($ch);
    curl_close($ch);

    // Devuelve el resultado como JSON al navegador o Postman
    header('Content-Type: application/json');
    file_put_contents("debug.json", $response);

    echo $response;

} else {
    // Si no se subió ninguna imagen, devuelve error
    echo json_encode(["error" => "No se subió ninguna imagen"]);
}
?>
