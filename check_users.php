<?php
try {
    $dsn = "pgsql:host=localhost;port=5432;dbname=fivem_dashboard";
    $pdo = new PDO($dsn, 'postgres', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if staff_accounts table exists and get its structure
    $stmt = $pdo->query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'staff_accounts' AND table_schema = 'public' ORDER BY ordinal_position");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($columns)) {
        echo "staff_accounts table does not exist!\n";
    } else {
        echo "staff_accounts table structure:\n";
        foreach ($columns as $column) {
            echo "- {$column['column_name']}: {$column['data_type']}\n";
        }
    }

    // Check for any data
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM staff_accounts");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "\nRecords in staff_accounts: {$count['count']}\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
