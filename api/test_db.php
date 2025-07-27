<?php
// Database connection test
require_once 'config/database.php';

try {
    $database = Database::getInstance();
    $db = $database->getConnection();

    echo "Database connection successful!\n";
    echo "Database type: " . DB_TYPE . "\n";
    echo "Database name: " . DB_NAME . "\n";

    // Test if staff_accounts table exists
    $stmt = $db->query("SHOW TABLES LIKE 'staff_accounts'");
    if ($stmt->rowCount() > 0) {
        echo "staff_accounts table exists\n";

        // Check if admin user exists
        $adminStmt = $db->prepare("SELECT username FROM staff_accounts WHERE username = 'admin'");
        $adminStmt->execute();
        if ($adminStmt->fetch()) {
            echo "Admin user exists\n";
        } else {
            echo "Admin user does NOT exist\n";
        }
    } else {
        echo "staff_accounts table does NOT exist\n";
        echo "You need to run the MySQL database setup script!\n";
    }

} catch (Exception $e) {
    echo "Database connection failed: " . $e->getMessage() . "\n";
}
?>
