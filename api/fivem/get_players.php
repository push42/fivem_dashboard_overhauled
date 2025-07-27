<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    // Connect to FiveM database
    $fivemDb = new PDO(
        "mysql:host=" . FIVEM_DB_HOST . ";dbname=" . FIVEM_DB_NAME,
        FIVEM_DB_USER,
        FIVEM_DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    // Get players with their data
    $stmt = $fivemDb->prepare("
        SELECT
            identifier,
            firstname,
            lastname,
            job,
            job_grade,
            accounts,
            `group`,
            DATE_FORMAT(FROM_UNIXTIME(last_seen/1000), '%Y-%m-%d %H:%i:%s') as last_seen_formatted,
            position
        FROM users
        ORDER BY last_seen DESC
        LIMIT 100
    ");

    $stmt->execute();
    $players = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Parse accounts JSON for each player
    foreach ($players as &$player) {
        if ($player['accounts']) {
            $accounts = json_decode($player['accounts'], true);
            $player['money'] = $accounts['money'] ?? 0;
            $player['bank'] = $accounts['bank'] ?? 0;
            $player['black_money'] = $accounts['black_money'] ?? 0;
        } else {
            $player['money'] = 0;
            $player['bank'] = 0;
            $player['black_money'] = 0;
        }
    }

    echo json_encode([
        'success' => true,
        'players' => $players,
        'total' => count($players)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch players: ' . $e->getMessage()
    ]);
}
?>
