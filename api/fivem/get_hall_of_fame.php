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

    $hallOfFame = [];

    // Richest Players (by bank + money) - using separate money and bank columns
    if ($fivemDbType === 'postgresql') {
        $stmt = $fivemDb->prepare("
            SELECT
                identifier,
                firstname,
                lastname,
                money,
                bank,
                (COALESCE(money, 0) + COALESCE(bank, 0)) as total_money
            FROM users
            WHERE identifier IS NOT NULL
            ORDER BY total_money DESC
            LIMIT 10
        ");
    } else {
        $stmt = $fivemDb->prepare("
            SELECT
                identifier,
                firstname,
                lastname,
                money,
                bank,
                (COALESCE(money, 0) + COALESCE(bank, 0)) as total_money
            FROM users
            WHERE identifier IS NOT NULL
            ORDER BY total_money DESC
            LIMIT 10
        ");
    }
    $stmt->execute();
    $hallOfFame['richest'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Most Vehicles - using vehicles table instead of owned_vehicles
    $stmt = $fivemDb->prepare("
        SELECT
            u.identifier,
            u.firstname,
            u.lastname,
            COUNT(v.owner) as vehicle_count
        FROM users u
        LEFT JOIN vehicles v ON u.identifier = v.owner
        GROUP BY u.identifier, u.firstname, u.lastname
        ORDER BY vehicle_count DESC
        LIMIT 10
    ");
    $stmt->execute();
    $hallOfFame['most_vehicles'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Most Active (by last login) - using last_login instead of last_seen
    if ($fivemDbType === 'postgresql') {
        $stmt = $fivemDb->prepare("
            SELECT
                identifier,
                firstname,
                lastname,
                last_login,
                last_login::text as last_seen_formatted
            FROM users
            ORDER BY last_login DESC NULLS LAST
            LIMIT 10
        ");
    } else {
        $stmt = $fivemDb->prepare("
            SELECT
                identifier,
                firstname,
                lastname,
                last_login as last_seen,
                DATE_FORMAT(last_login, '%Y-%m-%d %H:%i:%s') as last_seen_formatted
            FROM users
            ORDER BY last_login DESC
            LIMIT 10
        ");
    }
    $stmt->execute();
    $hallOfFame['most_active'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Company Money Leaderboard
    try {
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
    } catch (Exception $e) {
        $hallOfFame['richest_companies'] = [];
    }

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
        'hall_of_fame' => $hallOfFame,
        'database_type' => $fivemDbType
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch hall of fame: ' . $e->getMessage()
    ]);
}

// Clean output and send
$output = ob_get_clean();
header('Content-Type: application/json');
echo $output;
?>
