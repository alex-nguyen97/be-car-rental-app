<?php
// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Respond to preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Set content type
header('Content-Type: application/json');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Only POST method is allowed."
    ]);
    exit();
}

// Read JSON input
$input = json_decode(file_get_contents("php://input"), true);

// Validate input
if (!isset($input['data']) || !is_string($input['data'])) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid input. Expected a 'data' field."
    ]);
    exit();
}

// File to write to
$filename = "cars.json";

// Save the data
file_put_contents($filename, $input['data'] . PHP_EOL, FILE_APPEND);

// Success response
echo json_encode([
    "status" => "success",
    "message" => "Data saved to file."
]);
?>
