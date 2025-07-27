<?php
require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    $db = Database::getInstance();
    $fivemDb = $db->getFivemConnection();

    // Get vehicles with owner information
    $stmt = $fivemDb->prepare("
        SELECT
            ov.owner,
            ov.plate,
            ov.vehicle,
            ov.stored,
            u.firstname,
            u.lastname
        FROM owned_vehicles ov
        LEFT JOIN users u ON ov.owner = u.identifier
        ORDER BY ov.plate
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
?>
