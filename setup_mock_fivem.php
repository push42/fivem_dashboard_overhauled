<?php
try {
    $dsn = "pgsql:host=localhost;port=5432;dbname=fivem_dashboard";
    $pdo = new PDO($dsn, 'postgres', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Creating mock FiveM tables...\n";

    // Read and execute the SQL file
    $sql = file_get_contents('create_mock_fivem_tables.sql');

    // Split by semicolon and execute each statement
    $statements = array_filter(array_map('trim', explode(';', $sql)));

    foreach ($statements as $statement) {
        if (!empty($statement) && !str_starts_with(trim($statement), '--')) {
            try {
                $pdo->exec($statement);
                echo "✅ Executed statement successfully\n";
            } catch (PDOException $e) {
                echo "⚠️  Statement warning: " . $e->getMessage() . "\n";
            }
        }
    }

    // Verify tables were created
    $stmt = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'vehicles', 'jobs') ORDER BY table_name");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "\n✅ Mock FiveM tables created:\n";
    foreach ($tables as $table) {
        echo "- $table\n";
    }

    // Check user count
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Mock users created: {$count['count']}\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
