<?php
require_once 'cors_helper.php';

// Initialize CORS
initCors();

// Simple test endpoint
echo json_encode([
    'success' => true,
    'message' => 'API is working!',
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
