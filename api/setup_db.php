<?php
/**
 * Database Setup Script - Supports both MySQL and PostgreSQL
 * Creates the database and runs the appropriate schema
 */

// Configuration - Change this to match your setup
$dbType = 'postgresql'; // 'mysql' or 'postgresql'
$host = 'localhost';
$user = $dbType === 'postgresql' ? 'postgres' : 'root';
$pass = '';
$dbname = 'fivem_dashboard';
$port = $dbType === 'postgresql' ? 5432 : 3306;

// First, connect without specifying the database to create it
try {
    if ($dbType === 'postgresql') {
        // Connect to PostgreSQL server (default to 'postgres' database)
        $pdo = new PDO("pgsql:host=$host;port=$port;dbname=postgres", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Check if database exists
        $stmt = $pdo->prepare("SELECT 1 FROM pg_database WHERE datname = ?");
        $stmt->execute([$dbname]);

        if (!$stmt->fetch()) {
            // Create database if it doesn't exist
            $pdo->exec("CREATE DATABASE \"$dbname\" WITH ENCODING='UTF8'");
            echo "PostgreSQL database '$dbname' created.\n";
        } else {
            echo "PostgreSQL database '$dbname' already exists.\n";
        }

        // Connect to the specific database
        $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass);
        $schemaFile = '../sql/fivem_dashboard_postgresql.sql';

    } else {
        // MySQL setup
        $pdo = new PDO("mysql:host=$host;port=$port", $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Create database if it doesn't exist
        $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        echo "MySQL database '$dbname' created or already exists.\n";

        // Connect to the specific database
        $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname", $user, $pass);
        $schemaFile = '../sql/fivem_dashboard_mysql.sql';
    }

    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


    // Read and execute the appropriate schema
    if (file_exists($schemaFile)) {
        $schema = file_get_contents($schemaFile);

        if ($dbType === 'postgresql') {
            // For PostgreSQL, execute the entire schema as one transaction
            try {
                $pdo->exec($schema);
                echo "PostgreSQL schema imported successfully!\n";
            } catch (Exception $e) {
                echo "PostgreSQL schema import failed: " . $e->getMessage() . "\n";
            }
        } else {
            // For MySQL, split by semicolons and execute each statement
            $statements = array_filter(array_map('trim', explode(';', $schema)));

            foreach ($statements as $statement) {
                if (!empty($statement)) {
                    try {
                        $pdo->exec($statement);
                    } catch (Exception $e) {
                        // Some statements might fail if already exists, continue
                        echo "Warning: " . $e->getMessage() . "\n";
                    }
                }
            }
            echo "MySQL schema imported successfully!\n";
        }

        // Check if admin user exists
        $stmt = $pdo->prepare("SELECT username FROM staff_accounts WHERE username = 'admin'");
        $stmt->execute();
        if ($stmt->fetch()) {
            echo "Admin user exists. You can login with username 'admin' and password 'password'\n";
            echo "⚠️  IMPORTANT: Change the default admin password immediately!\n";
        } else {
            echo "Admin user was not created. Check the schema file.\n";
        }

    } else {
        echo "Schema file not found: $schemaFile\n";
        echo "Available schema files:\n";
        echo "  - ../sql/fivem_dashboard_mysql.sql\n";
        echo "  - ../sql/fivem_dashboard_postgresql.sql\n";
    }

    echo "\n✅ Setup complete! Your database type: $dbType\n";
    echo "🌐 You can now access: http://fivem_dashboard.test/\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\n💡 Troubleshooting tips:\n";
    echo "  - Make sure PostgreSQL/MySQL is running in Laragon\n";
    echo "  - Check your database credentials in the script\n";
    echo "  - Verify the database user has create database permissions\n";
}
?>
