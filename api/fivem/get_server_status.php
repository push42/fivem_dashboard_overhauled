<?php
require_once '../config/database.php';
require_once '../cors_helper.php';

// Clean any output buffering and start fresh
if (ob_get_level()) {
    ob_end_clean();
}
ob_start();

// Initialize CORS
initCors();

try {
    // Try to get server status from TrackyServer API
    $trackyData = null;
    if (defined('TRACKY_SERVER_KEY') && defined('TRACKY_SERVER_ID')) {
        $trackyUrl = "https://api.trackyserver.com/server/" . TRACKY_SERVER_ID . "?key=" . TRACKY_SERVER_KEY;

        $context = stream_context_create([
            'http' => [
                'timeout' => 5,
                'method' => 'GET'
            ]
        ]);

        $trackyResponse = @file_get_contents($trackyUrl, false, $context);
        if ($trackyResponse) {
            $trackyData = json_decode($trackyResponse, true);
        }
    }

    // Fallback: Get basic stats from FiveM database
    $db = Database::getInstance();
    $fivemDb = $db->getFivemConnection();

    // Get total registered users
    $stmt = $fivemDb->prepare("SELECT COUNT(*) as total_users FROM users");
    $stmt->execute();
    $totalUsers = $stmt->fetch()['total_users'];

    // Get recent activity (users seen in last 24 hours - using last_login since last_seen doesn't exist)
    $stmt = $fivemDb->prepare("
        SELECT COUNT(*) as active_users
        FROM users
        WHERE last_login > NOW() - INTERVAL '24 hours'
    ");
    $stmt->execute();
    $activeUsers = $stmt->fetch()['active_users'];

    // Get total vehicles
    $stmt = $fivemDb->prepare("SELECT COUNT(*) as total_vehicles FROM vehicles");
    $stmt->execute();
    $totalVehicles = $stmt->fetch()['total_vehicles'];

    $serverStats = [
        'online' => $trackyData['online'] ?? false,
        'players' => $trackyData['players'] ?? 0,
        'maxPlayers' => $trackyData['maxPlayers'] ?? 64,
        'uptime' => $trackyData['uptime'] ?? null,
        'version' => $trackyData['version'] ?? 'Unknown',
        'map' => $trackyData['map'] ?? 'FiveM',
        'totalUsers' => $totalUsers,
        'activeUsers' => $activeUsers,
        'totalVehicles' => $totalVehicles,
        'lastUpdate' => date('Y-m-d H:i:s')
    ];

    echo json_encode([
        'success' => true,
        'server' => $serverStats,
        'tracky_available' => $trackyData !== null
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
