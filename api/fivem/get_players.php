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
    $db = Database::getInstance();
    $fivemDb = $db->getFivemConnection();
    $fivemDbType = $db->getFivemDbType();

    // Build query based on database type - using individual columns instead of accounts JSON
    if ($fivemDbType === 'postgresql') {
        $stmt = $fivemDb->prepare("
            SELECT
                identifier,
                firstname,
                lastname,
                job,
                job_grade,
                money,
                bank,
                dirty_money,
                group_name as \"group\",
                last_login::text as last_seen_formatted,
                position
            FROM users
            ORDER BY last_login DESC NULLS LAST
            LIMIT 100
        ");
    } else {
        $stmt = $fivemDb->prepare("
            SELECT
                identifier,
                firstname,
                lastname,
                job,
                job_grade,
                money,
                bank,
                dirty_money,
                `group`,
                DATE_FORMAT(last_login, '%Y-%m-%d %H:%i:%s') as last_seen_formatted,
                position
            FROM users
            ORDER BY last_login DESC
            LIMIT 100
        ");
    }

    $stmt->execute();
    $players = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Add dirty_money as black_money for compatibility and ensure numeric values
    foreach ($players as &$player) {
        $player['black_money'] = $player['dirty_money'] ?? 0;

        // Ensure numeric values
        $player['money'] = (int)($player['money'] ?? 0);
        $player['bank'] = (int)($player['bank'] ?? 0);
        $player['black_money'] = (int)$player['black_money'];
    }

    echo json_encode([
        'success' => true,
        'players' => $players,
        'total' => count($players),
        'database_type' => $fivemDbType
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch players: ' . $e->getMessage()
    ]);
}

// Clean output and send
$output = ob_get_clean();
header('Content-Type: application/json');
echo $output;
