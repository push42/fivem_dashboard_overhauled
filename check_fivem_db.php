<?php
try {
    // Try to connect to FiveM database (MySQL based on config)
    $dsn = "mysql:host=localhost;port=3306;dbname=db_fivemtest";
    $pdo = new PDO($dsn, 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Connected to FiveM database successfully!\n";

    // Check if users table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "✅ users table exists in FiveM database\n";

        // Get some basic info
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "Records in users table: {$count['count']}\n";

        // Show table structure
        $stmt = $pdo->query("DESCRIBE users");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "\nusers table structure:\n";
        foreach ($columns as $column) {
            echo "- {$column['Field']}: {$column['Type']}\n";
        }
    } else {
        echo "❌ users table does not exist in FiveM database\n";

        // Show what tables do exist
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        echo "Available tables:\n";
        foreach ($tables as $table) {
            echo "- $table\n";
        }
    }

} catch (PDOException $e) {
    echo "❌ Could not connect to FiveM database: " . $e->getMessage() . "\n";
    echo "This might be because:\n";
    echo "1. MySQL is not running in Laragon\n";
    echo "2. The database 'db_fivemtest' doesn't exist\n";
    echo "3. Connection credentials are wrong\n";
}
?>
