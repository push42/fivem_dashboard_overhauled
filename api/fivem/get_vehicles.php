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

    // Get vehicles with owner information
    $stmt = $fivemDb->prepare("
        SELECT
            v.owner,
            v.plate,
            v.vehicle,
            v.stored,
            u.firstname,
            u.lastname
        FROM vehicles v
        LEFT JOIN users u ON v.owner = u.identifier
        ORDER BY v.plate
    ");

    $stmt->execute();
    $vehicles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode vehicle JSON data
    foreach ($vehicles as &$vehicle) {
        if ($vehicle['vehicle']) {
            $vehicleData = json_decode($vehicle['vehicle'], true);
            $vehicle['model'] = $vehicleData['model'] ?? 'Unknown';
            $vehicle['color'] = $vehicleData['color1'] ?? null;
        }
        $vehicle['owner_name'] = ($vehicle['firstname'] ?? '') . ' ' . ($vehicle['lastname'] ?? '');
    }

    echo json_encode([
        'success' => true,
        'vehicles' => $vehicles,
        'total' => count($vehicles)
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Failed to fetch vehicles: ' . $e->getMessage()
    ]);
}

// Clean output and send
$output = ob_get_clean();
header('Content-Type: application/json');
echo $output;
?>
