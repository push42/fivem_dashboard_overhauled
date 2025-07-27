<?php
try {
    $dsn = "pgsql:host=localhost;port=5432;dbname=fivem_dashboard";
    $pdo = new PDO($dsn, 'postgres', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get all tables
    $stmt = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "Current tables in database:\n";
    if (empty($tables)) {
        echo "No tables found!\n";
    } else {
        foreach ($tables as $table) {
            echo "- $table\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
