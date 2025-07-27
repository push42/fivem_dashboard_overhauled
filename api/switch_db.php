<?php
/**
 * Database Configuration Switcher
 * Easily switch between MySQL and PostgreSQL
 */

if ($argc < 2) {
    echo "Usage: php switch_db.php [mysql|postgresql]\n";
    echo "Current configuration:\n";

    // Read current config
    $configFile = 'config/database.php';
    $content = file_get_contents($configFile);

    if (strpos($content, "'postgresql'") !== false) {
        echo "  Database Type: PostgreSQL\n";
    } elseif (strpos($content, "'mysql'") !== false) {
        echo "  Database Type: MySQL\n";
    } else {
        echo "  Database Type: Unknown\n";
    }

    exit(1);
}

$dbType = strtolower($argv[1]);

if (!in_array($dbType, ['mysql', 'postgresql'])) {
    echo "Error: Database type must be 'mysql' or 'postgresql'\n";
    exit(1);
}

try {
    // Read current config file
    $configFile = 'config/database.php';
    $content = file_get_contents($configFile);

    if ($dbType === 'mysql') {
        // Switch to MySQL
        $content = preg_replace(
            "/define\('DB_TYPE', 'postgresql'\)/",
            "define('DB_TYPE', 'mysql')",
            $content
        );
        $content = preg_replace(
            "/define\('DB_USER', 'postgres'\)/",
            "define('DB_USER', 'root')",
            $content
        );
        echo "✅ Switched to MySQL configuration\n";
        echo "💡 Run 'php setup_db.php' to set up MySQL database\n";

    } else {
        // Switch to PostgreSQL
        $content = preg_replace(
            "/define\('DB_TYPE', 'mysql'\)/",
            "define('DB_TYPE', 'postgresql')",
            $content
        );
        $content = preg_replace(
            "/define\('DB_USER', 'root'\)/",
            "define('DB_USER', 'postgres')",
            $content
        );
        echo "✅ Switched to PostgreSQL configuration\n";
        echo "💡 Run 'php setup_db.php' to set up PostgreSQL database\n";
    }

    // Write updated config
    file_put_contents($configFile, $content);

    // Also update setup_db.php
    $setupContent = file_get_contents('setup_db.php');
    $setupContent = preg_replace(
        "/\\\$dbType = '[^']+'/",
        "\$dbType = '$dbType'",
        $setupContent
    );
    file_put_contents('setup_db.php', $setupContent);

    echo "🔄 Configuration files updated\n";
    echo "🌐 Your dashboard: http://fivem_dashboard.test/\n";

} catch (Exception $e) {
    echo "❌ Error updating configuration: " . $e->getMessage() . "\n";
}
?>
