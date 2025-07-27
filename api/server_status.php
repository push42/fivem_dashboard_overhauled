<?php
require_once 'config/database.php';
require_once 'cors_helper.php';

// Clean any output buffering and start fresh
if (ob_get_level()) {
    ob_end_clean();
}
ob_start();

// Initialize CORS
initCors();

try {
    $db = Database::getInstance();
    $pdo = $db->getConnection();

    // Mock server status data
    $serverStats = [
        'online' => true,
        'players' => [
            'current' => 45,
            'max' => 64
        ],
        'uptime' => '2 days, 14 hours',
        'last_restart' => '2025-07-25 08:30:00',
        'version' => '5.0.0-2372',
        'resources' => 127,
        'performance' => [
            'cpu_usage' => 23.5,
            'memory_usage' => 67.2,
            'network_traffic' => '1.2 MB/s'
        ]
    ];

    echo json_encode([
        'success' => true,
        'server' => $serverStats
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch server status: ' . $e->getMessage()
    ]);
}

// Clean output and send
$output = ob_get_clean();
header('Content-Type: application/json');
echo $output;
