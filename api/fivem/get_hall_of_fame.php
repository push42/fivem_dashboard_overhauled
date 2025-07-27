<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    $db = Database::getInstance();
    $fivemDb = $db->getFivemConnection();

    $hallOfFame = [];

    // Richest Players (by bank + money)
    $stmt = $fivemDb->prepare("
        SELECT
            identifier,
            firstname,
            lastname,
            accounts,
            (JSON_EXTRACT(accounts, '$.money') + JSON_EXTRACT(accounts, '$.bank')) as total_money
        FROM users
        WHERE accounts IS NOT NULL
        ORDER BY total_money DESC
        LIMIT 10
    ");
    $stmt->execute();
    $hallOfFame['richest'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Most Vehicles
    $stmt = $fivemDb->prepare("
        SELECT
            u.identifier,
            u.firstname,
            u.lastname,
            COUNT(ov.owner) as vehicle_count
        FROM users u
        LEFT JOIN owned_vehicles ov ON u.identifier = ov.owner
        GROUP BY u.identifier
        ORDER BY vehicle_count DESC
        LIMIT 10
    ");
    $stmt->execute();
    $hallOfFame['most_vehicles'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Most Active (by playtime if available)
    $stmt = $fivemDb->prepare("
        SELECT
            identifier,
            firstname,
            lastname,
            last_seen,
            DATE_FORMAT(FROM_UNIXTIME(last_seen/1000), '%Y-%m-%d %H:%i:%s') as last_seen_formatted
        FROM users
        ORDER BY last_seen DESC
        LIMIT 10
    ");
    $stmt->execute();
    $hallOfFame['most_active'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Company Money Leaderboard
    $stmt = $fivemDb->prepare("
        SELECT
            company_name,
            money,
            owner
        FROM company_money
        ORDER BY money DESC
        LIMIT 10
    ");
    $stmt->execute();
    $hallOfFame['richest_companies'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Gang Money Leaderboard (if table exists)
    try {
        $stmt = $fivemDb->prepare("
            SELECT
                gang_name,
                money,
                leader
            FROM gang_money
            ORDER BY money DESC
            LIMIT 10
        ");
        $stmt->execute();
        $hallOfFame['richest_gangs'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        $hallOfFame['richest_gangs'] = [];
    }

    echo json_encode([
        'success' => true,
        'hall_of_fame' => $hallOfFame
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch hall of fame: ' . $e->getMessage()
    ]);
}
?>
