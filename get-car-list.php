<?php
// Allow all origins — for development purposes
header('Access-Control-Allow-Origin: *');

// Allow specific HTTP methods
header('Access-Control-Allow-Methods: GET, OPTIONS');

// Allow specific headers
header('Access-Control-Allow-Headers: Content-Type');

// Respond to preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Set content type to JSON
header('Content-Type: application/json');

// Define the file path
$filename = "cars.json";

$fileContent = file_get_contents($filename);
$carsData = json_decode($fileContent, true);

// Check if the file exists
if (file_exists($filename)) {
    echo json_encode([
        "status" => "success",
        "data" => $carsData
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "File '$filename' not found."
    ]);
}
?>
